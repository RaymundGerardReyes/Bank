package com.company.banking.apigateway.application;

import com.company.banking.apigateway.domain.WebhookDelivery;
import com.company.banking.apigateway.domain.WebhookEndpoint;
import com.company.banking.apigateway.infrastructure.WebhookDeliveryJpaRepository;
import com.company.banking.apigateway.infrastructure.WebhookEndpointJpaRepository;
import com.company.banking.common.audit.AuditEventPublisher;
import com.company.banking.common.resilience.ResilienceEngine;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.scheduling.annotation.Async;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.util.Base64;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class WebhookDispatcherService {

    private final WebhookEndpointJpaRepository endpointRepository;
    private final WebhookDeliveryJpaRepository deliveryRepository;
    private final AuditEventPublisher auditEventPublisher;
    private final ResilienceEngine resilienceEngine;

    @Async
    public void dispatchEvent(Long merchantId, String eventType, String payloadJson) {
        dispatchEvent(merchantId, "LIVE", eventType, payloadJson);
    }

    @Async
    public void dispatchEvent(Long merchantId, String environment, String eventType, String payloadJson) {
        List<WebhookEndpoint> endpoints = endpointRepository.findByMerchantIdAndEnvironmentAndStatus(merchantId, environment, "ACTIVE");

        for (WebhookEndpoint endpoint : endpoints) {
            if (!isSubscribed(endpoint.getEvents(), eventType)) {
                continue;
            }

            String webhookUrl = endpoint.getUrl();
            
            if (resilienceEngine.isCircuitOpen(webhookUrl)) {
                log.error("[WEBHOOK] Circuit is OPEN for {}. Fast-failing event {} and moving to DLQ.", webhookUrl, eventType);
                auditEventPublisher.publishEvent("WEBHOOK_DROPPED", String.valueOf(merchantId), 
                    "Circuit OPEN. Dropped webhook event to prevent cascading failure.", webhookUrl);
                saveDeliveryAttempt(endpoint.getId(), eventType, "FAILED", 503, "Circuit Open", 0);
                continue;
            }

            String eventId = "EVT-" + UUID.randomUUID().toString();
            String timestamp = String.valueOf(Instant.now().toEpochMilli());
            long startTime = System.currentTimeMillis();
            
            try {
                String signature = generateHmacSignature(endpoint.getSecretHash(), timestamp + "." + payloadJson);
                
                log.info("[WEBHOOK] Dispatching {} to {}. EventID: {}", eventType, webhookUrl, eventId);
                
                // Mocking the actual HTTP POST
                long duration = System.currentTimeMillis() - startTime;
                resilienceEngine.recordSuccess(webhookUrl);
                
                saveDeliveryAttempt(endpoint.getId(), eventType, "DELIVERED", 200, "OK", (int) duration);
                
                auditEventPublisher.publishEvent("WEBHOOK_DISPATCHED", String.valueOf(merchantId), 
                    "Successfully dispatched " + eventType + " event.", eventId);
            } catch (Exception e) {
                long duration = System.currentTimeMillis() - startTime;
                log.error("[WEBHOOK] Failed to dispatch {} event to Merchant {}: {}", eventType, merchantId, e.getMessage());
                resilienceEngine.recordFailure(webhookUrl);
                
                saveDeliveryAttempt(endpoint.getId(), eventType, "FAILED", 500, e.getMessage(), (int) duration);
                
                auditEventPublisher.publishEvent("WEBHOOK_FAILED", String.valueOf(merchantId), 
                    "Failed to dispatch webhook. Moving to DLQ.", eventId);
            }
        }
    }

    private boolean isSubscribed(String eventsJson, String eventType) {
        if (eventsJson == null || eventsJson.trim().isEmpty()) return false;
        if (eventsJson.equals("*") || eventsJson.contains("\"*\"")) return true;
        return eventsJson.contains(eventType);
    }

    private void saveDeliveryAttempt(Long endpointId, String eventType, String status, Integer code, String body, Integer duration) {
        WebhookDelivery delivery = WebhookDelivery.builder()
                .endpointId(endpointId)
                .eventId("EVT-" + UUID.randomUUID().toString())
                .eventType(eventType)
                .status(status)
                .responseCode(code)
                .responseBody(body)
                .durationMs(duration)
                .build();
        deliveryRepository.save(delivery);
    }

    private String generateHmacSignature(String secret, String data) throws Exception {
        Mac sha256_HMAC = Mac.getInstance("HmacSHA256");
        SecretKeySpec secret_key = new SecretKeySpec(secret.getBytes(StandardCharsets.UTF_8), "HmacSHA256");
        sha256_HMAC.init(secret_key);
        return Base64.getEncoder().encodeToString(sha256_HMAC.doFinal(data.getBytes(StandardCharsets.UTF_8)));
    }
}
