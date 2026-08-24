package com.company.banking.settlement;

import com.company.banking.account.application.port.out.AccountPersistencePort;
import com.company.banking.account.domain.Account;
import com.company.banking.common.enums.AccountStatus;
import com.company.banking.common.exception.BusinessException;
import com.company.banking.payment.application.InternalPaymentExecutionService;
import com.company.banking.payment.domain.PaymentIntent;
import com.company.banking.payment.domain.PaymentIntentStatus;
import com.company.banking.payment.infrastructure.PaymentIntentJpaRepository;
import com.company.banking.settlement.application.InternalSettlementExecutionService;
import com.company.banking.settlement.application.SettlementBatchService;
import com.company.banking.settlement.application.SettlementInstructionService;
import com.company.banking.settlement.application.SettlementReconciliationService;
import com.company.banking.settlement.domain.MerchantBalance;
import com.company.banking.settlement.domain.SettlementBatch;
import com.company.banking.settlement.domain.SettlementInstruction;
import com.company.banking.settlement.infrastructure.MerchantBalanceJpaRepository;
import com.company.banking.settlement.infrastructure.SettlementBatchJpaRepository;
import com.company.banking.settlement.infrastructure.SettlementExceptionJpaRepository;
import com.company.banking.settlement.infrastructure.SettlementInstructionJpaRepository;
import com.company.banking.transaction.domain.EntryType;
import com.company.banking.transaction.domain.LedgerEntry;
import com.company.banking.transaction.infrastructure.LedgerEntryJpaRepository;
import com.company.banking.transaction.infrastructure.TransactionJpaRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import com.company.banking.config.LedgerSpyIntegrationTest;


import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.concurrent.CountDownLatch;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.atomic.AtomicInteger;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.doThrow;

public class SettlementFinalityIT extends LedgerSpyIntegrationTest {

    @Autowired private InternalPaymentExecutionService paymentService;
    @Autowired private SettlementBatchService batchService;
    @Autowired private SettlementInstructionService instructionService;
    @Autowired private SettlementReconciliationService reconciliationService;
    @Autowired private InternalSettlementExecutionService executionService;

    @Autowired private AccountPersistencePort accountPersistencePort;
    @Autowired private MerchantBalanceJpaRepository merchantBalanceRepository;
    @Autowired private PaymentIntentJpaRepository paymentIntentRepository;
    @Autowired private TransactionJpaRepository transactionRepository;

    @Autowired private SettlementBatchJpaRepository batchRepository;
    @Autowired private SettlementInstructionJpaRepository instructionRepository;
    @Autowired private SettlementExceptionJpaRepository exceptionRepository;
    @Autowired private com.company.banking.account.infrastructure.AccountJpaRepository accountJpaRepository;
    @Autowired private com.company.banking.payment.infrastructure.RefundJpaRepository refundRepository;
    @Autowired private com.company.banking.payment.infrastructure.PaymentAttemptJpaRepository paymentAttemptRepository;
    @Autowired private com.company.banking.payment.infrastructure.PaymentEventJpaRepository paymentEventRepository;
    @Autowired private jakarta.persistence.EntityManager entityManager;

    private final Long MERCHANT_ID = 999L;
    private final Long WINDOW_ID = 20261231L;
    private final String CUSTOMER_ACC = "CUST-FINALITY-001";
    private final String SUSPENSE_ACC = "MERCHANT-SETTLEMENT-999";
    private final String DEST_ACC = "DEST-FINALITY-001";

    @BeforeEach
    public void setup() {


        // 2. Establish Conserved Financial Baseline idempotently
        accountPersistencePort.findByAccountNumber(CUSTOMER_ACC)
                .map(acc -> {
                    acc.setBalance(new BigDecimal("100000.00"));
                    return accountPersistencePort.save(acc);
                })
                .orElseGet(() -> accountPersistencePort.save(Account.builder()
                        .accountNumber(CUSTOMER_ACC).customerId(1L).currency("PHP")
                        .balance(new BigDecimal("100000.00")).status(AccountStatus.ACTIVE)
                        .allowOutgoing(true).allowIncoming(true).build()));

        accountPersistencePort.findByAccountNumber(SUSPENSE_ACC)
                .map(acc -> {
                    acc.setBalance(new BigDecimal("0.00"));
                    return accountPersistencePort.save(acc);
                })
                .orElseGet(() -> accountPersistencePort.save(Account.builder()
                        .accountNumber(SUSPENSE_ACC).customerId(MERCHANT_ID).currency("PHP")
                        .balance(new BigDecimal("0.00")).status(AccountStatus.ACTIVE)
                        .allowOutgoing(true).allowIncoming(true).build()));

        accountPersistencePort.findByAccountNumber(DEST_ACC)
                .map(acc -> {
                    acc.setBalance(new BigDecimal("0.00"));
                    return accountPersistencePort.save(acc);
                })
                .orElseGet(() -> accountPersistencePort.save(Account.builder()
                        .accountNumber(DEST_ACC).customerId(MERCHANT_ID).currency("PHP")
                        .balance(new BigDecimal("0.00")).status(AccountStatus.ACTIVE)
                        .allowOutgoing(true).allowIncoming(true).build()));

        merchantBalanceRepository.findByMerchantId(MERCHANT_ID)
                .orElseGet(() -> merchantBalanceRepository.save(MerchantBalance.builder()
                        .merchantId(MERCHANT_ID).availableBalance(new BigDecimal("0.00"))
                        .pendingBalance(new BigDecimal("0.00")).currency("PHP")
                        .updatedAt(LocalDateTime.now()).build()));
    }

    /**
     * FLAGSHIP TEST: Proves the entire end-to-end lifecycle conserves system money
     * and strictly adheres to double-entry accounting.
     */
    @Test
    public void fullInternalPaymentToSettlement_ShouldPreserveFinancialConservation() {
        // --- STEP 1: PAYMENT CAPTURE ---
        PaymentIntent intent = paymentIntentRepository.save(PaymentIntent.builder()
                .intentId("PI-" + UUID.randomUUID()).merchantId(MERCHANT_ID)
                .customerAccountNumber(CUSTOMER_ACC).amount(new BigDecimal("25000.00"))
                .currency("PHP").status(PaymentIntentStatus.AUTHORIZED).build());
        
        paymentService.capturePayment(intent.getIntentId(), MERCHANT_ID, UUID.randomUUID().toString());

        // --- STEP 2: SETTLEMENT BATCH ---
        SettlementBatch batch = batchService.createSettlementBatch(MERCHANT_ID, WINDOW_ID, DEST_ACC, "RT-999");
        assertNotNull(batch);

        // --- STEP 3: SETTLEMENT INSTRUCTION ---
        SettlementInstruction instruction = instructionService.generateInstructionFromBatch(batch.getBatchReference());
        assertEquals("READY", instruction.getStatus());

        // --- STEP 4: RECONCILIATION ---
        instruction = reconciliationService.reconcileInstruction(instruction.getInstructionId());
        assertEquals("RECONCILED", instruction.getStatus());

        // --- STEP 5: SETTLEMENT EXECUTION ---
        instruction = executionService.executeSettlement(instruction.getInstructionId(), MERCHANT_ID);
        assertEquals("SETTLED", instruction.getStatus());

        // --- FINANCIAL CONSERVATION ASSERTIONS ---
        Account customer = accountPersistencePort.findByAccountNumber(CUSTOMER_ACC).orElseThrow();
        Account suspense = accountPersistencePort.findByAccountNumber(SUSPENSE_ACC).orElseThrow();
        Account dest = accountPersistencePort.findByAccountNumber(DEST_ACC).orElseThrow();
        MerchantBalance mb = merchantBalanceRepository.findByMerchantId(MERCHANT_ID).orElseThrow();

        // 1. Verify balances correctly transferred their state
        assertEquals(0, new BigDecimal("75000.00").compareTo(customer.getBalance()));
        assertEquals(0, new BigDecimal("0.00").compareTo(suspense.getBalance()), "Suspense account must be flushed completely");
        assertEquals(0, new BigDecimal("25000.00").compareTo(dest.getBalance()), "Merchant destination must receive exactly the settlement amount");
        assertEquals(0, new BigDecimal("25000.00").compareTo(mb.getAvailableBalance()), "Merchant operational balance must accurately reflect settlement");

        // 2. Verify total system money is exactly 100,000.00
        BigDecimal systemTotal = customer.getBalance().add(suspense.getBalance()).add(dest.getBalance());
        assertEquals(0, new BigDecimal("100000.00").compareTo(systemTotal), "Total money in the system MUST NOT change");

        // 3. Verify Ledger Double-Entry Rules
        List<LedgerEntry> ledgers = ledgerEntryRepository.findAll();
        assertEquals(4, ledgers.size(), "2 entries for capture, 2 entries for settlement");
        
        BigDecimal totalDebits = ledgers.stream().filter(l -> l.getEntryType() == EntryType.DEBIT)
                .map(LedgerEntry::getAmount).reduce(BigDecimal.ZERO, BigDecimal::add);
        BigDecimal totalCredits = ledgers.stream().filter(l -> l.getEntryType() == EntryType.CREDIT)
                .map(LedgerEntry::getAmount).reduce(BigDecimal.ZERO, BigDecimal::add);
                
        assertEquals(0, totalDebits.compareTo(totalCredits), "System-wide debits MUST exactly equal credits");
    }

    @Test
    public void concurrentReconcileAndSettlement_ShouldProduceOneFinalOutcome() throws InterruptedException {
        // Setup: Capture, Batch, Instruction
        PaymentIntent intent = paymentIntentRepository.save(PaymentIntent.builder()
                .intentId("PI-" + UUID.randomUUID()).merchantId(MERCHANT_ID)
                .customerAccountNumber(CUSTOMER_ACC).amount(new BigDecimal("10000.00"))
                .currency("PHP").status(PaymentIntentStatus.AUTHORIZED).build());
        paymentService.capturePayment(intent.getIntentId(), MERCHANT_ID, UUID.randomUUID().toString());
        SettlementBatch batch = batchService.createSettlementBatch(MERCHANT_ID, WINDOW_ID, DEST_ACC, "RT-999");
        SettlementInstruction instruction = instructionService.generateInstructionFromBatch(batch.getBatchReference());
        
        // Reconcile it so it's ready to settle
        reconciliationService.reconcileInstruction(instruction.getInstructionId());

        int threads = 20;
        ExecutorService executor = Executors.newFixedThreadPool(threads);
        CountDownLatch startPistol = new CountDownLatch(1);
        CountDownLatch finishLine = new CountDownLatch(threads);
        AtomicInteger successCount = new AtomicInteger(0);

        for (int i = 0; i < threads; i++) {
            executor.submit(() -> {
                try {
                    startPistol.await();
                    SettlementInstruction res = executionService.executeSettlement(instruction.getInstructionId(), MERCHANT_ID);
                    if ("SETTLED".equals(res.getStatus())) successCount.incrementAndGet();
                } catch (Exception e) {
                    // Ignore expected lock timeouts and idempotent returns
                } finally {
                    finishLine.countDown();
                }
            });
        }

        startPistol.countDown();
        finishLine.await(10, TimeUnit.SECONDS);
        executor.shutdown();

        // Integrity Assertions: Only one financial effect despite 20 attempts
        Account dest = accountPersistencePort.findByAccountNumber(DEST_ACC).orElseThrow();
        assertEquals(0, new BigDecimal("10000.00").compareTo(dest.getBalance()), "Balance must receive EXACTLY one settlement transfer");
    }

    @Test
    public void settlementFailure_ShouldRollbackEntireFinancialOperation() {
        PaymentIntent intent = paymentIntentRepository.save(PaymentIntent.builder()
                .intentId("PI-" + UUID.randomUUID()).merchantId(MERCHANT_ID)
                .customerAccountNumber(CUSTOMER_ACC).amount(new BigDecimal("5000.00"))
                .currency("PHP").status(PaymentIntentStatus.AUTHORIZED).build());
        paymentService.capturePayment(intent.getIntentId(), MERCHANT_ID, UUID.randomUUID().toString());
        SettlementBatch batch = batchService.createSettlementBatch(MERCHANT_ID, WINDOW_ID, DEST_ACC, "RT-999");
        SettlementInstruction instruction = instructionService.generateInstructionFromBatch(batch.getBatchReference());
        instruction = reconciliationService.reconcileInstruction(instruction.getInstructionId());

        // Sabotage the ledger saving to simulate a mid-flight crash
        doThrow(new RuntimeException("Database Outage Simulation")).when(ledgerEntryRepository).saveAll(any());

        SettlementInstruction finalInstruction = instruction;
        assertThrows(RuntimeException.class, () -> {
            executionService.executeSettlement(finalInstruction.getInstructionId(), MERCHANT_ID);
        });

        // Verify Rollback: Account is unchanged
        Account dest = accountPersistencePort.findByAccountNumber(DEST_ACC).orElseThrow();
        assertEquals(0, new BigDecimal("0.00").compareTo(dest.getBalance()));

        // Verify Rollback: Instruction remains RECONCILED, ready for retry
        SettlementInstruction rolledBackInstr = instructionRepository.findById(instruction.getId()).orElseThrow();
        assertEquals("RECONCILED", rolledBackInstr.getStatus());
    }

    @Autowired private org.springframework.jdbc.core.JdbcTemplate jdbcTemplate;

    @Test
    public void tamperedInstructionAmount_ShouldBeRejected() {
        PaymentIntent intent = paymentIntentRepository.save(PaymentIntent.builder()
                .intentId("PI-" + UUID.randomUUID()).merchantId(MERCHANT_ID)
                .customerAccountNumber(CUSTOMER_ACC).amount(new BigDecimal("10000.00"))
                .currency("PHP").status(PaymentIntentStatus.AUTHORIZED).build());
        paymentService.capturePayment(intent.getIntentId(), MERCHANT_ID, UUID.randomUUID().toString());
        SettlementBatch batch = batchService.createSettlementBatch(MERCHANT_ID, WINDOW_ID, DEST_ACC, "RT-999");
        SettlementInstruction instruction = instructionService.generateInstructionFromBatch(batch.getBatchReference());

        // ATTACK: Direct DB tampering bypassing JPA's updatable=false protection
        jdbcTemplate.update("UPDATE \"settlement_instructions\" SET amount = ? WHERE id = ?", new BigDecimal("50000.00"), instruction.getId());
        entityManager.clear();

        // Reconcile
        SettlementInstruction result = reconciliationService.reconcileInstruction(instruction.getInstructionId());

        assertEquals("EXCEPTION", result.getStatus(), "Reconciliation MUST reject tampered instruction amounts");
        assertEquals(1, exceptionRepository.count());
    }

    @Test
    public void unreconciledInstruction_ShouldNeverSettle() {
        PaymentIntent intent = paymentIntentRepository.save(PaymentIntent.builder()
                .intentId("PI-" + UUID.randomUUID()).merchantId(MERCHANT_ID)
                .customerAccountNumber(CUSTOMER_ACC).amount(new BigDecimal("10000.00"))
                .currency("PHP").status(PaymentIntentStatus.AUTHORIZED).build());
        paymentService.capturePayment(intent.getIntentId(), MERCHANT_ID, UUID.randomUUID().toString());
        SettlementBatch batch = batchService.createSettlementBatch(MERCHANT_ID, WINDOW_ID, DEST_ACC, "RT-999");
        SettlementInstruction instruction = instructionService.generateInstructionFromBatch(batch.getBatchReference());

        // Instruction is in 'READY' state. It has NOT been reconciled.
        BusinessException exception = assertThrows(BusinessException.class, () -> {
            executionService.executeSettlement(instruction.getInstructionId(), MERCHANT_ID);
        });

        assertTrue(exception.getMessage().contains("must be RECONCILED"));
    }

    @Test
    public void historicalLedgerEntries_ShouldRemainImmutable() {
        PaymentIntent intent = paymentIntentRepository.save(PaymentIntent.builder()
                .intentId("PI-" + UUID.randomUUID()).merchantId(MERCHANT_ID)
                .customerAccountNumber(CUSTOMER_ACC).amount(new BigDecimal("10000.00"))
                .currency("PHP").status(PaymentIntentStatus.AUTHORIZED).build());
        paymentService.capturePayment(intent.getIntentId(), MERCHANT_ID, UUID.randomUUID().toString());
        
        // Snapshot historical ledger
        List<LedgerEntry> historicalEntries = ledgerEntryRepository.findAll();
        assertEquals(2, historicalEntries.size());
        Long firstId = historicalEntries.get(0).getId();

        SettlementBatch batch = batchService.createSettlementBatch(MERCHANT_ID, WINDOW_ID, DEST_ACC, "RT-999");
        SettlementInstruction instruction = instructionService.generateInstructionFromBatch(batch.getBatchReference());
        reconciliationService.reconcileInstruction(instruction.getInstructionId());
        executionService.executeSettlement(instruction.getInstructionId(), MERCHANT_ID);

        // Verify Immutable History
        LedgerEntry snapshotCheck = ledgerEntryRepository.findById(firstId).orElseThrow();
        assertEquals(historicalEntries.get(0).getAmount(), snapshotCheck.getAmount(), "Historical ledger records MUST NEVER be mutated by settlement");
        
        List<LedgerEntry> finalEntries = ledgerEntryRepository.findAll();
        assertEquals(4, finalEntries.size(), "Settlement MUST append new entries rather than altering history");
    }
}
