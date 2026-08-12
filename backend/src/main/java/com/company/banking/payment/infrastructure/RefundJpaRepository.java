package com.company.banking.payment.infrastructure;

import com.company.banking.payment.domain.Refund;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface RefundJpaRepository extends JpaRepository<Refund, Long> {
    Optional<Refund> findByRefundId(String refundId);
}
