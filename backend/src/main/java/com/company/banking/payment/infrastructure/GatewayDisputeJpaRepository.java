package com.company.banking.payment.infrastructure;

import com.company.banking.payment.domain.GatewayDispute;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface GatewayDisputeJpaRepository extends JpaRepository<GatewayDispute, Long> {
    Optional<GatewayDispute> findByDisputeReference(String disputeReference);
    List<GatewayDispute> findByMerchantId(Long merchantId);
}
