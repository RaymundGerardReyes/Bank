package com.company.banking.payment.infrastructure;

import com.company.banking.payment.domain.PaymentIntent;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import jakarta.persistence.LockModeType;

import java.util.List;
import java.util.Optional;

public interface PaymentIntentJpaRepository extends JpaRepository<PaymentIntent, Long> {
    Optional<PaymentIntent> findByIntentId(String intentId);
    
    // Returns List to absorb H2 database concurrency duplicates without crashing
    List<PaymentIntent> findByIdempotencyKey(String idempotencyKey);

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("SELECT p FROM PaymentIntent p WHERE p.intentId = :intentId")
    Optional<PaymentIntent> findByIntentIdForUpdate(@Param("intentId") String intentId);
}
