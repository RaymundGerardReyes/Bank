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
    public void saveLedgerEntry(LedgerEntry entry) {
        ledgerEntryJpaRepository.save(entry);
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
