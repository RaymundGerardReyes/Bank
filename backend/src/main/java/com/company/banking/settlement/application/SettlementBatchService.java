package com.company.banking.settlement.application;

import com.company.banking.common.exception.BusinessException;
import com.company.banking.common.exception.ConflictException;
import com.company.banking.common.exception.ErrorCode;
import com.company.banking.settlement.domain.SettlementBatch;
import com.company.banking.settlement.infrastructure.SettlementBatchJpaRepository;
import com.company.banking.transaction.domain.Transaction;
import com.company.banking.transaction.infrastructure.TransactionJpaRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Slf4j
public class SettlementBatchService {

    private final SettlementEligibilityService eligibilityService;
    private final SettlementBatchJpaRepository settlementBatchRepository;
    private final TransactionJpaRepository transactionRepository;

    @Transactional
    public SettlementBatch createSettlementBatch(Long merchantId, Long settlementWindowId, String destBankAccount, String destRoutingNumber) {
        // 1. Deterministic Idempotency Key (e.g., BATCH-W100-M99)
        String deterministicBatchRef = String.format("BATCH-W%d-M%d", settlementWindowId, merchantId);

        // Preliminary Application-Level Idempotency Check
        Optional<SettlementBatch> existingBatch = settlementBatchRepository.findByBatchReference(deterministicBatchRef);
        if (existingBatch.isPresent()) {
            log.info("[SETTLEMENT BATCH] Batch {} already exists. Idempotent return.", deterministicBatchRef);
            return existingBatch.get();
        }

        // 2. Lock Eligible Transactions
        List<Transaction> eligibleTransactions = eligibilityService.getEligibleTransactionsForUpdate(merchantId);

        if (eligibleTransactions.isEmpty()) {
            log.info("[SETTLEMENT BATCH] No eligible transactions found for Merchant ID: {} in Window: {}", merchantId, settlementWindowId);
            return null; // Empty window, nothing to settle
        }

        // 3. Server-Derived Financial Aggregate
        BigDecimal batchGrossAmount = eligibleTransactions.stream()
                .map(Transaction::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        String currency = eligibleTransactions.get(0).getCurrency();

        // 4. Create the Immutable Batch Record
        SettlementBatch batch = SettlementBatch.builder()
                .batchReference(deterministicBatchRef)
                .merchantId(merchantId)
                .amount(batchGrossAmount)
                .currency(currency)
                .status("FINALIZED") // Explicit state machine: FINALIZED means membership is locked
                .destinationBankAccount(destBankAccount)
                .destinationRoutingNumber(destRoutingNumber)
                .createdAt(LocalDateTime.now())
                .build();

        try {
            // The DB UNIQUE constraint on batch_reference provides our ultimate race-condition safety net
            batch = settlementBatchRepository.save(batch);
        } catch (DataIntegrityViolationException e) {
            throw new ConflictException("Settlement batch operation is idempotent. Blocked at database level.");
        }

        // 5. Update Transaction Membership (Does NOT alter historical LedgerEntry records)
        for (Transaction tx : eligibleTransactions) {
            if (tx.getSettlementBatchId() != null) {
                // Failsafe invariant check
                throw new BusinessException(ErrorCode.INVALID_REQUEST, "Transaction " + tx.getTransactionReference() + " is already assigned to a batch!");
            }
            tx.setSettlementBatchId(batch.getId());
        }
        
        transactionRepository.saveAll(eligibleTransactions);

        log.info("[SETTLEMENT BATCH] Successfully finalized Batch {} for {} transactions. Gross Amount: {}", 
                 batch.getBatchReference(), eligibleTransactions.size(), batchGrossAmount);

        return batch;
    }
}
