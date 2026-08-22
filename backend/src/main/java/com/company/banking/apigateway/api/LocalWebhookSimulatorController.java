package com.company.banking.apigateway.api;

import com.company.banking.common.response.ApiResponse;
import com.company.banking.payment.application.PaymentWebhookService;
import com.company.banking.payment.domain.InboundWebhookEvent;
import com.company.banking.payment.infrastructure.InboundWebhookEventJpaRepository;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.slf4j.MDC;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.util.HexFormat;
import java.util.Optional;

@RestController
@RequestMapping("/api/v1/webhooks/simulate")
@RequiredArgsConstructor
@Slf4j
public class LocalWebhookSimulatorController {

    private final PaymentWebhookService webhookService;
    private final InboundWebhookEventJpaRepository webhookRepository;

    @org.springframework.beans.factory.annotation.Value("${payment.paymongo.webhook-secret:whsec_test_secret_123456789}")
    private String webhookSecret;

    @PostMapping
    public ResponseEntity<ApiResponse<SimulationResult>> simulateWebhook(
            @RequestHeader(value = "X-Client-Id", required = false) String clientId,
            @RequestBody SimulationRequest request) {

        log.info("[WEBHOOK-SIMULATOR] Starting local webhook simulation for scenario: {}", request.getScenario());

        long startTime = System.currentTimeMillis();
        String timestamp = String.valueOf(Instant.now().getEpochSecond());

        if ("OLD_TIMESTAMP".equals(request.getScenario())) {
            timestamp = String.valueOf(Instant.now().minusSeconds(86400).getEpochSecond());
        }

        boolean isLiveMode = "WRONG_ENVIRONMENT".equals(request.getScenario());
        String eventType = request.getEventType();
        String eventId = request.getEventId();
        String reference = request.getReference();

        // 1. Generate fake PayMongo JSON body
        String rawBody = String.format("""
                {
                  "data": {
                    "id": "%s",
                    "type": "event",
                    "attributes": {
                      "type": "%s",
                      "livemode": %b,
                      "data": {
                        "id": "%s",
                        "type": "payment",
                        "attributes": {
                          "amount": 10000,
                          "currency": "PHP",
                          "status": "paid",
                          "description": "Simulation Payment"
                        }
                      }
                    }
                  }
                }""", eventId, eventType, isLiveMode, reference);

        if ("MALFORMED_JSON".equals(request.getScenario())) {
            rawBody = "{ \"data\": { \"id\": \"" + eventId + "\" "; // intentionally broken
        }

        // 2. Generate signature
        String activeSecret = (this.webhookSecret != null && !this.webhookSecret.isBlank()) 
                ? this.webhookSecret : "test_secret_for_simulation_only";

        String signedPayload = timestamp + "." + rawBody;
        String hmac = computeHmacSha256(signedPayload, activeSecret);

        if ("INVALID_SIGNATURE".equals(request.getScenario())) {
            hmac = "invalid_hmac_hash_12345";
        }

        // Paymongo-Signature format: t=<timestamp>,te=<test_hmac>,li=<live_hmac>
        String signatureHeader = String.format("t=%s,te=%s,li=%s", timestamp, hmac, hmac);

        SimulationResult result = new SimulationResult();
        result.setScenario(request.getScenario());
        result.setRawBody(rawBody);
        result.setSignatureHeader(signatureHeader);

        // 3. Dispatch to PaymentWebhookService
        boolean exceptionThrown = false;
        try {
            webhookService.handle("paymongo", rawBody.getBytes(StandardCharsets.UTF_8), signatureHeader);
        } catch (Exception e) {
            log.warn("[WEBHOOK-SIMULATOR] Exception thrown by webhook service: {}", e.getMessage());
            result.setExceptionMessage(e.getMessage());
            exceptionThrown = true;
        }

        long duration = System.currentTimeMillis() - startTime;
        result.setDurationMs(duration);
        result.setAccepted(!exceptionThrown);

        // 4. Fetch the final state from the database
        Optional<InboundWebhookEvent> eventOpt = webhookRepository.findByProviderAndExternalEventId("PAYMONGO", eventId);
        if (eventOpt.isPresent()) {
            InboundWebhookEvent dbEvent = eventOpt.get();
            result.setProcessingStatus(dbEvent.getProcessingStatus());
            result.setNormalizedStatus(dbEvent.getNormalizedStatus());
            result.setFailureReason(dbEvent.getFailureReason());
            result.setVerified(dbEvent.isVerified());
        } else {
            result.setProcessingStatus(exceptionThrown ? "REJECTED" : "NOT_FOUND");
        }

        return ResponseEntity.ok(ApiResponse.success(result, "Simulation completed", MDC.get("correlationId")));
    }

    private String computeHmacSha256(String data, String secret) {
        try {
            Mac mac = Mac.getInstance("HmacSHA256");
            SecretKeySpec keySpec = new SecretKeySpec(secret.getBytes(StandardCharsets.UTF_8), "HmacSHA256");
            mac.init(keySpec);
            byte[] rawHmac = mac.doFinal(data.getBytes(StandardCharsets.UTF_8));
            return HexFormat.of().formatHex(rawHmac);
        } catch (Exception e) {
            return "";
        }
    }
}

@Data
class SimulationRequest {
    private String eventType;
    private String eventId;
    private String reference;
    private String scenario; // e.g. VALID, INVALID_SIGNATURE, DUPLICATE, WRONG_ENVIRONMENT
}

@Data
class SimulationResult {
    private String scenario;
    private String rawBody;
    private String signatureHeader;
    private boolean accepted;
    private String exceptionMessage;
    private String processingStatus;
    private String normalizedStatus;
    private String failureReason;
    private boolean verified;
    private long durationMs;
}
