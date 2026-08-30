package com.company.banking.payment.infrastructure;

import com.company.banking.payment.domain.PaymentQrCode;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface PaymentQrCodeJpaRepository extends JpaRepository<PaymentQrCode, Long> {
    Optional<PaymentQrCode> findByPaymentIntentId(Long paymentIntentId);
}
