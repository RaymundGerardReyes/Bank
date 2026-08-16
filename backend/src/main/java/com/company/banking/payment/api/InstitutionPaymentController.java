package com.company.banking.payment.api;

import com.company.banking.common.response.ApiResponse;
import com.company.banking.payment.api.dto.CreatePaymentSessionRequest;
import com.company.banking.payment.api.dto.PaymentSessionApiResponse;
import com.company.banking.payment.application.InstitutionPaymentService;
import com.company.banking.web.filter.CorrelationIdFilter;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.slf4j.MDC;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/institutions")
@RequiredArgsConstructor
public class InstitutionPaymentController {

    private final InstitutionPaymentService sessionService;

    @PostMapping("/{institutionId}/payment-sessions")
    public ResponseEntity<ApiResponse<PaymentSessionApiResponse>> createPaymentSession(
            @PathVariable Long institutionId,
            @Valid @RequestBody CreatePaymentSessionRequest request) {
        
        String correlationId = MDC.get(CorrelationIdFilter.MDC_KEY);
        PaymentSessionApiResponse response = sessionService.createSession(institutionId, request);
        return ResponseEntity.ok(ApiResponse.success(response, "Payment session created", correlationId));
    }

    @GetMapping("/{institutionId}/payment-sessions/{sessionId}")
    public ResponseEntity<ApiResponse<PaymentSessionApiResponse>> getPaymentSession(
            @PathVariable Long institutionId,
            @PathVariable String sessionId) {
        
        String correlationId = MDC.get(CorrelationIdFilter.MDC_KEY);
        PaymentSessionApiResponse response = sessionService.getSession(institutionId, sessionId);
        return ResponseEntity.ok(ApiResponse.success(response, "Payment session retrieved", correlationId));
    }

    @PostMapping("/{institutionId}/payment-sessions/{sessionId}/cancel")
    public ResponseEntity<ApiResponse<PaymentSessionApiResponse>> cancelPaymentSession(
            @PathVariable Long institutionId,
            @PathVariable String sessionId) {
        
        String correlationId = MDC.get(CorrelationIdFilter.MDC_KEY);
        PaymentSessionApiResponse response = sessionService.cancelSession(institutionId, sessionId);
        return ResponseEntity.ok(ApiResponse.success(response, "Payment session cancelled", correlationId));
    }
}