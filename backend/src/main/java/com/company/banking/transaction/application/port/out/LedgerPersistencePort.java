package com.company.banking.transaction.application.port.out;

import com.company.banking.transaction.domain.Transaction;
import com.company.banking.transaction.domain.LedgerEntry;

import java.util.Optional;

public interface LedgerPersistencePort {
    Transaction save(Transaction transaction);
    void saveLedgerEntries(java.util.List<LedgerEntry> entries);
    Optional<Transaction> findByIdempotencyKey(String idempotencyKey);
    Optional<Transaction> findById(Long id);
    boolean existsByIdempotencyKey(String idempotencyKey);
}
