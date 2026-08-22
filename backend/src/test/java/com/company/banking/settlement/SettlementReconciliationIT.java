package com.company.banking.settlement;

import com.company.banking.common.exception.BusinessException;
import com.company.banking.settlement.application.SettlementReconciliationService;
import com.company.banking.settlement.domain.SettlementBatch;
import com.company.banking.settlement.domain.SettlementException;
import com.company.banking.settlement.domain.SettlementInstruction;
import com.company.banking.settlement.infrastructure.SettlementBatchJpaRepository;
import com.company.banking.settlement.infrastructure.SettlementExceptionJpaRepository;
import com.company.banking.settlement.infrastructure.SettlementInstructionJpaRepository;
import com.company.banking.transaction.domain.EntryType;
import com.company.banking.transaction.domain.LedgerEntry;
import com.company.banking.transaction.domain.Transaction;
import com.company.banking.transaction.domain.TransactionStatus;
import com.company.banking.transaction.infrastructure.LedgerEntryJpaRepository;
import com.company.banking.transaction.infrastructure.TransactionJpaRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;

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

@SpringBootTest
@ActiveProfiles("test")
public class SettlementReconciliationIT {

    @Autowired
    private SettlementReconciliationService reconciliationService;

    @Autowired
    private SettlementInstructionJpaRepository instructionRepository;

    @Autowired
    private SettlementBatchJpaRepository batchRepository;

    @Autowired
    private TransactionJpaRepository transactionRepository;

    @Autowired
    private LedgerEntryJpaRepository ledgerEntryRepository;

    @Autowired
    private SettlementExceptionJpaRepository exceptionRepository;

    private SettlementBatch batch;
    private SettlementInstruction instruction;
    private Transaction transaction;

    @BeforeEach
    public void setup() {
        exceptionRepository.deleteAll();
        instructionRepository.deleteAll();
        transactionRepository.deleteAll();
        batchRepository.deleteAll();
        ledgerEntryRepository.deleteAll();

        // Setup perfectly consistent baseline data
        batch = batchRepository.save(SettlementBatch.builder()
                .batchReference("BATCH-REC-" + UUID.randomUUID())
                .merchantId(55L)
                .amount(new BigDecimal("1000.00"))
                .currency("PHP")
                .status("FINALIZED")
                .destinationBankAccount("DEST-123")
                .destinationRoutingNumber("RT-99")
                .createdAt(LocalDateTime.now())
                .build());

        instruction = instructionRepository.save(SettlementInstruction.builder()
                .instructionId("INSTR-" + UUID.randomUUID())
                .settlementBatchId(batch.getId())
                .merchantId(55L)
                .amount(new BigDecimal("1000.00"))
                .currency("PHP")
                .status("READY")
                .destinationAccount("DEST-123")
                .createdAt(LocalDateTime.now())
                .build());

        String txRef = "TX-" + UUID.randomUUID();
        transaction = transactionRepository.save(Transaction.builder()
                .transactionReference(txRef)
                .idempotencyKey(UUID.randomUUID().toString())
                .sourceAccountNumber("CUST-1")
                .destinationAccountNumber("MERCHANT-55")
                .amount(new BigDecimal("1000.00"))
                .currency("PHP")
                .status(TransactionStatus.COMPLETED)
                .settlementBatchId(batch.getId())
                .createdAt(LocalDateTime.now())
                .build());

        ledgerEntryRepository.save(LedgerEntry.builder()
                .transactionReference(txRef)
                .accountNumber("CUST-1")
                .entryType(EntryType.DEBIT)
                .amount(new BigDecimal("1000.00"))
                .currency("PHP")
                .createdAt(LocalDateTime.now())
                .build());

        ledgerEntryRepository.save(LedgerEntry.builder()
                .transactionReference(txRef)
                .accountNumber("MERCHANT-55")
                .entryType(EntryType.CREDIT)
                .amount(new BigDecimal("1000.00"))
                .currency("PHP")
                .createdAt(LocalDateTime.now())
                .build());
    }

    @Test
    public void reconciliation_ShouldPassForConsistentBatch() {
        SettlementInstruction result = reconciliationService.reconcileInstruction(instruction.getInstructionId());

        assertEquals("RECONCILED", result.getStatus());
        assertEquals("RECONCILED", batchRepository.findById(batch.getId()).get().getStatus());
        assertEquals(0, exceptionRepository.count(), "No exception should be generated for perfect data");
    }

    @Test
    public void reconciliation_ShouldDetectTransactionBatchMismatch() {
        // Attack: Artificially alter the batch total to simulate tampering/drift
        batch.setAmount(new BigDecimal("2000.00"));
        batchRepository.save(batch);

        SettlementInstruction result = reconciliationService.reconcileInstruction(instruction.getInstructionId());

        assertEquals("EXCEPTION", result.getStatus());
        
        List<SettlementException> exceptions = exceptionRepository.findAll();
        assertEquals(1, exceptions.size());
        assertTrue(exceptions.get(0).getErrorDescription().contains("Batch gross"), "Exception must detail the exact mismatch");
    }

    @Test
    public void reconciliation_ShouldDetectLedgerImbalance() {
        // Attack: Erase the CREDIT leg of the transaction to simulate a mid-flight database tear
        ledgerEntryRepository.findAll().stream()
                .filter(e -> e.getEntryType() == EntryType.CREDIT)
                .forEach(e -> ledgerEntryRepository.delete(e));

        SettlementInstruction result = reconciliationService.reconcileInstruction(instruction.getInstructionId());

        assertEquals("EXCEPTION", result.getStatus());
        
        List<SettlementException> exceptions = exceptionRepository.findAll();
        assertEquals(1, exceptions.size());
        assertTrue(exceptions.get(0).getErrorDescription().contains("imbalanced"), "Exception must flag ledger imbalance");
    }

    @Test
    public void reconciliation_ShouldBeIdempotent() {
        // Run once (Success)
        reconciliationService.reconcileInstruction(instruction.getInstructionId());
        
        // Run again (Idempotent)
        SettlementInstruction result2 = reconciliationService.reconcileInstruction(instruction.getInstructionId());

        assertEquals("RECONCILED", result2.getStatus());
        assertEquals(0, exceptionRepository.count());
    }

    @Test
    public void concurrentReconciliation_ShouldNotCreateDuplicateExceptions() throws InterruptedException {
        // Attack: Create a ledger mismatch
        batch.setAmount(new BigDecimal("99999.00"));
        batchRepository.save(batch);

        int threads = 10;
        ExecutorService executor = Executors.newFixedThreadPool(threads);
        CountDownLatch startPistol = new CountDownLatch(1);
        CountDownLatch finishLine = new CountDownLatch(threads);

        for (int i = 0; i < threads; i++) {
            executor.submit(() -> {
                try {
                    startPistol.await();
                    reconciliationService.reconcileInstruction(instruction.getInstructionId());
                } catch (Exception e) {
                    // Ignore expected lock timeouts
                } finally {
                    finishLine.countDown();
                }
            });
        }

        startPistol.countDown();
        finishLine.await(10, TimeUnit.SECONDS);
        executor.shutdown();

        // Verify: 10 threads hit the mismatch, but pessimistic locking guarantees exactly 1 exception is logged
        long exceptionCount = exceptionRepository.count();
        assertEquals(1, exceptionCount, "Only ONE discrepancy exception should be recorded globally");
        
        // Ensure Ledger remains completely untouched and immutable
        assertEquals(2, ledgerEntryRepository.count(), "Historical ledgers must NEVER be modified by reconciliation");
    }
}
