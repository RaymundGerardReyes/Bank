package com.company.banking.payment.infrastructure;

import com.company.banking.payment.domain.PaymentParticipant;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface PaymentParticipantJpaRepository extends JpaRepository<PaymentParticipant, Long> {
    Optional<PaymentParticipant> findByBic(String bic);
}
