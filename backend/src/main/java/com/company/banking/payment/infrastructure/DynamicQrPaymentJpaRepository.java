package com.company.banking.payment.infrastructure;

import com.company.banking.payment.domain.DynamicQrPayment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface DynamicQrPaymentJpaRepository extends JpaRepository<DynamicQrPayment, Long> {
    Optional<DynamicQrPayment> findByQrReference(String qrReference);
    Optional<DynamicQrPayment> findByPaymentIntentId(Long paymentIntentId);
}
