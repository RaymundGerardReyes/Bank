package com.company.banking.payment.application;

import com.company.banking.apigateway.domain.WebhookEndpoint;
import com.company.banking.apigateway.infrastructure.WebhookEndpointJpaRepository;
import com.company.banking.payment.domain.PaymentEventOutbox;
import com.company.banking.payment.domain.PaymentEventOutboxStatus;
import com.company.banking.payment.infrastructure.PaymentEventOutboxJpaRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.nio.charset.StandardCharsets;
import java.time.Duration;
import java.time.Instant;
import java.time.LocalDateTime;
import java.util.HexFormat;
import java.util.List;
import java.util.Optional;
import java.util.Random;

@Service
@RequiredArgsConstructor
@Slf4j
public class MerchantWebhookDeliveryService {

    private final WebhookEndpointJpaRepository endpointRepository;
    private final PaymentEventOutboxJpaRepository outboxRepository;
    private final HttpClient httpClient = HttpClient.newBuilder()
            .connectTimeout(Duration.ofSeconds(10))
            .build();

    private static final int MAX_ATTEMPTS = 6; // Dead-letter after 6 total attempts
    private final Random random = new Random();

    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public void deliverEvent(PaymentEventOutbox event) {
        log.info("[WEBHOOK] Attempting delivery for Event: {}", event.getEventId());

        try {
            List<WebhookEndpoint> endpoints = endpointRepository
                    .findByMerchantIdAndEnvironmentAndStatus(event.getMerchantId(), "LIVE", "ACTIVE");

            if (endpoints.isEmpty()) {
                handleFailure(event, 500, "No active webhook endpoint found");
                return;
            }

            WebhookEndpoint endpoint = endpoints.get(0); 
            String timestamp = String.valueOf(Instant.now().getEpochSecond());
            String signature = generateHmacSignature(endpoint.getSecretHash(), timestamp, event.getPayload());

            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create(endpoint.getUrl()))
                    .timeout(Duration.ofSeconds(15))
                    .header("Content-Type", "application/json")
                    .header("X-Bank-Event-Id", event.getEventId())
                    .header("X-Bank-Event-Type", event.getEventType().name())
                    .header("X-Bank-Timestamp", timestamp)
                    .header("X-Bank-Signature", "v1=" + signature)
                    .header("X-Bank-Api-Version", event.getApiVersion())
                    .POST(HttpRequest.BodyPublishers.ofString(event.getPayload()))
                    .build();

            HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());
            
            int statusCode = response.statusCode();
            if (statusCode >= 200 && statusCode < 300) {
                event.setStatus(PaymentEventOutboxStatus.DELIVERED);
                event.setDeliveredAt(LocalDateTime.now());
                event.setLastHttpStatus(statusCode);
                event.setLastError(null);
                log.info("[WEBHOOK] Event {} DELIVERED.", event.getEventId());
            } else {
                handleFailure(event, statusCode, response.body());
            }
        } catch (Exception e) {
            handleFailure(event, 500, e.getMessage());
        } finally {
            event.setLockedAt(null);
            event.setLockedBy(null);
            outboxRepository.save(event);
        }
    }

    private void handleFailure(PaymentEventOutbox event, int statusCode, String errorMsg) {
        int attempts = event.getAttemptCount() + 1;
        event.setAttemptCount(attempts);
        event.setLastHttpStatus(statusCode);
        event.setLastError(errorMsg);
        
        if (attempts >= MAX_ATTEMPTS) {
            event.setStatus(PaymentEventOutboxStatus.DEAD_LETTER);
            log.error("[WEBHOOK] Event {} exhausted {} retries -> DEAD_LETTER.", event.getEventId(), MAX_ATTEMPTS);
        } else {
            event.setStatus(PaymentEventOutboxStatus.RETRY);
            event.setNextAttemptAt(calculateNextAttempt(attempts));
            log.warn("[WEBHOOK] Event {} failed. Retry #{} at {}", event.getEventId(), attempts, event.getNextAttemptAt());
        }
    }

    private LocalDateTime calculateNextAttempt(int attempt) {
        long baseDelaySeconds = switch (attempt) {
            case 1 -> 0;     // immediate
            case 2 -> 30;    // +30 sec
            case 3 -> 120;   // +2 min
            case 4 -> 600;   // +10 min
            case 5 -> 1800;  // +30 min
            case 6 -> 7200;  // +2 hr
            default -> 14400;// +4 hr max
        };
        return LocalDateTime.now().plusSeconds(baseDelaySeconds + random.nextInt(15));
    }

    private String generateHmacSignature(String secret, String timestamp, String payload) {
        try {
            String signedContent = timestamp + "." + payload;
            Mac mac = Mac.getInstance("HmacSHA256");
            mac.init(new SecretKeySpec(secret.getBytes(StandardCharsets.UTF_8), "HmacSHA256"));
            byte[] hash = mac.doFinal(signedContent.getBytes(StandardCharsets.UTF_8));
            return HexFormat.of().formatHex(hash);
        } catch (Exception e) {
            throw new RuntimeException("Failed to generate webhook signature", e);
        }
    }
}
