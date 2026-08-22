package com.company.banking.payment.infrastructure;

import com.company.banking.payment.domain.PaymentAttempt;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PaymentAttemptJpaRepository extends JpaRepository<PaymentAttempt, Long> {
    Optional<PaymentAttempt> findByAttemptId(String attemptId);
    Optional<PaymentAttempt> findByProviderReference(String providerReference);
    List<PaymentAttempt> findByPaymentIntentId(Long paymentIntentId);
}