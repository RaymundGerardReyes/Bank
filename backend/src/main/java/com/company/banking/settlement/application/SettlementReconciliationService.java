package com.company.banking.settlement.application;

import com.company.banking.common.exception.BusinessException;
import com.company.banking.common.exception.ErrorCode;
import com.company.banking.settlement.domain.SettlementBatch;
import com.company.banking.settlement.domain.SettlementException;
import com.company.banking.settlement.domain.SettlementInstruction;
import com.company.banking.settlement.infrastructure.MerchantBalanceJpaRepository;
import com.company.banking.settlement.infrastructure.SettlementBatchJpaRepository;
import com.company.banking.settlement.infrastructure.SettlementExceptionJpaRepository;
import com.company.banking.settlement.infrastructure.SettlementInstructionJpaRepository;
import com.company.banking.transaction.domain.EntryType;
import com.company.banking.transaction.domain.LedgerEntry;
import com.company.banking.transaction.domain.Transaction;
import com.company.banking.transaction.infrastructure.LedgerEntryJpaRepository;
import com.company.banking.transaction.infrastructure.TransactionJpaRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class SettlementReconciliationService {

    private final SettlementInstructionJpaRepository instructionRepository;
    private final SettlementBatchJpaRepository batchRepository;
    private final TransactionJpaRepository transactionRepository;
    private final LedgerEntryJpaRepository ledgerEntryRepository;
    private final SettlementExceptionJpaRepository exceptionRepository;
    private final MerchantBalanceJpaRepository merchantBalanceRepository; // Assuming this exists per V19 migrations

    @Transactional
    public SettlementInstruction reconcileInstruction(String instructionId) {
        log.info("[RECONCILIATION] Starting integrity checks for Instruction: {}", instructionId);

        // 1. Lock the Instruction (Pessimistic Write prevents concurrent reconciliations)
        SettlementInstruction instruction = instructionRepository.findByInstructionIdForUpdate(instructionId)
                .orElseThrow(() -> new BusinessException(ErrorCode.NOT_FOUND, "Instruction not found: " + instructionId));

        // 2. Enforce Server-Side State Machine & Idempotency
        if ("RECONCILED".equals(instruction.getStatus()) || "EXCEPTION".equals(instruction.getStatus())) {
            log.info("[RECONCILIATION] Instruction {} is already in terminal state {}. Idempotent return.", 
                     instructionId, instruction.getStatus());
            return instruction;
        }

        if (!"READY".equals(instruction.getStatus()) && !"SUBMITTED".equals(instruction.getStatus())) {
            throw new BusinessException(ErrorCode.INVALID_REQUEST, 
                    "Invalid state transition. Cannot reconcile instruction in state: " + instruction.getStatus());
        }

        SettlementBatch batch = batchRepository.findById(instruction.getSettlementBatchId())
                .orElseThrow(() -> new BusinessException(ErrorCode.NOT_FOUND, "Linked batch not found"));

        List<Transaction> batchTransactions = transactionRepository.findAll().stream()
                .filter(t -> batch.getId().equals(t.getSettlementBatchId()))
                .toList();

        List<String> discrepancies = new ArrayList<>();

        // --- INVARIANT 1: Batch must equal its transactions ---
        BigDecimal transactionsSum = batchTransactions.stream()
                .map(Transaction::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        
        if (batch.getAmount().compareTo(transactionsSum) != 0) {
            discrepancies.add(String.format("Batch gross (%s) does not match sum of assigned transactions (%s)", 
                    batch.getAmount(), transactionsSum));
        }

        // --- INVARIANT 2: Instruction must equal finalized batch ---
        if (instruction.getAmount().compareTo(batch.getAmount()) != 0) {
            discrepancies.add(String.format("Instruction amount (%s) does not match finalized batch net amount (%s)", 
                    instruction.getAmount(), batch.getAmount()));
        }

        // --- INVARIANT 3: Every transaction must have balanced double-entry ledger records ---
        for (Transaction tx : batchTransactions) {
            List<LedgerEntry> entries = ledgerEntryRepository.findByTransactionReference(tx.getTransactionReference());
            
            BigDecimal debits = entries.stream()
                    .filter(e -> e.getEntryType() == EntryType.DEBIT)
                    .map(LedgerEntry::getAmount)
                    .reduce(BigDecimal.ZERO, BigDecimal::add);
            BigDecimal credits = entries.stream()
                    .filter(e -> e.getEntryType() == EntryType.CREDIT)
                    .map(LedgerEntry::getAmount)
                    .reduce(BigDecimal.ZERO, BigDecimal::add);

            if (debits.compareTo(credits) != 0) {
                discrepancies.add(String.format("Transaction %s ledger is imbalanced. Debits: %s, Credits: %s", 
                        tx.getTransactionReference(), debits, credits));
            }
        }

        // --- RESOLUTION: Pass or Fail cleanly ---
        if (discrepancies.isEmpty()) {
            log.info("[RECONCILIATION] Instruction {} passed all financial integrity checks.", instructionId);
            instruction.setStatus("RECONCILED");
            batch.setStatus("RECONCILED");
        } else {
            String errorDescription = String.join(" | ", discrepancies);
            log.error("[RECONCILIATION] Discrepancies detected for Instruction {}: {}", instructionId, errorDescription);
            
            instruction.setStatus("EXCEPTION");
            batch.setStatus("EXCEPTION");

            SettlementException exception = SettlementException.builder()
                    .exceptionReference("EXC-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase())
                    .settlementInstructionId(instruction.getId())
                    .errorCode("RECONCILIATION_MISMATCH")
                    .errorDescription(errorDescription)
                    .status("UNRESOLVED")
                    .createdAt(LocalDateTime.now())
                    .build();
            
            exceptionRepository.save(exception);
        }

        batchRepository.save(batch);
        return instructionRepository.save(instruction);
    }
}
