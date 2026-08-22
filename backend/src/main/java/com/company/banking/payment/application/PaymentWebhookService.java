package com.company.banking.payment.application;

import com.company.banking.common.exception.BusinessException;
import com.company.banking.common.exception.ErrorCode;
import com.company.banking.payment.domain.InboundWebhookEvent;
import com.company.banking.payment.gateway.ExternalPaymentGateway;
import com.company.banking.payment.infrastructure.InboundWebhookEventJpaRepository;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.nio.charset.StandardCharsets;
import java.time.LocalDateTime;
import java.util.List;

/**
 * Phase G: Secure inbound webhook lifecycle service.
 *
 * Enforces the following invariant order before any state change occurs:
 *
 *   RAW bytes received
 *       ↓
 *   1. Resolve gateway by provider name
 *       ↓
 *   2. HMAC-SHA256 signature verification  (fails fast → HTTP 401)
 *       ↓
 *   3. Idempotency check (provider + external_event_id)  (duplicate → HTTP 200, no-op)
 *       ↓
 *   4. JSON parsing — only AFTER verification
 *       ↓
 *   5. Extract providerReference + eventType
 *       ↓
 *   6. Normalize status
 *       ↓
 *   7. Persist InboundWebhookEvent record
 *       ↓
 *   8. Delegate to PaymentStateMachineService.processAttemptOutcome()
 *
 * This service is intentionally decoupled from HTTP concerns — it operates on
 * raw Strings and provider names so the controller stays thin.
 *
 * Wiring to existing infrastructure:
 * - PaymentStateMachineService.processAttemptOutcome() — existing, unchanged
 * - InboundWebhookEventJpaRepository — new in Phase G
 * - List<ExternalPaymentGateway> — Spring injects all registered gateways (same as ReconciliationService)
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class PaymentWebhookService {

    private final List<ExternalPaymentGateway>        gateways;
    private final InboundWebhookEventJpaRepository    webhookEventRepository;
    private final WebhookIdempotencyService           idempotencyService;
    private final PaymentStateMachineService          stateMachineService;
    private final ObjectMapper                        objectMapper;

    /**
     * Entry point called by PaymentWebhookController with raw bytes and header values.
     *
     * @param provider        path variable, e.g. "paymongo", "paynamics", "maya" (case-insensitive)
     * @param rawBodyBytes    verbatim HTTP request body — used for HMAC before deserialization
     * @param signatureHeader the provider-specific signature header value (may be null for providers that do not sign)
     */
    public void handle(String provider, byte[] rawBodyBytes, String signatureHeader) {
        String providerUpper = provider.toUpperCase();
        String rawBody = new String(rawBodyBytes, StandardCharsets.UTF_8);

        log.info("[WEBHOOK-SVC] Inbound webhook from provider: {}", providerUpper);

        // ----------------------------------------------------------------
        // Step 1 — Resolve gateway
        // ----------------------------------------------------------------
        ExternalPaymentGateway gateway = gateways.stream()
                .filter(g -> g.getProvider().name().equalsIgnoreCase(providerUpper))
                .findFirst()
                .orElseThrow(() -> {
                    log.error("[WEBHOOK-SVC] No registered gateway for provider: {}", providerUpper);
                    return new BusinessException(ErrorCode.INVALID_REQUEST,
                            "Unknown payment provider: " + provider);
                });

        // ----------------------------------------------------------------
        // Step 2 — HMAC signature verification (before ANY parsing)
        // ----------------------------------------------------------------
        boolean signatureValid = gateway.verifyWebhookSignature(rawBody, signatureHeader);
        if (!signatureValid) {
            log.error("[WEBHOOK-SVC] SECURITY REJECTION: Signature verification failed for provider {}. " +
                      "Webhook will not be processed.", providerUpper);
            throw new BusinessException(ErrorCode.UNAUTHORIZED,
                    "Webhook signature verification failed for provider: " + provider);
        }
        log.info("[WEBHOOK-SVC] Signature verified for provider {}.", providerUpper);

        // ----------------------------------------------------------------
        // Step 3 — Parse JSON (only after verification)
        // ----------------------------------------------------------------
        JsonNode root;
        try {
            root = objectMapper.readTree(rawBody);
        } catch (Exception e) {
            log.error("[WEBHOOK-SVC] Failed to parse webhook JSON from provider {}: {}", providerUpper, e.getMessage());
            throw new BusinessException(ErrorCode.INVALID_REQUEST, "Malformed webhook JSON from provider: " + provider);
        }

        // ----------------------------------------------------------------
        // Step 4 — Extract event ID and type (provider-specific field names)
        // ----------------------------------------------------------------
        String externalEventId  = extractEventId(root, providerUpper);
        String eventType        = extractEventType(root, providerUpper);
        String providerReference = extractProviderReference(root, providerUpper);

        log.info("[WEBHOOK-SVC] Parsed — eventId: {}, type: {}, ref: {}",
                 externalEventId, eventType, providerReference);

        // ----------------------------------------------------------------
        // Step 5 — Idempotency guard
        // ----------------------------------------------------------------
        if (webhookEventRepository.existsByProviderAndExternalEventId(providerUpper, externalEventId)) {
            log.warn("[WEBHOOK-SVC] DUPLICATE: Event {}/{} already processed. Returning 200 silently.",
                     providerUpper, externalEventId);
            // Return silently — PayMongo and others expect 2xx even for duplicates.
            // Throwing here would cause the provider to retry, making the problem worse.
            return;
        }

        // ----------------------------------------------------------------
        // Step 6 — Normalize status from event type / payload
        // ----------------------------------------------------------------
        String normalizedStatus = normalizeEventToStatus(eventType, root, providerUpper);
        log.info("[WEBHOOK-SVC] Normalized status for event {} → {}", eventType, normalizedStatus);

        java.math.BigDecimal webhookAmount = extractAmount(root, providerUpper);
        String webhookCurrency = extractCurrency(root, providerUpper);

        // ----------------------------------------------------------------
        // Step 7 — Persist InboundWebhookEvent (idempotency record as VERIFIED)
        // ----------------------------------------------------------------
        InboundWebhookEvent record = InboundWebhookEvent.builder()
                .provider(providerUpper)
                .externalEventId(externalEventId)
                .eventType(eventType)
                .rawPayload(rawBody)
                .signatureHeader(signatureHeader)
                .verified(true)
                .providerReference(providerReference)
                .normalizedStatus(normalizedStatus)
                .processingStatus("VERIFIED")
                .build();

        record = idempotencyService.tryRegisterEvent(record);
        if (record == null) {
            log.warn("[WEBHOOK-SVC] Race condition mitigated: Webhook event {}/{} was inserted by a concurrent thread.",
                    providerUpper, externalEventId);
            return;
        }
        log.info("[WEBHOOK-SVC] Persisted InboundWebhookEvent for {}/{} as VERIFIED.", providerUpper, externalEventId);

        // ----------------------------------------------------------------
        // Step 8 — Delegate to existing state machine
        // ----------------------------------------------------------------
        if (providerReference != null && !providerReference.isBlank()
                && normalizedStatus != null && !normalizedStatus.isBlank()) {

            log.info("[WEBHOOK-SVC] Delegating to PaymentStateMachineService: ref={} status={}",
                     providerReference, normalizedStatus);

            try {
                record.setProcessingStatus("PROCESSING");
                webhookEventRepository.save(record);
                
                stateMachineService.processAttemptOutcome(providerReference, normalizedStatus, webhookAmount, webhookCurrency, rawBody);
                
                record.setProcessingStatus("PROCESSED");
                record.setProcessedAt(LocalDateTime.now());
                webhookEventRepository.save(record);
            } catch (Exception e) {
                log.error("[WEBHOOK-SVC] State machine processing failed for event {}: {}", externalEventId, e.getMessage(), e);
                record.setProcessingStatus("FAILED");
                record.setFailureReason(e.getMessage());
                webhookEventRepository.save(record);
                throw e; // Rethrow so the controller returns 500 and the provider retries
            }

        } else {
            log.warn("[WEBHOOK-SVC] Skipping state machine — could not extract providerReference or " +
                     "normalizedStatus from {} event {}.", providerUpper, externalEventId);
            record.setProcessingStatus("REQUIRES_REVIEW");
            record.setFailureReason("Missing provider reference or status");
            webhookEventRepository.save(record);
        }
    }

    // ----------------------------------------------------------------
    // Provider-specific field extraction helpers
    // ----------------------------------------------------------------

    /**
     * Extracts the stable, unique event ID from the payload.
     * PayMongo:   data.id  (the event resource ID)
     * Paynamics:  id | transaction_id | reference
     */
    private String extractEventId(JsonNode root, String provider) {
        if ("INTERNAL".equals(provider)) {
            JsonNode dataId = root.path("data").path("id");
            if (!dataId.isMissingNode()) return dataId.asText();
        }
        // Fallback chain for other providers
        for (String field : new String[]{"id", "event_id", "transaction_id", "reference"}) {
            JsonNode node = root.path(field);
            if (!node.isMissingNode() && node.isTextual()) return node.asText();
        }
        // Last resort: generate a synthetic ID (degrades idempotency — warn loudly)
        String synthetic = provider + "-NOID-" + System.currentTimeMillis();
        log.warn("[WEBHOOK-SVC] Could not find event ID in payload from {}. " +
                 "Using synthetic: {}. Idempotency may be degraded.", provider, synthetic);
        return synthetic;
    }

    /**
     * Extracts the event type/name.
     * PayMongo:   data.attributes.type  (e.g. "checkout_session.payment.paid")
     * Paynamics:  event_type | type | status
     */
    private String extractEventType(JsonNode root, String provider) {
        if ("INTERNAL".equals(provider)) {
            JsonNode type = root.path("data").path("attributes").path("type");
            if (!type.isMissingNode()) return type.asText();
        }
        for (String field : new String[]{"type", "event_type", "event", "status"}) {
            JsonNode node = root.path(field);
            if (!node.isMissingNode() && node.isTextual()) return node.asText();
        }
        return "UNKNOWN";
    }

    /**
     * Extracts the provider's reference for the payment transaction.
     * PayMongo Checkout Session:  data.id (the checkout_session ID stored as providerReference)
     * PayMongo Payment event:     data.attributes.data.id
     * Paynamics:                  reference | transaction_id | id
     */
    private String extractProviderReference(JsonNode root, String provider) {
        if ("INTERNAL".equals(provider)) {
            JsonNode innerDataId = root.path("data").path("attributes").path("data").path("id");
            if (!innerDataId.isMissingNode() && innerDataId.isTextual()) {
                return innerDataId.asText();
            }
            JsonNode dataId = root.path("data").path("id");
            if (!dataId.isMissingNode() && dataId.isTextual()) return dataId.asText();
        }
        for (String field : new String[]{"reference", "id", "transaction_id", "checkout_session_id"}) {
            JsonNode node = root.path(field);
            if (!node.isMissingNode() && node.isTextual()) return node.asText();
        }
        return null;
    }

    /**
     * Converts a provider event type string into one of the canonical status values
     * that PaymentStateMachineService.processAttemptOutcome() understands:
     * SUCCESS | FAILED | CANCELLED | PROCESSING
     */
    private String normalizeEventToStatus(String eventType, JsonNode root, String provider) {
        if (eventType == null) return "PROCESSING";

        String upper = eventType.toUpperCase();

        // PayMongo event types
        if (upper.contains("PAYMENT.PAID")
                || upper.contains("PAYMENT_PAID")
                || upper.contains("SUCCEEDED")
                || upper.contains("SUCCESS")
                || upper.contains("PAID")
                || upper.contains("COMPLETED")) {
            return "SUCCESS";
        }
        if (upper.contains("FAIL") || upper.contains("DECLINED") || upper.contains("REJECTED")) {
            return "FAILED";
        }
        if (upper.contains("CANCEL") || upper.contains("VOID") || upper.contains("EXPIRED")) {
            return "CANCELLED";
        }

        // Fallback: check for a "status" field in the payload itself
        JsonNode statusNode = root.path("data").path("attributes").path("status");
        if (statusNode.isMissingNode()) statusNode = root.path("status");
        if (!statusNode.isMissingNode() && statusNode.isTextual()) {
            return normalizeEventToStatus(statusNode.asText(), root, provider);
        }

        return "PROCESSING";
    }

    private java.math.BigDecimal extractAmount(JsonNode root, String provider) {
        try {
            if ("INTERNAL".equals(provider)) {
                JsonNode amountNode = root.path("data").path("attributes").path("data").path("attributes").path("amount");
                if (amountNode.isMissingNode()) {
                    amountNode = root.path("data").path("attributes").path("amount");
                }
                if (!amountNode.isMissingNode() && amountNode.isNumber()) {
                    // PayMongo returns amount in centavos
                    return new java.math.BigDecimal(amountNode.asText()).divide(new java.math.BigDecimal("100"));
                }
            }
            // Add other provider extractors here
            return null;
        } catch (Exception e) {
            log.warn("[WEBHOOK-SVC] Failed to extract amount from payload: {}", e.getMessage());
            return null;
        }
    }

    private String extractCurrency(JsonNode root, String provider) {
        try {
            if ("INTERNAL".equals(provider)) {
                JsonNode currNode = root.path("data").path("attributes").path("data").path("attributes").path("currency");
                if (currNode.isMissingNode()) {
                    currNode = root.path("data").path("attributes").path("currency");
                }
                if (!currNode.isMissingNode() && currNode.isTextual()) {
                    return currNode.asText().toUpperCase();
                }
            }
            return null;
        } catch (Exception e) {
            log.warn("[WEBHOOK-SVC] Failed to extract currency from payload: {}", e.getMessage());
            return null;
        }
    }
}
