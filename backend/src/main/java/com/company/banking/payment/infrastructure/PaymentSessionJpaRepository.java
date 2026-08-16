package com.company.banking.payment.infrastructure;

import com.company.banking.payment.domain.PaymentSession;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface PaymentSessionJpaRepository extends JpaRepository<PaymentSession, Long> {
    Optional<PaymentSession> findBySessionId(String sessionId);
    Optional<PaymentSession> findBySessionIdAndInstitutionId(String sessionId, Long institutionId);
}