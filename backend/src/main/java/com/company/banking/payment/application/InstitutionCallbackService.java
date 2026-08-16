package com.company.banking.payment.application;

import com.company.banking.payment.domain.InstitutionCallbackLog;
import com.company.banking.payment.domain.InstitutionCallbackPayload;
import com.company.banking.payment.domain.PaymentSession;
import com.company.banking.payment.infrastructure.InstitutionCallbackLogJpaRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.scheduling.annotation.Async;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestTemplate;

import java.time.LocalDateTime;
import java.util.List;

/**
 * Phase E: Manages Path B of the callback architecture (Bank -> Institution).
 * Replaces the previous stub with a robust, persistent webhook dispatcher featuring exponential backoff.
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class InstitutionCallbackService {

    private final InstitutionCallbackLogJpaRepository callbackLogRepository;
    private final ObjectMapper objectMapper;
    private final RestTemplate restTemplate = new RestTemplate(); // Can be injected if configured globally

    private static final int MAX_RETRIES = 3;

    @Async
    @Transactional
    public void notify(PaymentSession session) {
        if (session.getCallbackUrl() == null || session.getCallbackUrl().isBlank()) {
            log.info("[CALLBACK] Session {} has no registered callbackUrl. Skipping notification.", session.getSessionId());
            return;
        }

        log.info("[CALLBACK] Building terminal state notification for session: {}", session.getSessionId());

        InstitutionCallbackPayload payload = InstitutionCallbackPayload.builder()
                .paymentSessionId(session.getSessionId())
                .institutionReference(session.getInstitutionReference())
                .status(session.getStatus().name())
                .amount(session.getAmount())
                .currency(session.getCurrency())
                .completedAt(session.getCompletedAt())
                .build();

        String jsonPayload = "{}";
        try {
            jsonPayload = objectMapper.writeValueAsString(payload);
        } catch (Exception e) {
            log.error("[CALLBACK] Serialization error for session payload: {}", session.getSessionId(), e);
            return;
        }

        InstitutionCallbackLog logEntry = InstitutionCallbackLog.builder()
                .paymentSessionId(session.getSessionId())
                .callbackUrl(session.getCallbackUrl())
                .payload(jsonPayload)
                .status("PENDING")
                .attemptCount(0)
                .nextRetryAt(LocalDateTime.now()) // Ready immediately
                .build();

        logEntry = callbackLogRepository.save(logEntry);

        // Execute initial dispatch immediately
        dispatchWithRetry(logEntry);
    }

    /**
     * Polling mechanism to pick up stalled or failed callbacks matching the exponential backoff timeline.
     */
    @Scheduled(fixedDelay = 60000) // Runs every minute
    @Transactional
    public void processPendingCallbacks() {
        List<InstitutionCallbackLog> pendingLogs = callbackLogRepository.findByStatusAndNextRetryAtBefore("PENDING", LocalDateTime.now());
        
        for (InstitutionCallbackLog logEntry : pendingLogs) {
            dispatchWithRetry(logEntry);
        }
    }

    private void dispatchWithRetry(InstitutionCallbackLog logEntry) {
        logEntry.setAttemptCount(logEntry.getAttemptCount() + 1);
        
        try {
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.set("X-Bank-Signature", generateSignature(logEntry.getPayload())); // HMAC Security Header

            HttpEntity<String> requestEntity = new HttpEntity<>(logEntry.getPayload(), headers);
            
            log.info("[CALLBACK] Dispatching webhook to {} (Attempt {}/{})", logEntry.getCallbackUrl(), logEntry.getAttemptCount(), MAX_RETRIES);
            
            ResponseEntity<String> response = restTemplate.postForEntity(logEntry.getCallbackUrl(), requestEntity, String.class);

            logEntry.setResponseCode(response.getStatusCode().value());
            logEntry.setResponseBody(response.getBody());

            if (response.getStatusCode().is2xxSuccessful()) {
                logEntry.setStatus("SUCCESS");
                log.info("[CALLBACK] Webhook successfully acknowledged by {}", logEntry.getCallbackUrl());
            } else {
                handleFailure(logEntry);
            }

        } catch (Exception e) {
            log.error("[CALLBACK] Network/Connectivity exception while reaching {}: {}", logEntry.getCallbackUrl(), e.getMessage());
            logEntry.setResponseCode(500);
            logEntry.setResponseBody(e.getMessage() != null ? e.getMessage().substring(0, Math.min(e.getMessage().length(), 250)) : "Unknown Error");
            handleFailure(logEntry);
        }

        callbackLogRepository.save(logEntry);
    }

    private void handleFailure(InstitutionCallbackLog logEntry) {
        if (logEntry.getAttemptCount() < MAX_RETRIES) {
            logEntry.setStatus("PENDING");
            // Exponential backoff logic: 2, 4, 8 minutes depending on the attempt count
            long backoffMinutes = (long) Math.pow(2, logEntry.getAttemptCount());
            logEntry.setNextRetryAt(LocalDateTime.now().plusMinutes(backoffMinutes));
            log.warn("[CALLBACK] Dispatch failed. Scheduling retry {} for {} at {}", 
                     logEntry.getAttemptCount() + 1, logEntry.getPaymentSessionId(), logEntry.getNextRetryAt());
        } else {
            logEntry.setStatus("FAILED");
            log.error("[CALLBACK] Exhausted all {} retries for session {}. Institution payload delivery failed permanently.", 
                      MAX_RETRIES, logEntry.getPaymentSessionId());
        }
    }

    private String generateSignature(String payload) {
        // Implementation for HMAC SHA256 generation using the Merchant's specific API Secret
        // Dummy implementation to ensure architectural completeness. Replace with actual javax.crypto.Mac logic.
        return "sha256=" + java.util.UUID.randomUUID().toString().replace("-", "");
    }
}