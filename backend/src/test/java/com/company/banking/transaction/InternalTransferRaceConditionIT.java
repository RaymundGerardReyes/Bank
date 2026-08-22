package com.company.banking.transaction;

import com.company.banking.account.application.port.out.AccountPersistencePort;
import com.company.banking.account.domain.Account;
import com.company.banking.common.enums.AccountStatus;
import com.company.banking.transaction.api.dto.InternalTransferRequest;
import com.company.banking.transaction.application.InternalTransferService;
import com.company.banking.transaction.infrastructure.TransactionJpaRepository;
import org.junit.jupiter.api.BeforeEach;
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

@SpringBootTest
@ActiveProfiles("test")
public class InternalTransferRaceConditionIT {

    @Autowired
    private InternalTransferService internalTransferService;

    @Autowired
    private AccountPersistencePort accountPersistencePort;

    @Autowired
    private TransactionJpaRepository transactionJpaRepository;

    private Account accountA;
    private Account accountB;

    @BeforeEach
    public void setup() {
        transactionJpaRepository.deleteAll();
        
        accountA = Account.builder()
                .accountNumber("ACC-A-1001")
                .customerId(1L)
                .balance(new BigDecimal("5000.00"))
                .currency("PHP")
                .status(AccountStatus.ACTIVE)
                .allowOutgoing(true)
                .allowIncoming(true)
                .build();
        accountA = accountPersistencePort.save(accountA);

        accountB = Account.builder()
                .accountNumber("ACC-B-2002")
                .customerId(2L)
                .balance(new BigDecimal("5000.00"))
                .currency("PHP")
                .status(AccountStatus.ACTIVE)
                .allowOutgoing(true)
                .allowIncoming(true)
                .build();
        accountB = accountPersistencePort.save(accountB);
    }

    @Test
    public void concurrentOppositeTransfers_ShouldNotDeadlock() throws InterruptedException {
        int threads = 10;
        ExecutorService executor = Executors.newFixedThreadPool(threads);
        CountDownLatch startPistol = new CountDownLatch(1);
        CountDownLatch finishLine = new CountDownLatch(threads);

        AtomicInteger successCount = new AtomicInteger(0);

        for (int i = 0; i < threads; i++) {
            // Half the threads send A -> B, the other half send B -> A
            final boolean aToB = (i % 2 == 0);
            
            executor.submit(() -> {
                try {
                    startPistol.await();
                    InternalTransferRequest request = InternalTransferRequest.builder()
                            .sourceAccountNumber(aToB ? accountA.getAccountNumber() : accountB.getAccountNumber())
                            .destinationAccountNumber(aToB ? accountB.getAccountNumber() : accountA.getAccountNumber())
                            .amount(new BigDecimal("100.00"))
                            .idempotencyKey(UUID.randomUUID().toString())
                            .description("Deadlock Prevention Test")
                            .build();

                    internalTransferService.processInternalTransfer(request);
                    successCount.incrementAndGet();
                } catch (Exception e) {
                    e.printStackTrace();
                } finally {
                    finishLine.countDown();
                }
            });
        }

        startPistol.countDown(); // Unleash the threads
        boolean completedNormally = finishLine.await(15, TimeUnit.SECONDS);

        assertTrue(completedNormally, "Test timed out! A database deadlock likely occurred.");
        assertEquals(10, successCount.get(), "All 10 internal transfers must complete successfully.");

        // Verify final balances: 5 transfers A->B (500), 5 transfers B->A (500). Net change should be zero.
        Account finalA = accountPersistencePort.findByAccountNumber(accountA.getAccountNumber()).orElseThrow();
        Account finalB = accountPersistencePort.findByAccountNumber(accountB.getAccountNumber()).orElseThrow();

        assertEquals(0, new BigDecimal("5000.00").compareTo(finalA.getBalance()), "Account A balance should remain unchanged overall");
        assertEquals(0, new BigDecimal("5000.00").compareTo(finalB.getBalance()), "Account B balance should remain unchanged overall");
    }
}
