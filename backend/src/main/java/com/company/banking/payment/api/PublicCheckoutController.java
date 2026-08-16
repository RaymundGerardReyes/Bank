package com.company.banking.payment.api;

import com.company.banking.common.response.ApiResponse;
import com.company.banking.payment.api.dto.InitiatePaymentRequest;
import com.company.banking.payment.api.dto.InitiatePaymentResponse;
import com.company.banking.payment.api.dto.PaymentReceiptData;
import com.company.banking.payment.api.dto.SessionValidationResponse;
import com.company.banking.payment.application.PublicCheckoutService;
import com.company.banking.payment.domain.exception.PaymentRequiredException;
import com.company.banking.web.filter.CorrelationIdFilter;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.slf4j.MDC;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/payment-sessions")
@RequiredArgsConstructor
public class PublicCheckoutController {

    private final PublicCheckoutService publicCheckoutService;

    @GetMapping("/{sessionId}/validate")
    public ResponseEntity<ApiResponse<SessionValidationResponse>> validateSession(@PathVariable String sessionId) {
        String correlationId = MDC.get(CorrelationIdFilter.MDC_KEY);
        SessionValidationResponse response = publicCheckoutService.validateSession(sessionId);
        return ResponseEntity.ok(ApiResponse.success(response, "Session validated", correlationId));
    }

    @PostMapping("/{sessionId}/initiate")
    public ResponseEntity<ApiResponse<InitiatePaymentResponse>> initiatePayment(
            @PathVariable String sessionId,
            @Valid @RequestBody InitiatePaymentRequest request) {
        String correlationId = MDC.get(CorrelationIdFilter.MDC_KEY);
        InitiatePaymentResponse response = publicCheckoutService.initiatePayment(sessionId, request);
        return ResponseEntity.ok(ApiResponse.success(response, "Payment initiated successfully", correlationId));
    }

    // --- NEW PHASE F ENDPOINT ---
    @GetMapping("/{sessionId}/receipt")
    public ResponseEntity<?> getReceipt(@PathVariable String sessionId) {
        String correlationId = MDC.get(CorrelationIdFilter.MDC_KEY);
        
        try {
            PaymentReceiptData receipt = publicCheckoutService.getReceipt(sessionId);
            return ResponseEntity.ok(ApiResponse.success(receipt, "Official receipt generated successfully", correlationId));
            
        } catch (PaymentRequiredException ex) {
            // Strict enforcement mapping directly to HTTP 402 Payment Required
            return ResponseEntity.status(HttpStatus.PAYMENT_REQUIRED)
                    .body(ApiResponse.error("402 Payment Required: " + ex.getMessage(), correlationId));
        }
    }
}