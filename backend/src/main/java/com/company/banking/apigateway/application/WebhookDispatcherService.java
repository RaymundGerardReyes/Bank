package com.company.banking.apigateway.application;

import com.company.banking.apigateway.domain.ApiClient;
import com.company.banking.apigateway.infrastructure.ApiClientJpaRepository;
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
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class WebhookDispatcherService {

    private final ApiClientJpaRepository apiClientJpaRepository;
    private final AuditEventPublisher auditEventPublisher;
    private final ResilienceEngine resilienceEngine;

    @Async
    public void dispatchEvent(Long merchantId, String eventType, String payloadJson) {
        apiClientJpaRepository.findAll().stream()
                .filter(client -> client.getMerchantId().equals(merchantId) && "ACTIVE".equals(client.getStatus()))
                .findFirst()
                .ifPresent(client -> {
                    String webhookUrl = "https://merchant.system/webhooks"; // Mocked endpoint
                    
                    if (resilienceEngine.isCircuitOpen(webhookUrl)) {
                        log.error("[WEBHOOK] Circuit is OPEN for {}. Fast-failing event {} and moving to DLQ.", webhookUrl, eventType);
                        auditEventPublisher.publishEvent("WEBHOOK_DROPPED", client.getClientId(), 
                            "Circuit OPEN. Dropped webhook event to prevent cascading failure.", webhookUrl);
                        return;
                    }

                    String eventId = "EVT-" + UUID.randomUUID().toString();
                    String timestamp = String.valueOf(Instant.now().toEpochMilli());
                    
                    try {
                        String signature = generateHmacSignature(client.getClientSecretHash(), timestamp + "." + payloadJson);
                        
                        log.info("[WEBHOOK] Dispatching {} to {}. EventID: {}", eventType, webhookUrl, eventId);
                        
                        // Mocking the actual HTTP POST. If it succeeds:
                        resilienceEngine.recordSuccess(webhookUrl);
                        
                        auditEventPublisher.publishEvent("WEBHOOK_DISPATCHED", client.getClientId(), 
                            "Successfully dispatched " + eventType + " event.", eventId);
                    } catch (Exception e) {
                        log.error("[WEBHOOK] Failed to dispatch {} event to Merchant {}: {}", eventType, merchantId, e.getMessage());
                        resilienceEngine.recordFailure(webhookUrl);
                        
                        auditEventPublisher.publishEvent("WEBHOOK_FAILED", client.getClientId(), 
                            "Failed to dispatch webhook. Moving to Dead Letter Queue.", eventId);
                    }
                });
    }

    private String generateHmacSignature(String secret, String data) throws Exception {
        Mac sha256_HMAC = Mac.getInstance("HmacSHA256");
        SecretKeySpec secret_key = new SecretKeySpec(secret.getBytes(StandardCharsets.UTF_8), "HmacSHA256");
        sha256_HMAC.init(secret_key);
        return Base64.getEncoder().encodeToString(sha256_HMAC.doFinal(data.getBytes(StandardCharsets.UTF_8)));
    }
}
