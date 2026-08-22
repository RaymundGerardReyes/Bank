package com.company.banking.payment.infrastructure;

import com.company.banking.payment.domain.PaymentIntent;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import jakarta.persistence.LockModeType;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

@Repository
public interface PaymentIntentJpaRepository extends JpaRepository<PaymentIntent, Long> {
    Optional<PaymentIntent> findByIntentId(String intentId);
    Optional<PaymentIntent> findByIdempotencyKey(String idempotencyKey);

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("SELECT p FROM PaymentIntent p WHERE p.intentId = :intentId")
    Optional<PaymentIntent> findByIntentIdForUpdate(@Param("intentId") String intentId);
}
