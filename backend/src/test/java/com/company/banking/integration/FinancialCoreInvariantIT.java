package com.company.banking.integration;

import com.company.banking.account.application.port.out.AccountPersistencePort;
import com.company.banking.account.domain.Account;
import com.company.banking.common.enums.AccountStatus;
import com.company.banking.transaction.api.dto.InternalTransferRequest;
import com.company.banking.transaction.application.InternalTransferService;
import com.company.banking.transaction.domain.EntryType;
import com.company.banking.transaction.domain.LedgerEntry;
import com.company.banking.transaction.infrastructure.LedgerEntryJpaRepository;
import com.company.banking.transaction.infrastructure.TransactionJpaRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import org.springframework.test.context.ActiveProfiles;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;
import java.util.concurrent.CountDownLatch;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.TimeUnit;

import static org.junit.jupiter.api.Assertions.assertEquals;

@SpringBootTest
@ActiveProfiles("test")

public class FinancialCoreInvariantIT {

    @Autowired
    private InternalTransferService internalTransferService;

    @Autowired
    private AccountPersistencePort accountPersistencePort;

    @Autowired
    private LedgerEntryJpaRepository ledgerEntryRepository;

    @Autowired
    private TransactionJpaRepository transactionRepository;

    @Autowired
    private com.company.banking.account.infrastructure.AccountJpaRepository accountJpaRepository;

    private Account accountA;
    private Account accountB;
    private Account accountC;

    private final BigDecimal INITIAL_BALANCE_A = new BigDecimal("10000.00");
    private final BigDecimal INITIAL_BALANCE_B = new BigDecimal("5000.00");
    private final BigDecimal INITIAL_BALANCE_C = new BigDecimal("0.00");

    @BeforeEach
    void setup() {
        ledgerEntryRepository.deleteAll();
        transactionRepository.deleteAll();
        accountJpaRepository.deleteAll();

        accountA = createAccount("ACC-INV-A", INITIAL_BALANCE_A);
        accountB = createAccount("ACC-INV-B", INITIAL_BALANCE_B);
        accountC = createAccount("ACC-INV-C", INITIAL_BALANCE_C);
    }

    private Account createAccount(String accountNumber, BigDecimal initialBalance) {
        return accountPersistencePort.save(Account.builder()
                .accountNumber(accountNumber)
                .customerId(100L)
                .balance(initialBalance)
                .currency("PHP")
                .status(AccountStatus.ACTIVE)
                .allowOutgoing(true)
                .allowIncoming(true)
                .build());
    }

    @Test
    @DisplayName("Phase 6: Ledger-Derived Balance Should Exactly Match Stored Account Balance After Real Transfers")
    public void ledgerDerivedBalance_ShouldExactlyMatchStoredAccountBalance_AfterRealTransfers() throws InterruptedException {
        int threads = 15;
        ExecutorService executor = Executors.newFixedThreadPool(threads);
        CountDownLatch startPistol = new CountDownLatch(1);
        CountDownLatch finishLine = new CountDownLatch(threads);

        // Execute concurrent real transfers to create realistic, heavy load
        for (int i = 0; i < threads; i++) {
            final int threadIndex = i;
            executor.submit(() -> {
                try {
                    startPistol.await();
                    
                    // Mix of transfers: A->B, B->C, A->C
                    String source = threadIndex % 3 == 0 ? accountA.getAccountNumber() : accountB.getAccountNumber();
                    String dest = threadIndex % 2 == 0 ? accountC.getAccountNumber() : accountA.getAccountNumber();
                    
                    if (!source.equals(dest)) {
                        InternalTransferRequest request = InternalTransferRequest.builder()
                                .sourceAccountNumber(source)
                                .destinationAccountNumber(dest)
                                .amount(new BigDecimal("100.00"))
                                .idempotencyKey(UUID.randomUUID().toString())
                                .description("Invariant Test Transfer")
                                .build();
                        internalTransferService.processInternalTransfer(request);
                    }
                } catch (Exception e) {
                    // Ignore expected concurrency locks or insufficient funds
                } finally {
                    finishLine.countDown();
                }
            });
        }

        startPistol.countDown();
        finishLine.await(15, TimeUnit.SECONDS);
        executor.shutdown();

        // 1. INDIVIDUAL ACCOUNT INVARIANT VERIFICATION
        verifyAccountInvariant(accountA, INITIAL_BALANCE_A);
        verifyAccountInvariant(accountB, INITIAL_BALANCE_B);
        verifyAccountInvariant(accountC, INITIAL_BALANCE_C);
        
        // 2. GLOBAL CONSERVATION INVARIANT
        BigDecimal finalA = accountPersistencePort.findByAccountNumber(accountA.getAccountNumber()).orElseThrow().getBalance();
        BigDecimal finalB = accountPersistencePort.findByAccountNumber(accountB.getAccountNumber()).orElseThrow().getBalance();
        BigDecimal finalC = accountPersistencePort.findByAccountNumber(accountC.getAccountNumber()).orElseThrow().getBalance();
        
        BigDecimal expectedSystemTotal = INITIAL_BALANCE_A.add(INITIAL_BALANCE_B).add(INITIAL_BALANCE_C);
        BigDecimal actualSystemTotal = finalA.add(finalB).add(finalC);
        
        assertEquals(0, expectedSystemTotal.compareTo(actualSystemTotal), 
            "CRITICAL: Total system money must be perfectly conserved after all operations.");
    }

    private void verifyAccountInvariant(Account account, BigDecimal initialBalance) {
        Account currentAccount = accountPersistencePort.findByAccountNumber(account.getAccountNumber()).orElseThrow();
        
        List<LedgerEntry> entries = ledgerEntryRepository.findAll().stream()
                .filter(e -> e.getAccountNumber().equals(account.getAccountNumber()))
                .toList();

        BigDecimal totalCredits = entries.stream()
                .filter(e -> e.getEntryType() == EntryType.CREDIT)
                .map(LedgerEntry::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal totalDebits = entries.stream()
                .filter(e -> e.getEntryType() == EntryType.DEBIT)
                .map(LedgerEntry::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        // Mathematical formula: Derived = Initial + Credits - Debits
        BigDecimal derivedBalance = initialBalance.add(totalCredits).subtract(totalDebits);

        assertEquals(0, derivedBalance.compareTo(currentAccount.getBalance()), 
            "CRITICAL INVARIANT FAILURE: Ledger-derived balance does not match authoritative stored balance for account " + account.getAccountNumber());
    }
}
