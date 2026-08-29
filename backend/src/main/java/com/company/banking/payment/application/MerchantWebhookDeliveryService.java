package com.company.banking.payment.application;

import com.company.banking.apigateway.domain.WebhookEndpoint;
import com.company.banking.apigateway.infrastructure.WebhookEndpointJpaRepository;
import com.company.banking.payment.domain.PaymentEventOutbox;
import com.company.banking.payment.domain.PaymentEventOutboxStatus;
import com.company.banking.payment.infrastructure.PaymentEventOutboxJpaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.HttpStatusCodeException;
import org.springframework.web.client.RestTemplate;
import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.time.LocalDateTime;
import java.util.HexFormat;
import java.util.List;

@Service
@RequiredArgsConstructor
public class MerchantWebhookDeliveryService {

    private final PaymentEventOutboxJpaRepository outboxRepository;
    private final WebhookEndpointJpaRepository endpointRepository;
    private final RestTemplate restTemplate = new RestTemplate();

    @Transactional
    public void deliverEvent(PaymentEventOutbox event) {
        try {
            List<WebhookEndpoint> endpoints = endpointRepository.findByMerchantIdAndStatus(event.getMerchantId(), "ACTIVE");
            if (endpoints == null || endpoints.isEmpty()) {
                throw new RuntimeException("No active webhook endpoint found");
            }
            
            WebhookEndpoint endpoint = endpoints.get(0);
            String timestamp = String.valueOf(Instant.now().getEpochSecond());
            String signedContent = timestamp + "." + event.getPayload();
            
            Mac mac = Mac.getInstance("HmacSHA256");
            mac.init(new SecretKeySpec(endpoint.getSecretHash().getBytes(StandardCharsets.UTF_8), "HmacSHA256"));
            String signature = "v1=" + HexFormat.of().formatHex(mac.doFinal(signedContent.getBytes(StandardCharsets.UTF_8)));

            HttpHeaders headers = new HttpHeaders();
            headers.set("X-Bank-Timestamp", timestamp);
            headers.set("X-Bank-Signature", signature);
            headers.set("X-Bank-Event-Id", event.getEventId());
            headers.set("Content-Type", "application/json");

            HttpEntity<String> request = new HttpEntity<>(event.getPayload(), headers);
            
            ResponseEntity<String> response = restTemplate.exchange(endpoint.getUrl(), HttpMethod.POST, request, String.class);
            
            event.setStatus(PaymentEventOutboxStatus.DELIVERED);
            event.setDeliveredAt(LocalDateTime.now());
            event.setLastHttpStatus(response.getStatusCode().value());
            event.setLastError(null);

        } catch (HttpStatusCodeException e) {
            handleFailure(event, e.getStatusCode().value(), e.getMessage());
        } catch (Exception e) {
            handleFailure(event, 500, e.getMessage());
        }
        outboxRepository.save(event);
    }

    private void handleFailure(PaymentEventOutbox event, int statusCode, String errorMessage) {
        event.setAttemptCount(event.getAttemptCount() + 1);
        event.setLastHttpStatus(statusCode);
        event.setLastError(errorMessage);
        
        if (event.getAttemptCount() >= 6) {
            event.setStatus(PaymentEventOutboxStatus.DEAD_LETTER);
            event.setNextAttemptAt(null);
        } else {
            event.setStatus(PaymentEventOutboxStatus.RETRY);
            long backoffMinutes = (long) Math.pow(2, event.getAttemptCount());
            event.setNextAttemptAt(LocalDateTime.now().plusMinutes(backoffMinutes));
        }
        
        event.setLockedAt(null);
        event.setLockedBy(null);
    }
}
