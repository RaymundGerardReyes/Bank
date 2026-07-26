package com.company.banking.transaction.application.port.out;

import com.company.banking.transaction.domain.Transaction;

import java.util.Optional;

public interface LedgerPersistencePort {
    Transaction saveTransaction(Transaction transaction);
    Optional<Transaction> findByIdempotencyKey(String idempotencyKey);
}
