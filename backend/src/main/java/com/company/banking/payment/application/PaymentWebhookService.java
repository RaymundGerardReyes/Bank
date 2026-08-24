package com.company.banking.payment.application;

import com.company.banking.payment.domain.InboundWebhookEvent;
import com.company.banking.payment.infrastructure.InboundWebhookEventJpaRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
@Slf4j
public class PaymentWebhookService {

    private final InboundWebhookEventJpaRepository webhookEventRepository;
    private final PaymentStateMachineService stateMachineService;

    // CRITICAL FIX: Removed @Transactional. Catching a DB constraint exception inside 
    // a transactional boundary causes an UnexpectedRollbackException (500 Error).
    public void processWebhook(String eventId, String provider, String payload) {
        InboundWebhookEvent event = new InboundWebhookEvent();
        event.setProvider(provider.toUpperCase());
        event.setExternalEventId(eventId);
        event.setEventType("payment.paid");
        event.setRawPayload(payload);
        event.setReceivedAt(LocalDateTime.now());
        event.setProcessingStatus("PROCESSING");
        event.setVerified(true);
        event.setAttemptCount(0);

        try {
            // Persist the event atomically. If another thread is already processing this 
            // exact webhook, the DB unique constraint will reject this insert.
            webhookEventRepository.saveAndFlush(event);
        } catch (DataIntegrityViolationException e) {
            log.warn("Duplicate concurrent webhook event blocked and ignored. Event ID: {}", eventId);
            return; // Gracefully return 200 OK so the provider stops retrying
        }

        // Extract outcome and process state securely
        String outcome = payload.contains("checkout_session.payment.paid") || payload.contains("\"status\":\"paid\"") ? "SUCCESS" : "FAILED";
        String providerReference = extractProviderReference(payload);
        
        // Delegate to state machine with required 5 arguments
        stateMachineService.processAttemptOutcome(providerReference, outcome, null, null, payload);

        event.setProcessingStatus("COMPLETED");
        event.setProcessedAt(LocalDateTime.now());
        webhookEventRepository.save(event);
    }
    
    public void handle(String provider, byte[] rawPayload, String signature) {
        String payloadStr = new String(rawPayload);
        String extractedEventId = extractEventIdFromJson(payloadStr);
        processWebhook(extractedEventId, provider, payloadStr);
    }

    private String extractProviderReference(String json) {
        try {
            com.fasterxml.jackson.databind.ObjectMapper mapper = new com.fasterxml.jackson.databind.ObjectMapper();
            com.fasterxml.jackson.databind.JsonNode root = mapper.readTree(json);
            com.fasterxml.jackson.databind.JsonNode innerData = root.path("data").path("attributes").path("data");
            if (!innerData.isMissingNode() && innerData.has("id")) {
                return innerData.get("id").asText();
            }
            return extractEventIdFromJson(json);
        } catch (Exception e) {
            return extractEventIdFromJson(json);
        }
    }
    
    private String extractEventIdFromJson(String json) {
        try {
            int idIndex = json.indexOf("\"id\":");
            if(idIndex == -1) return "unknown-" + System.currentTimeMillis();
            int startQuote = json.indexOf("\"", idIndex + 5);
            int endQuote = json.indexOf("\"", startQuote + 1);
            return json.substring(startQuote + 1, endQuote);
        } catch (Exception e) {
            return "unknown-" + System.currentTimeMillis();
        }
    }
}
