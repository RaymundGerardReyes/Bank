package com.company.banking.payment.infrastructure;

import com.company.banking.payment.domain.PaymentMessage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface PaymentMessageJpaRepository extends JpaRepository<PaymentMessage, Long> {
    Optional<PaymentMessage> findByMessageId(String messageId);
}
