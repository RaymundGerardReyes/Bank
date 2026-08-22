package com.company.banking.payment.infrastructure;

import com.company.banking.payment.domain.Refund;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.Optional;

@Repository
public interface RefundJpaRepository extends JpaRepository<Refund, Long> {
    Optional<Refund> findByRefundId(String refundId);

    @Query("SELECT COALESCE(SUM(r.amount), 0) FROM Refund r WHERE r.paymentIntentId = :intentId AND r.status = 'COMPLETED'")
    BigDecimal sumCompletedRefundsByPaymentIntentId(@Param("intentId") Long intentId);
}
