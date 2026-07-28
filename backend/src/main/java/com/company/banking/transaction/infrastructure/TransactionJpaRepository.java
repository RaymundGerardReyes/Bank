package com.company.banking.transaction.infrastructure;

import com.company.banking.transaction.domain.Transaction;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface TransactionJpaRepository extends JpaRepository<Transaction, Long> {
    Optional<Transaction> findByIdempotencyKey(String idempotencyKey);
    
    Page<Transaction> findBySourceAccountNumberOrDestinationAccountNumber(String sourceAccountNumber, String destinationAccountNumber, Pageable pageable);
}
