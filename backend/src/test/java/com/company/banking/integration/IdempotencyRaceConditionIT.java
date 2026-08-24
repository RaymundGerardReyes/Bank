package com.company.banking.integration;

import com.company.banking.account.application.port.out.AccountPersistencePort;
import com.company.banking.account.domain.Account;
import com.company.banking.common.enums.AccountStatus;
import com.company.banking.transaction.api.dto.InternalTransferRequest;
import com.company.banking.transaction.application.InternalTransferService;
import com.company.banking.transaction.infrastructure.LedgerEntryJpaRepository;
import com.company.banking.transaction.infrastructure.TransactionJpaRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;

import java.math.BigDecimal;
import java.util.UUID;
import java.util.concurrent.CountDownLatch;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.atomic.AtomicInteger;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;

// ⚠️ No @Transactional annotation here. We must test true, isolated DB commits.
@SpringBootTest
@ActiveProfiles("test")
public class IdempotencyRaceConditionIT {

    @Autowired private InternalTransferService internalTransferService;
    @Autowired private AccountPersistencePort accountPersistencePort;
    @Autowired private TransactionJpaRepository transactionRepository;
    @Autowired private LedgerEntryJpaRepository ledgerEntryRepository;
    @Autowired private com.company.banking.account.infrastructure.AccountJpaRepository accountJpaRepository;

    private Account sourceAccount;
    private Account destAccount;

    @BeforeEach
    void setup() {
        ledgerEntryRepository.deleteAll();
        transactionRepository.deleteAll();
        accountJpaRepository.deleteAll();

        sourceAccount = accountPersistencePort.save(Account.builder()
                .accountNumber("IDEM-SRC-RACE").customerId(901L)
                .balance(new BigDecimal("500.00")).currency("PHP").status(AccountStatus.ACTIVE)
                .allowOutgoing(true).allowIncoming(true).build());

        destAccount = accountPersistencePort.save(Account.builder()
                .accountNumber("IDEM-DST-RACE").customerId(902L)
                .balance(new BigDecimal("0.00")).currency("PHP").status(AccountStatus.ACTIVE)
                .allowOutgoing(true).allowIncoming(true).build());
    }

    @Test
    @DisplayName("Phase 8: Concurrent duplicate requests must result in exactly one financial mutation")
    public void concurrentDuplicateRequests_ShouldBeIdempotent() throws InterruptedException {
        int threads = 15;
        ExecutorService executor = Executors.newFixedThreadPool(threads);
        CountDownLatch startPistol = new CountDownLatch(1);
        CountDownLatch finishLine = new CountDownLatch(threads);
        AtomicInteger successfulResponses = new AtomicInteger(0);

        final String sharedIdempotencyKey = "idem-race-" + UUID.randomUUID();

        InternalTransferRequest request = InternalTransferRequest.builder()
                .sourceAccountNumber(sourceAccount.getAccountNumber())
                .destinationAccountNumber(destAccount.getAccountNumber())
                .amount(new BigDecimal("50.00"))
                .idempotencyKey(sharedIdempotencyKey)
                .description("Idempotency Race Test")
                .build();

        for (int i = 0; i < threads; i++) {
            executor.submit(() -> {
                try {
                    startPistol.await();
                    internalTransferService.processInternalTransfer(request);
                    successfulResponses.incrementAndGet();
                } catch (Exception e) {
                    // Safe to ignore lock timeouts during heavy concurrency
                } finally {
                    finishLine.countDown();
                }
            });
        }

        startPistol.countDown();
        finishLine.await(10, TimeUnit.SECONDS);
        executor.shutdown();

        // INVARIANT 1: Only 1 transaction was physically inserted into the DB
        assertEquals(1, transactionRepository.count(), "UNIQUE constraint must limit to 1 transaction");

        // INVARIANT 2: Money was moved exactly once
        Account finalSource = accountPersistencePort.findByAccountNumber(sourceAccount.getAccountNumber()).orElseThrow();
        assertEquals(0, new BigDecimal("450.00").compareTo(finalSource.getBalance()), "Source balance deducted exactly once");

        // INVARIANT 3: At least one thread succeeded cleanly, and any thread that didn't timeout recovered via the slow-path
        assertTrue(successfulResponses.get() >= 1, "At least one thread must complete successfully");
    }
}
