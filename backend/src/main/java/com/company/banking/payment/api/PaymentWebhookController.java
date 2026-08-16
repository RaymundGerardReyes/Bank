package com.company.banking.payment.api;

import com.company.banking.common.response.ApiResponse;
import com.company.banking.payment.application.PaymentStateMachineService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@Slf4j
@RestController
@RequestMapping("/api/v1/webhooks/payment")
@RequiredArgsConstructor
public class PaymentWebhookController {

    private final PaymentStateMachineService stateMachineService;

    /**
     * Universal webhook ingestion point for Paynamics, Maya, and PayMongo.
     */
    @PostMapping("/{provider}")
    public ResponseEntity<ApiResponse<Void>> handleProcessorWebhook(
            @PathVariable String provider,
            @RequestBody Map<String, Object> payload) {
        
        log.info("[WEBHOOK] Received payload from downstream processor: {}", provider);
        
        // Extract the provider reference mapping dynamically. 
        // Real-world implementations utilize specialized DTO parsers per provider.
        String providerReference = extractReference(payload, provider);
        String rawStatus = extractStatus(payload, provider);
        
        String normalizedStatus = normalizeProcessorStatus(rawStatus);

        if (providerReference != null && !providerReference.isBlank()) {
            stateMachineService.processAttemptOutcome(providerReference, normalizedStatus, payload.toString());
        } else {
            log.error("[WEBHOOK] Critical mapping failure: Could not extract provider reference from {} payload: {}", provider, payload);
            return ResponseEntity.badRequest().body(ApiResponse.error("Missing processor reference mapping"));
        }

        return ResponseEntity.ok(ApiResponse.success(null, "Webhook safely ingested by state machine"));
    }

    private String extractReference(Map<String, Object> payload, String provider) {
        if (payload.containsKey("reference")) return (String) payload.get("reference");
        if (payload.containsKey("id")) return (String) payload.get("id");
        if (payload.containsKey("transaction_id")) return (String) payload.get("transaction_id");
        return null;
    }

    private String extractStatus(Map<String, Object> payload, String provider) {
        if (payload.containsKey("status")) return (String) payload.get("status");
        if (payload.containsKey("payment_status")) return (String) payload.get("payment_status");
        return "PROCESSING";
    }

    private String normalizeProcessorStatus(String rawStatus) {
        if (rawStatus == null) return "PROCESSING";
        String upper = rawStatus.toUpperCase();
        
        if (upper.contains("SUCCESS") || upper.contains("PAID") || upper.contains("COMPLETED") || upper.equals("S")) {
            return "SUCCESS";
        }
        if (upper.contains("FAIL") || upper.contains("DECLINED") || upper.contains("REJECTED") || upper.equals("F")) {
            return "FAILED";
        }
        if (upper.contains("CANCEL") || upper.contains("VOID")) {
            return "CANCELLED";
        }
        return "PROCESSING";
    }
}