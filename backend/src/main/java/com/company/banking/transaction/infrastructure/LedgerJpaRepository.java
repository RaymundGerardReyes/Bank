package com.company.banking.transaction.infrastructure;

import com.company.banking.transaction.domain.Transaction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface LedgerJpaRepository extends JpaRepository<Transaction, Long> {
    
    Optional<Transaction> findByIdempotencyKey(String idempotencyKey);
    
    boolean existsByIdempotencyKey(String idempotencyKey);
}
