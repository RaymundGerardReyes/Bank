package com.company.banking.apigateway.infrastructure;

import com.company.banking.apigateway.domain.WebhookDelivery;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface WebhookDeliveryJpaRepository extends JpaRepository<WebhookDelivery, Long> {
    List<WebhookDelivery> findTop50ByEndpointIdOrderByCreatedAtDesc(Long endpointId);
}
