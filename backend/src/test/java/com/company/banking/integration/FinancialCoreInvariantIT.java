package com.company.banking.integration;

import com.company.banking.account.application.port.out.AccountPersistencePort;
import com.company.banking.account.domain.Account;
import com.company.banking.transaction.domain.EntryType;
import com.company.banking.transaction.domain.LedgerEntry;
import com.company.banking.transaction.infrastructure.LedgerEntryJpaRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;

import java.math.BigDecimal;
import java.util.List;
import java.util.concurrent.CountDownLatch;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import com.company.banking.payment.application.PaymentIntentService;
import com.company.banking.payment.domain.PaymentIntent;
import com.company.banking.payment.domain.PaymentIntentStatus;
import com.company.banking.payment.infrastructure.PaymentIntentJpaRepository;
import com.company.banking.payment.infrastructure.RefundJpaRepository;

import static org.junit.jupiter.api.Assertions.assertEquals;

@SpringBootTest
@ActiveProfiles("test")
public class FinancialCoreInvariantIT {

    @Autowired
    private AccountPersistencePort accountPersistencePort;

    @Autowired
    private LedgerEntryJpaRepository ledgerEntryRepository;

    @Autowired
    private com.company.banking.account.infrastructure.AccountJpaRepository accountJpaRepository;

    @Autowired
    private com.company.banking.transaction.infrastructure.TransactionJpaRepository transactionRepository;

    @Autowired
    private com.company.banking.settlement.infrastructure.MerchantBalanceJpaRepository merchantBalanceRepository;

    @Autowired
    private com.company.banking.settlement.infrastructure.SettlementInstructionJpaRepository instructionRepository;

    @Autowired
    private com.company.banking.settlement.infrastructure.SettlementBatchJpaRepository batchRepository;

    @Autowired
    private PaymentIntentService paymentIntentService;

    @Autowired
    private PaymentIntentJpaRepository paymentIntentRepository;

    @Autowired
    private RefundJpaRepository refundRepository;

    @Test
    public void ledgerDerivedBalance_ShouldExactlyMatchStoredAccountBalance() {
        // 1. Purge all data to ensure isolation
        instructionRepository.deleteAll();
        batchRepository.deleteAll();
        ledgerEntryRepository.deleteAll();
        transactionRepository.deleteAll();
        merchantBalanceRepository.deleteAll();
        accountJpaRepository.deleteAll();

        // 2. Setup Accounts with Initial Balances and corresponding Ledger Entries
        String acc1 = "CORE-INV-001";
        String acc2 = "CORE-INV-002";
        
        accountPersistencePort.save(Account.builder()
                .accountNumber(acc1).customerId(1L).currency("PHP")
                .balance(new BigDecimal("1000.00")).status(com.company.banking.common.enums.AccountStatus.ACTIVE)
                .allowOutgoing(true).allowIncoming(true).build());

        accountPersistencePort.save(Account.builder()
                .accountNumber(acc2).customerId(2L).currency("PHP")
                .balance(new BigDecimal("500.00")).status(com.company.banking.common.enums.AccountStatus.ACTIVE)
                .allowOutgoing(true).allowIncoming(true).build());

        // We MUST create ledger entries for the initial balances to satisfy the invariant
        ledgerEntryRepository.save(LedgerEntry.builder().transactionReference("INIT-DEP-1").accountNumber("SYSTEM").entryType(EntryType.DEBIT).amount(new BigDecimal("1000.00")).currency("PHP").build());
        ledgerEntryRepository.save(LedgerEntry.builder().transactionReference("INIT-DEP-2").accountNumber("SYSTEM").entryType(EntryType.DEBIT).amount(new BigDecimal("500.00")).currency("PHP").build());
        ledgerEntryRepository.save(LedgerEntry.builder()
                .transactionReference("INIT-DEP-1")
                .accountNumber(acc1)
                .entryType(EntryType.CREDIT)
                .amount(new BigDecimal("1000.00"))
                .currency("PHP")
                .build());

        ledgerEntryRepository.save(LedgerEntry.builder()
                .transactionReference("INIT-DEP-2")
                .accountNumber(acc2)
                .entryType(EntryType.CREDIT)
                .amount(new BigDecimal("500.00"))
                .currency("PHP")
                .build());

        // 3. Perform the invariant check
        List<Account> allAccounts = accountPersistencePort.findAll();

        for (Account account : allAccounts) {
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

            BigDecimal derivedBalance = totalCredits.subtract(totalDebits);

            assertEquals(0, derivedBalance.compareTo(account.getBalance()), 
                "CRITICAL: Account " + account.getAccountNumber() + " has diverged from the immutable ledger! Derived: " + derivedBalance + ", Stored: " + account.getBalance());
        }
    }

    @Test
    public void concurrentCapturesAndRefunds_ShouldMaintainDoubleEntryInvariant() throws InterruptedException {
        // 1. Purge
        instructionRepository.deleteAll();
        batchRepository.deleteAll();
        ledgerEntryRepository.deleteAll();
        transactionRepository.deleteAll();
        refundRepository.deleteAll();
        paymentIntentRepository.deleteAll();
        merchantBalanceRepository.deleteAll();
        accountJpaRepository.deleteAll();

        // 2. Setup
        String custAcc = "CUST-001";
        accountPersistencePort.save(Account.builder()
                .accountNumber(custAcc).customerId(1L).currency("PHP")
                .balance(new BigDecimal("10000.00")).status(com.company.banking.common.enums.AccountStatus.ACTIVE)
                .allowOutgoing(true).allowIncoming(true).build());

        ledgerEntryRepository.save(LedgerEntry.builder().transactionReference("INIT-DEP").accountNumber("SYSTEM").entryType(EntryType.DEBIT).amount(new BigDecimal("10000.00")).currency("PHP").build());
        ledgerEntryRepository.save(LedgerEntry.builder()
                .transactionReference("INIT-DEP")
                .accountNumber(custAcc)
                .entryType(EntryType.CREDIT)
                .amount(new BigDecimal("10000.00"))
                .currency("PHP")
                .build());

        PaymentIntent intent = paymentIntentService.createIntent(99L, custAcc, new BigDecimal("1000.00"), "PHP");
        paymentIntentService.authorizeIntent(intent.getIntentId(), 99L);

        // 3. Concurrently attempt to capture the SAME intent 10 times
        int threadCount = 10;
        ExecutorService executor = Executors.newFixedThreadPool(threadCount);
        CountDownLatch latch = new CountDownLatch(1);
        CountDownLatch done = new CountDownLatch(threadCount);

        for (int i = 0; i < threadCount; i++) {
            executor.submit(() -> {
                try {
                    latch.await();
                    paymentIntentService.captureIntent(intent.getIntentId(), 99L);
                } catch (Exception e) {
                    // Expected to fail for 9 threads due to optimistic locking or state check
                } finally {
                    done.countDown();
                }
            });
        }

        latch.countDown(); // start all
        done.await(); // wait all

        // 4. Assert Invariants
        PaymentIntent finalIntent = paymentIntentRepository.findByIntentId(intent.getIntentId()).get();
        assertEquals(PaymentIntentStatus.CAPTURED, finalIntent.getStatus());

        // Account balance should be deducted EXACTLY once (10000 - 1000)
        Account finalAcc = accountJpaRepository.findByAccountNumber(custAcc).get();
        assertEquals(0, new BigDecimal("9000.00").compareTo(finalAcc.getBalance()));

        // Double-entry validation
        List<LedgerEntry> allEntries = ledgerEntryRepository.findAll();
        
        BigDecimal totalDebits = allEntries.stream()
                .filter(e -> e.getEntryType() == EntryType.DEBIT)
                .map(LedgerEntry::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
                
        BigDecimal totalCredits = allEntries.stream()
                .filter(e -> e.getEntryType() == EntryType.CREDIT)
                .map(LedgerEntry::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
                
        assertEquals(0, totalDebits.compareTo(totalCredits), "CRITICAL: System Double-Entry Ledger is unbalanced!");
    }
}
