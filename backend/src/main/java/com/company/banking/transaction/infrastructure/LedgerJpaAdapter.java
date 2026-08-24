package com.company.banking.transaction.infrastructure;

import com.company.banking.common.exception.BusinessException;
import com.company.banking.common.exception.ErrorCode;
import com.company.banking.transaction.application.port.out.LedgerPersistencePort;
import com.company.banking.transaction.domain.EntryType;
import com.company.banking.transaction.domain.LedgerEntry;
import com.company.banking.transaction.domain.Transaction;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@Component
public class LedgerJpaAdapter implements LedgerPersistencePort {

    private final LedgerEntryJpaRepository ledgerEntryRepository;
    private final TransactionJpaRepository transactionRepository;

    public LedgerJpaAdapter(LedgerEntryJpaRepository ledgerEntryRepository, TransactionJpaRepository transactionRepository) {
        this.ledgerEntryRepository = ledgerEntryRepository;
        this.transactionRepository = transactionRepository;
    }

    @Override
    public void saveLedgerEntries(List<LedgerEntry> entries) {
        if (entries == null || entries.isEmpty()) {
            throw new IllegalArgumentException("Cannot save empty ledger entries");
        }

        BigDecimal totalDebits = entries.stream()
                .filter(e -> e.getEntryType() == EntryType.DEBIT)
                .map(LedgerEntry::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal totalCredits = entries.stream()
                .filter(e -> e.getEntryType() == EntryType.CREDIT)
                .map(LedgerEntry::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        // Strictly enforce the Double-Entry Invariant before hitting the database
        if (totalDebits.compareTo(totalCredits) != 0) {
            throw new BusinessException(ErrorCode.INVALID_REQUEST,
                    "Ledger integrity violation: Debits (" + totalDebits + ") do not equal Credits (" + totalCredits + ")");
        }

        ledgerEntryRepository.saveAll(entries);
    }

    @Override
    public Transaction save(Transaction transaction) {
        return transactionRepository.save(transaction);
    }

    @Override
    public Optional<Transaction> findByIdempotencyKey(String idempotencyKey) {
        return transactionRepository.findByIdempotencyKey(idempotencyKey);
    }

    @Override
    public boolean existsByIdempotencyKey(String idempotencyKey) {
        return transactionRepository.findByIdempotencyKey(idempotencyKey).isPresent();
    }

    @Override
    public Optional<Transaction> findById(Long id) {
        return transactionRepository.findById(id);
    }

    @Override
    public List<LedgerEntry> findAllByTransactionReference(String transactionReference) {
        return ledgerEntryRepository.findByTransactionReference(transactionReference);
    }
}
