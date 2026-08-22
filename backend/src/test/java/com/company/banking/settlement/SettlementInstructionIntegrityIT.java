package com.company.banking.settlement;

import com.company.banking.common.exception.BusinessException;
import com.company.banking.common.exception.ConflictException;
import com.company.banking.settlement.application.SettlementInstructionService;
import com.company.banking.settlement.domain.SettlementBatch;
import com.company.banking.settlement.domain.SettlementInstruction;
import com.company.banking.settlement.infrastructure.SettlementBatchJpaRepository;
import com.company.banking.settlement.infrastructure.SettlementInstructionJpaRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;
import java.util.concurrent.CountDownLatch;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.atomic.AtomicInteger;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@ActiveProfiles("test")
public class SettlementInstructionIntegrityIT {

    @Autowired
    private SettlementInstructionService instructionService;

    @Autowired
    private SettlementBatchJpaRepository batchRepository;

    @Autowired
    private SettlementInstructionJpaRepository instructionRepository;

    private SettlementBatch finalizedBatch;

    @BeforeEach
    public void setup() {
        instructionRepository.deleteAll();
        batchRepository.deleteAll();

        finalizedBatch = batchRepository.save(SettlementBatch.builder()
                .batchReference("BATCH-TEST-" + UUID.randomUUID())
                .merchantId(101L)
                .amount(new BigDecimal("98000.00"))
                .currency("PHP")
                .status("FINALIZED")
                .destinationBankAccount("DEST-12345")
                .destinationRoutingNumber("ROUTING-99")
                .createdAt(LocalDateTime.now())
                .build());
    }

    @Test
    public void createsInstruction_FromFinalizedBatch_WithDerivedAmount() {
        SettlementInstruction instruction = instructionService.generateInstructionFromBatch(finalizedBatch.getBatchReference());

        assertNotNull(instruction);
        assertEquals("READY", instruction.getStatus());
        assertEquals(0, new BigDecimal("98000.00").compareTo(instruction.getAmount()), "Instruction amount MUST be exclusively derived from the batch");
        assertEquals(101L, instruction.getMerchantId());
        assertEquals(finalizedBatch.getId(), instruction.getSettlementBatchId());
    }

    @Test
    public void cannotCreateInstruction_FromUnfinalizedBatch() {
        SettlementBatch pendingBatch = batchRepository.save(SettlementBatch.builder()
                .batchReference("BATCH-PENDING-" + UUID.randomUUID())
                .merchantId(101L)
                .amount(new BigDecimal("5000.00"))
                .currency("PHP")
                .status("PENDING") // Invalid state
                .destinationBankAccount("DEST-12345")
                .destinationRoutingNumber("ROUTING-99")
                .createdAt(LocalDateTime.now())
                .build());

        BusinessException exception = assertThrows(BusinessException.class, () -> {
            instructionService.generateInstructionFromBatch(pendingBatch.getBatchReference());
        });

        assertTrue(exception.getMessage().contains("invalid state"));
        assertEquals(0, instructionRepository.count(), "No instruction should be created");
    }

    @Test
    public void concurrentInstructionCreation_CreatesExactlyOneInstruction() throws InterruptedException {
        int threads = 10;
        ExecutorService executor = Executors.newFixedThreadPool(threads);
        CountDownLatch startPistol = new CountDownLatch(1);
        CountDownLatch finishLine = new CountDownLatch(threads);

        AtomicInteger successfulGenerations = new AtomicInteger(0);
        AtomicInteger expectedFailures = new AtomicInteger(0);

        for (int i = 0; i < threads; i++) {
            executor.submit(() -> {
                try {
                    startPistol.await();
                    SettlementInstruction instr = instructionService.generateInstructionFromBatch(finalizedBatch.getBatchReference());
                    if (instr != null) successfulGenerations.incrementAndGet();
                } catch (ConflictException e) {
                    expectedFailures.incrementAndGet();
                } catch (Exception e) {
                    // Ignore standard lock timeouts
                } finally {
                    finishLine.countDown();
                }
            });
        }

        startPistol.countDown();
        finishLine.await(10, TimeUnit.SECONDS);
        executor.shutdown();

        // Integrity Assertions
        assertEquals(1, instructionRepository.count(), "Concurrency constraint must guarantee exactly 1 instruction per batch");
        assertEquals(10, successfulGenerations.get() + expectedFailures.get(), "All threads should either succeed idempotenly or be blocked by DB constraints");
    }
}
