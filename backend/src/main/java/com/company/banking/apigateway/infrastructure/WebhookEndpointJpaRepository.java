package com.company.banking.apigateway.infrastructure;

import com.company.banking.apigateway.domain.WebhookEndpoint;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface WebhookEndpointJpaRepository extends JpaRepository<WebhookEndpoint, Long> {
    List<WebhookEndpoint> findByMerchantId(Long merchantId);
    List<WebhookEndpoint> findByMerchantIdAndEnvironmentAndStatus(Long merchantId, String environment, String status);
}
