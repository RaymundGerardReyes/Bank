package com.company.banking.transaction.infrastructure;

import com.company.banking.transaction.application.port.out.LedgerPersistencePort;
import com.company.banking.transaction.domain.Transaction;
import com.company.banking.transaction.domain.LedgerEntry;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.Optional;

@Component
@RequiredArgsConstructor
public class LedgerJpaAdapter implements LedgerPersistencePort {

    private final TransactionJpaRepository transactionJpaRepository;
    private final LedgerEntryJpaRepository ledgerEntryJpaRepository;

    @Override
    public Transaction save(Transaction transaction) {
        return transactionJpaRepository.save(transaction);
    }

    @Override
    public void saveLedgerEntries(java.util.List<LedgerEntry> entries) {
        if (entries == null || entries.isEmpty()) {
            throw new IllegalArgumentException("Cannot save empty ledger entries");
        }

        java.math.BigDecimal totalDebits = java.math.BigDecimal.ZERO;
        java.math.BigDecimal totalCredits = java.math.BigDecimal.ZERO;

        for (LedgerEntry entry : entries) {
            if ("DEBIT".equals(entry.getEntryType().name())) {
                totalDebits = totalDebits.add(entry.getAmount());
            } else if ("CREDIT".equals(entry.getEntryType().name())) {
                totalCredits = totalCredits.add(entry.getAmount());
            }
        }

        if (totalDebits.compareTo(totalCredits) != 0) {
            throw new com.company.banking.common.exception.BusinessException(
                com.company.banking.common.exception.ErrorCode.INVALID_REQUEST, 
                "Ledger integrity violation: Debits (" + totalDebits + ") do not equal Credits (" + totalCredits + ")"
            );
        }

        ledgerEntryJpaRepository.saveAll(entries);
    }

    @Override
    public Optional<Transaction> findByIdempotencyKey(String idempotencyKey) {
        return transactionJpaRepository.findByIdempotencyKey(idempotencyKey);
    }

    @Override
    public boolean existsByIdempotencyKey(String idempotencyKey) {
        return transactionJpaRepository.findByIdempotencyKey(idempotencyKey).isPresent();
    }

    @Override
    public Optional<Transaction> findById(Long id) {
        return transactionJpaRepository.findById(id);
    }
}
