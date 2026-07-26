package com.company.banking.transaction.infrastructure;

import com.company.banking.transaction.application.port.out.LedgerPersistencePort;
import com.company.banking.transaction.domain.Transaction;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.Optional;

@Component
@RequiredArgsConstructor
public class LedgerJpaAdapter implements LedgerPersistencePort {

    private final TransactionJpaRepository transactionJpaRepository;

    @Override
    public Transaction saveTransaction(Transaction transaction) {
        return transactionJpaRepository.save(transaction);
    }

    @Override
    public Optional<Transaction> findByIdempotencyKey(String idempotencyKey) {
        return transactionJpaRepository.findByIdempotencyKey(idempotencyKey);
    }
}
