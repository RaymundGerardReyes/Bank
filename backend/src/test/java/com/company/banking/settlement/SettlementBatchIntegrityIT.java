package com.company.banking.settlement;

import com.company.banking.common.exception.ConflictException;
import com.company.banking.settlement.application.SettlementBatchService;
import com.company.banking.settlement.domain.SettlementBatch;
import com.company.banking.settlement.infrastructure.SettlementBatchJpaRepository;
import com.company.banking.transaction.domain.Transaction;
import com.company.banking.transaction.domain.TransactionStatus;
import com.company.banking.transaction.infrastructure.TransactionJpaRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import com.company.banking.config.LedgerSpyIntegrationTest;


import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;
import java.util.concurrent.CountDownLatch;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.atomic.AtomicInteger;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.doThrow;

public class SettlementBatchIntegrityIT extends LedgerSpyIntegrationTest {

    @Autowired
    private SettlementBatchService settlementBatchService;

    @Autowired
    private TransactionJpaRepository transactionRepository;



    private final Long TEST_MERCHANT_ID = 42L;
    private final Long TEST_WINDOW_ID = 20260823L;
    private final String MERCHANT_ACCOUNT = "MERCHANT-SETTLEMENT-42";

    @BeforeEach
    public void setup() {

    }

    private void seedTransaction(BigDecimal amount, TransactionStatus status) {
        transactionRepository.save(Transaction.builder()
                .transactionReference("TX-" + UUID.randomUUID())
                .idempotencyKey(UUID.randomUUID().toString())
                .sourceAccountNumber("CUSTOMER-123")
                .destinationAccountNumber(MERCHANT_ACCOUNT)
                .amount(amount)
                .currency("PHP")
                .status(status)
                .createdAt(LocalDateTime.now())
                .build());
    }

    @Test
    public void batchGrossAmount_EqualsAssignedTransactionSum() {
        seedTransaction(new BigDecimal("1000.00"), TransactionStatus.COMPLETED);
        seedTransaction(new BigDecimal("2500.00"), TransactionStatus.COMPLETED);
        seedTransaction(new BigDecimal("500.00"), TransactionStatus.COMPLETED);
        
        // These should be completely ignored
        seedTransaction(new BigDecimal("10000.00"), TransactionStatus.FAILED);
        seedTransaction(new BigDecimal("50000.00"), TransactionStatus.PENDING);

        SettlementBatch batch = settlementBatchService.createSettlementBatch(TEST_MERCHANT_ID, TEST_WINDOW_ID, "DEST-BANK", "ROUTING-123");

        assertNotNull(batch);
        assertEquals("FINALIZED", batch.getStatus());
        assertEquals(0, new BigDecimal("4000.00").compareTo(batch.getAmount()), "Server must exclusively derive exact gross amount");

        long assignedCount = transactionRepository.findAll().stream()
                .filter(t -> batch.getId().equals(t.getSettlementBatchId()))
                .count();
        assertEquals(3, assignedCount, "Exactly 3 eligible transactions must be permanently assigned");
    }

    @Test
    public void repeatedBatchCreation_IsIdempotent() {
        seedTransaction(new BigDecimal("1000.00"), TransactionStatus.COMPLETED);

        // T1: Normal execution
        SettlementBatch batch1 = settlementBatchService.createSettlementBatch(TEST_MERCHANT_ID, TEST_WINDOW_ID, "DEST-BANK", "ROUTING-123");
        
        // T2: Accidental cron duplicate
        SettlementBatch batch2 = settlementBatchService.createSettlementBatch(TEST_MERCHANT_ID, TEST_WINDOW_ID, "DEST-BANK", "ROUTING-123");

        assertEquals(batch1.getId(), batch2.getId(), "Must return the exact same batch on repeated calls");
        assertEquals(1, settlementBatchRepository.count(), "Must not create a second batch");
    }

    @Test
    public void failedBatchCreation_RollsBackTransactionAssignments() {
        seedTransaction(new BigDecimal("5000.00"), TransactionStatus.COMPLETED);

        // Sabotage the database save to simulate a mid-flight crash
        doThrow(new RuntimeException("Simulated Network Outage")).when(settlementBatchRepository).saveAndFlush(any());

        assertThrows(RuntimeException.class, () -> {
            settlementBatchService.createSettlementBatch(TEST_MERCHANT_ID, TEST_WINDOW_ID, "DEST-BANK", "ROUTING-123");
        });

        // Verify Rollback Invariant: No batch exists, and the transaction is STILL eligible
        assertEquals(0, settlementBatchRepository.count());
        
        Transaction tx = transactionRepository.findAll().get(0);
        assertNull(tx.getSettlementBatchId(), "Transaction assignment MUST be rolled back if the batch fails");
    }

    @Test
    public void concurrentBatchCreation_CreatesExactlyOneBatchAndDoesNotDuplicate() throws InterruptedException {
        // Seed 10 eligible transactions
        for (int i = 0; i < 10; i++) {
            seedTransaction(new BigDecimal("100.00"), TransactionStatus.COMPLETED);
        }

        int threads = 10;
        ExecutorService executor = Executors.newFixedThreadPool(threads);
        CountDownLatch startPistol = new CountDownLatch(1);
        CountDownLatch finishLine = new CountDownLatch(threads);

        AtomicInteger successfulBatches = new AtomicInteger(0);
        AtomicInteger expectedFailures = new AtomicInteger(0);

        // 10 concurrent threads try to build a batch for the EXACT SAME window simultaneously
        for (int i = 0; i < threads; i++) {
            executor.submit(() -> {
                try {
                    startPistol.await();
                    SettlementBatch batch = settlementBatchService.createSettlementBatch(TEST_MERCHANT_ID, TEST_WINDOW_ID, "DEST-BANK", "ROUTING-123");
                    if (batch != null) successfulBatches.incrementAndGet();
                } catch (ConflictException e) {
                    expectedFailures.incrementAndGet(); // Caught by the DB UNIQUE constraint
                } catch (Exception e) {
                    // Lock timeout
                } finally {
                    finishLine.countDown();
                }
            });
        }

        startPistol.countDown();
        finishLine.await(10, TimeUnit.SECONDS);
        executor.shutdown();

        // 1. Ensure exactly one batch was created, protecting the system from duplicate payouts
        assertEquals(1, settlementBatchRepository.count(), "Concurrency constraint must guarantee exactly 1 batch");

        // 2. Ensure exactly 1,000.00 was aggregated
        SettlementBatch savedBatch = settlementBatchRepository.findAll().get(0);
        assertEquals(0, new BigDecimal("1000.00").compareTo(savedBatch.getAmount()), "Batch amount must not be double-counted during concurrency");
    }
}
