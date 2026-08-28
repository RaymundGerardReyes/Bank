package com.company.banking.payment.api;

import com.company.banking.common.response.ApiResponse;
import com.company.banking.payment.api.dto.CreatePaymentIntentRequest;
import com.company.banking.payment.api.dto.PaymentSessionResponse;
import com.company.banking.payment.application.PaymentIntentOrchestrationService;
import com.company.banking.payment.application.PaymentIntentService;
import com.company.banking.payment.domain.PaymentIntent;
import com.company.banking.web.filter.CorrelationIdFilter;
import org.slf4j.MDC;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import lombok.RequiredArgsConstructor;
import lombok.Data;
import java.math.BigDecimal;

@RestController
@RequestMapping("/api/v1/gateway/payments")
@RequiredArgsConstructor
public class PaymentGatewayController {

    private final PaymentIntentService paymentIntentService;
    private final PaymentIntentOrchestrationService orchestrationService;

    // Legacy endpoint
    @PostMapping
    public ResponseEntity<ApiResponse<PaymentIntent>> createPayment(
            @RequestHeader(value = "X-Client-Id", required = false) String clientId,
            @RequestHeader(value = "Idempotency-Key", required = false) String idempotencyKey,
            @RequestBody PaymentRequest request) {
        
        Long merchantId = extractMerchantId(clientId); 
        PaymentIntent intent = paymentIntentService.createIntent(merchantId, request.getCustomerAccountNumber(), request.getAmount(), request.getCurrency());
        
        return ResponseEntity.ok(ApiResponse.success(intent, "Payment Intent created", MDC.get(CorrelationIdFilter.MDC_KEY)));
    }

    // Legacy endpoint
    @PostMapping("/{intentId}/capture")
    public ResponseEntity<ApiResponse<PaymentIntent>> capturePayment(
            @PathVariable String intentId,
            @RequestHeader(value = "X-Client-Id", required = false) String clientId) {
        
        Long merchantId = extractMerchantId(clientId);
        PaymentIntent intent = paymentIntentService.captureIntent(intentId, merchantId);
        
        return ResponseEntity.ok(ApiResponse.success(intent, "Payment Intent captured", MDC.get(CorrelationIdFilter.MDC_KEY)));
    }

    // NEW ENDPOINT: Phase 4
    @PostMapping("/intents")
    public ResponseEntity<ApiResponse<PaymentSessionResponse>> createPaymentIntent(
            @RequestHeader(value = "X-Client-Id", required = false) String clientId,
            @RequestBody CreatePaymentIntentRequest request) {
            
        Long merchantId = extractMerchantId(clientId);
        PaymentSessionResponse response = orchestrationService.createAndInitiatePayment(merchantId, request);
        
        return ResponseEntity.ok(ApiResponse.success(response, "External Payment Intent initiated", MDC.get(CorrelationIdFilter.MDC_KEY)));
    }

    // NEW ENDPOINT: Phase 4
    @GetMapping("/intents/{intentId}")
    public ResponseEntity<ApiResponse<PaymentIntent>> getPaymentIntent(
            @PathVariable String intentId,
            @RequestHeader(value = "X-Client-Id", required = false) String clientId) {
        
        Long merchantId = extractMerchantId(clientId);
        PaymentIntent intent = orchestrationService.getPaymentIntent(intentId, merchantId);
        
        return ResponseEntity.ok(ApiResponse.success(intent, "Payment Intent retrieved", MDC.get(CorrelationIdFilter.MDC_KEY)));
    }

    private Long extractMerchantId(String clientId) {
        // Simplified mock extraction: assuming client_123 -> 123
        try {
            return Long.parseLong(clientId.replace("client_", ""));
        } catch (Exception e) {
            return 999L; // Default fallback merchant ID
        }
    }

    @Data
    public static class PaymentRequest {
        private String customerAccountNumber;
        private BigDecimal amount;
        private String currency;
    }
}