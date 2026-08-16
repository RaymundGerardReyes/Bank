package com.company.banking.payment.infrastructure;

import com.company.banking.payment.domain.PaymentEvent;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface PaymentEventJpaRepository extends JpaRepository<PaymentEvent, Long> {
    Optional<PaymentEvent> findByIdempotencyKey(String idempotencyKey);
    boolean existsByIdempotencyKey(String idempotencyKey);
}