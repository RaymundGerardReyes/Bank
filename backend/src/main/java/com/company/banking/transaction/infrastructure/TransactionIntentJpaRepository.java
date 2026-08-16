package com.company.banking.transaction.infrastructure;

import com.company.banking.transaction.domain.TransactionIntent;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import jakarta.persistence.LockModeType;

import java.util.Optional;

@Repository
public interface TransactionIntentJpaRepository extends JpaRepository<TransactionIntent, Long> {

    Optional<TransactionIntent> findByIdempotencyKey(String idempotencyKey);

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("SELECT t FROM TransactionIntent t WHERE t.id = :id")
    Optional<TransactionIntent> findByIdForUpdate(@Param("id") Long id);
}
