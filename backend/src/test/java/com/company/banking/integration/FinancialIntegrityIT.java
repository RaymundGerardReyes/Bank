package com.company.banking.integration;

import com.company.banking.account.application.port.out.AccountPersistencePort;
import com.company.banking.account.domain.Account;
import com.company.banking.common.enums.AccountStatus;
import com.company.banking.common.exception.BusinessException;
import com.company.banking.payment.application.InternalPaymentExecutionService;
import com.company.banking.payment.domain.PaymentIntent;
import com.company.banking.payment.domain.PaymentIntentStatus;
import com.company.banking.payment.infrastructure.PaymentIntentJpaRepository;
import com.company.banking.transaction.api.dto.InternalTransferRequest;
import com.company.banking.transaction.application.InternalTransferService;
import com.company.banking.transaction.domain.EntryType;
import com.company.banking.transaction.domain.LedgerEntry;
import com.company.banking.transaction.domain.Transaction;
import com.company.banking.transaction.infrastructure.LedgerEntryJpaRepository;
import com.company.banking.transaction.infrastructure.TransactionJpaRepository;
import com.company.banking.account.infrastructure.AccountJpaRepository;
import com.company.banking.payment.infrastructure.RefundJpaRepository;
import org.junit.jupiter.api.BeforeEach;
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
import java.util.concurrent.atomic.AtomicInteger;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;

@SpringBootTest
@ActiveProfiles("test")
public class FinancialIntegrityIT {

    @Autowired
    private InternalTransferService transferService;

    @Autowired
    private InternalPaymentExecutionService paymentExecutionService;

    @Autowired
    private AccountPersistencePort accountPersistencePort;

    @Autowired
    private TransactionJpaRepository transactionRepository;

    @Autowired
    private LedgerEntryJpaRepository ledgerEntryRepository;

    @Autowired
    private PaymentIntentJpaRepository paymentIntentRepository;

    @Autowired
    private AccountJpaRepository accountJpaRepository;

    @Autowired
    private RefundJpaRepository refundJpaRepository;

    private Account customerA;
    private Account customerB;
    private Account merchantAccount;

    @BeforeEach
    public void setup() {
        // Purge state for clean testing
        ledgerEntryRepository.deleteAll();
        transactionRepository.deleteAll();
        refundJpaRepository.deleteAll();
        paymentIntentRepository.deleteAll();
        accountJpaRepository.deleteAll();

        // Setup Initial Conserved System: Total 150,000.00
        customerA = accountPersistencePort.save(Account.builder()
                .accountNumber("CUST-A-100")
                .customerId(1L)
                .balance(new BigDecimal("100000.00"))
                .currency("PHP")
                .status(AccountStatus.ACTIVE)
                .allowOutgoing(true).allowIncoming(true)
                .build());

        customerB = accountPersistencePort.save(Account.builder()
                .accountNumber("CUST-B-200")
                .customerId(2L)
                .balance(new BigDecimal("50000.00"))
                .currency("PHP")
                .status(AccountStatus.ACTIVE)
                .allowOutgoing(true).allowIncoming(true)
                .build());

        merchantAccount = accountPersistencePort.save(Account.builder()
                .accountNumber("MERCHANT-SETTLEMENT-99")
                .customerId(99L)
                .balance(new BigDecimal("0.00"))
                .currency("PHP")
                .status(AccountStatus.ACTIVE)
                .allowOutgoing(true).allowIncoming(true)
                .build());
    }

    @Test
    public void financialOperations_ShouldPreserveDoubleEntryAndAccountConservation() {
        // Step 1: Customer A transfers 10,000 to Customer B
        InternalTransferRequest transferReq = InternalTransferRequest.builder()
                .sourceAccountNumber(customerA.getAccountNumber())
                .destinationAccountNumber(customerB.getAccountNumber())
                .amount(new BigDecimal("10000.00"))
                .idempotencyKey(UUID.randomUUID().toString())
                .description("Rent payment")
                .build();
        transferService.processInternalTransfer(transferReq);

        // Step 2: Customer A captures a 20,000 payment to Merchant
        PaymentIntent intent = paymentIntentRepository.save(PaymentIntent.builder()
                .intentId("PI-" + UUID.randomUUID())
                .merchantId(99L)
                .customerAccountNumber(customerA.getAccountNumber())
                .amount(new BigDecimal("20000.00"))
                .currency("PHP")
                .status(PaymentIntentStatus.AUTHORIZED)
                .build());
        paymentExecutionService.capturePayment(intent.getIntentId(), 99L, UUID.randomUUID().toString());

        // Step 3: Merchant refunds 5,000 to Customer A
        paymentExecutionService.refundPayment(intent.getIntentId(), 99L, UUID.randomUUID().toString(), new BigDecimal("5000.00"), "Partial Return");

        // --- INTEGRITY AUDIT ---

        // 1. Verify Global Conservation (System Total must remain exactly 150,000.00)
        Account finalA = accountPersistencePort.findByAccountNumber(customerA.getAccountNumber()).orElseThrow();
        Account finalB = accountPersistencePort.findByAccountNumber(customerB.getAccountNumber()).orElseThrow();
        Account finalMerchant = accountPersistencePort.findByAccountNumber(merchantAccount.getAccountNumber()).orElseThrow();

        // Customer A: 100k - 10k (Transfer) - 20k (Capture) + 5k (Refund) = 75,000
        assertEquals(0, new BigDecimal("75000.00").compareTo(finalA.getBalance()));
        // Customer B: 50k + 10k (Transfer) = 60,000
        assertEquals(0, new BigDecimal("60000.00").compareTo(finalB.getBalance()));
        // Merchant: 0 + 20k (Capture) - 5k (Refund) = 15,000
        assertEquals(0, new BigDecimal("15000.00").compareTo(finalMerchant.getBalance()), "Merchant balance mismatch");
        assertEquals(0, new BigDecimal("150000.00").compareTo(finalA.getBalance().add(finalB.getBalance()).add(finalMerchant.getBalance())), "Systemic money must be conserved");

        // 2. Verify Double-Entry Accounting Rule (DEBIT == CREDIT for EVERY transaction)
        List<Transaction> allTransactions = transactionRepository.findAll();
        assertEquals(3, allTransactions.size(), "Three distinct financial events should exist");

        for (Transaction tx : allTransactions) {
            List<LedgerEntry> entries = ledgerEntryRepository.findByTransactionReference(tx.getTransactionReference());
            
            BigDecimal debits = entries.stream()
                    .filter(e -> e.getEntryType() == EntryType.DEBIT)
                    .map(LedgerEntry::getAmount)
                    .reduce(BigDecimal.ZERO, BigDecimal::add);
                    
            BigDecimal credits = entries.stream()
                    .filter(e -> e.getEntryType() == EntryType.CREDIT)
                    .map(LedgerEntry::getAmount)
                    .reduce(BigDecimal.ZERO, BigDecimal::add);

            assertEquals(0, debits.compareTo(credits), "Transaction " + tx.getTransactionReference() + " has unbalanced ledger entries!");
            assertEquals(0, tx.getAmount().compareTo(debits), "Ledger amounts do not match the overarching transaction record");
        }
    }

    @Test
    public void concurrentOverdraftAttack_ShouldNeverDrawBalanceBelowZero() throws InterruptedException {
        // Attack setup: Account A has 1,000. We will hit it with 20 parallel transfer requests of 500.
        // Exactly TWO should succeed. 18 MUST fail.
        Account target = accountPersistencePort.save(Account.builder()
                .accountNumber("CUST-TARGET-001")
                .customerId(3L)
                .balance(new BigDecimal("1000.00"))
                .currency("PHP")
                .status(AccountStatus.ACTIVE)
                .allowOutgoing(true).allowIncoming(true)
                .build());

        int threads = 20;
        ExecutorService executor = Executors.newFixedThreadPool(threads);
        CountDownLatch startPistol = new CountDownLatch(1);
        CountDownLatch finishLine = new CountDownLatch(threads);

        AtomicInteger successes = new AtomicInteger(0);
        AtomicInteger insufficientFunds = new AtomicInteger(0);

        for (int i = 0; i < threads; i++) {
            executor.submit(() -> {
                try {
                    startPistol.await();
                    InternalTransferRequest req = InternalTransferRequest.builder()
                            .sourceAccountNumber(target.getAccountNumber())
                            .destinationAccountNumber(customerB.getAccountNumber())
                            .amount(new BigDecimal("500.00"))
                            .idempotencyKey(UUID.randomUUID().toString()) // Unique keys to bypass idempotency, testing purely overdraft
                            .description("Overdraft Attack")
                            .build();
                    transferService.processInternalTransfer(req);
                    successes.incrementAndGet();
                } catch (BusinessException e) {
                    if (e.getMessage().toLowerCase().contains("insufficient funds")) {
                        insufficientFunds.incrementAndGet();
                    }
                } catch (Exception e) {
                    // Other concurrency constraints
                } finally {
                    finishLine.countDown();
                }
            });
        }

        startPistol.countDown();
        finishLine.await(10, TimeUnit.SECONDS);
        executor.shutdown();

        // Integrity Assertions
        Account finalTarget = accountPersistencePort.findByAccountNumber(target.getAccountNumber()).orElseThrow();
        assertEquals(0, new BigDecimal("0.00").compareTo(finalTarget.getBalance()), "Balance must stop exactly at 0.00");
        assertEquals(2, successes.get(), "Exactly 2 operations should fit before funds run out");
        assertTrue(insufficientFunds.get() >= 18, "Remaining operations MUST be rejected due to insufficient funds");
    }

    @Test
    public void idempotencyConservation_ShouldRejectRepeatedFinancialEffects() throws InterruptedException {
        // Attack setup: 50 threads sending the EXACT SAME payload and idempotency key
        String sharedIdempotencyKey = "IDEM-ATTACK-" + UUID.randomUUID();
        
        int threads = 50;
        ExecutorService executor = Executors.newFixedThreadPool(threads);
        CountDownLatch startPistol = new CountDownLatch(1);
        CountDownLatch finishLine = new CountDownLatch(threads);

        AtomicInteger completed = new AtomicInteger(0);

        for (int i = 0; i < threads; i++) {
            executor.submit(() -> {
                try {
                    startPistol.await();
                    InternalTransferRequest req = InternalTransferRequest.builder()
                            .sourceAccountNumber(customerA.getAccountNumber())
                            .destinationAccountNumber(customerB.getAccountNumber())
                            .amount(new BigDecimal("5000.00"))
                            .idempotencyKey(sharedIdempotencyKey) 
                            .description("Idempotency Attack")
                            .build();
                    transferService.processInternalTransfer(req);
                    completed.incrementAndGet();
                } catch (Exception e) {
                    // Expected conflict exceptions
                } finally {
                    finishLine.countDown();
                }
            });
        }

        startPistol.countDown();
        finishLine.await(10, TimeUnit.SECONDS);
        executor.shutdown();

        // Integrity Assertions: Exactly ONE financial effect
        Account finalA = accountPersistencePort.findByAccountNumber(customerA.getAccountNumber()).orElseThrow();
        assertEquals(0, new BigDecimal("95000.00").compareTo(finalA.getBalance()), "Only 5,000 should be deducted");
        
        long txCount = transactionRepository.count();
        assertEquals(1, txCount, "Database constraint must ensure only 1 transaction is created");
    }
}
