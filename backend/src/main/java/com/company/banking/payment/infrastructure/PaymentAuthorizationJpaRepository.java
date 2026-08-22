package com.company.banking.payment.infrastructure;

import com.company.banking.payment.domain.PaymentAuthorization;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface PaymentAuthorizationJpaRepository extends JpaRepository<PaymentAuthorization, Long> {
    Optional<PaymentAuthorization> findByCheckoutSessionId(String checkoutSessionId);
}
