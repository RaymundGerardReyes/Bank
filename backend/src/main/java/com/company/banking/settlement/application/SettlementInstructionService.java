package com.company.banking.settlement.application;

import com.company.banking.common.exception.BusinessException;
import com.company.banking.common.exception.ConflictException;
import com.company.banking.common.exception.ErrorCode;
import com.company.banking.settlement.domain.SettlementBatch;
import com.company.banking.settlement.domain.SettlementInstruction;
import com.company.banking.settlement.infrastructure.SettlementBatchJpaRepository;
import com.company.banking.settlement.infrastructure.SettlementInstructionJpaRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class SettlementInstructionService {

    private final SettlementBatchJpaRepository batchRepository;
    private final SettlementInstructionJpaRepository instructionRepository;

    @Transactional
    public SettlementInstruction generateInstructionFromBatch(String batchReference) {
        log.info("[SETTLEMENT INSTRUCTION] Attempting to generate instruction for batch: {}", batchReference);

        // 1. Fetch the authoritative batch
        SettlementBatch batch = batchRepository.findByBatchReference(batchReference)
                .orElseThrow(() -> new BusinessException(ErrorCode.NOT_FOUND, "Settlement Batch not found: " + batchReference));

        // 2. Enforce strict State Machine prerequisites
        if (!"FINALIZED".equals(batch.getStatus())) {
            throw new BusinessException(ErrorCode.INVALID_REQUEST, 
                "Cannot create instruction. Batch " + batchReference + " is in invalid state: " + batch.getStatus());
        }

        // 3. Application-level Idempotency Check
        Optional<SettlementInstruction> existingInstruction = instructionRepository.findBySettlementBatchId(batch.getId());
        if (existingInstruction.isPresent()) {
            log.info("[SETTLEMENT INSTRUCTION] Instruction already exists for batch {}. Returning idempotent result.", batchReference);
            return existingInstruction.get();
        }

        // 4. Server-Side Financial Derivation (Immutable Snapshot)
        // In Phase 5C, Gross == Net. Future logic for fees/adjustments goes here.
        BigDecimal derivedNetAmount = batch.getAmount();

        // 5. Create the Immutable Instruction
        SettlementInstruction instruction = SettlementInstruction.builder()
                .instructionId("INSTR-" + UUID.randomUUID().toString().substring(0, 12).toUpperCase())
                .settlementBatchId(batch.getId())
                .merchantId(batch.getMerchantId())
                .amount(derivedNetAmount)
                .currency(batch.getCurrency())
                .destinationAccount(batch.getDestinationBankAccount())
                .status("READY") // Progresses from implicit DRAFT to READY
                .build();

        try {
            // The DB UNIQUE constraint on settlement_batch_id prevents concurrent duplicate generation
            instruction = instructionRepository.save(instruction);
        } catch (DataIntegrityViolationException e) {
            throw new ConflictException("Concurrent instruction generation blocked by database constraints.");
        }

        log.info("[SETTLEMENT INSTRUCTION] Successfully generated {} for batch {}. Net Amount: {}", 
                 instruction.getInstructionId(), batchReference, derivedNetAmount);

        return instruction;
    }
}
