package com.company.banking.payment.infrastructure;

import com.company.banking.payment.domain.PaymentIntent;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface PaymentIntentJpaRepository extends JpaRepository<PaymentIntent, Long> {
    Optional<PaymentIntent> findByIntentId(String intentId);
    Optional<PaymentIntent> findByIdempotencyKey(String idempotencyKey);
}
