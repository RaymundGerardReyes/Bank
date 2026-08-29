package com.company.banking.payment.api;

import com.company.banking.common.response.ApiResponse;
import com.company.banking.payment.api.dto.CreatePaymentIntentRequest;
import com.company.banking.payment.api.dto.PaymentSessionResponse;
import com.company.banking.payment.application.PaymentIntentOrchestrationService;
import com.company.banking.payment.domain.PaymentIntent;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/payment-intents")
@RequiredArgsConstructor
public class PaymentIntentController {

    private final PaymentIntentOrchestrationService orchestrationService;

    @PostMapping
    public ResponseEntity<ApiResponse<PaymentSessionResponse>> createPaymentIntent(@RequestBody CreatePaymentIntentRequest request) {
        return ResponseEntity.status(org.springframework.http.HttpStatus.METHOD_NOT_ALLOWED)
                .body(ApiResponse.error("This endpoint is deprecated. Use /api/v1/gateway/payments/intents instead."));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<PaymentIntent>> getPaymentIntent(@PathVariable String id) {
        PaymentIntent intent = orchestrationService.getIntent(id);
        return ResponseEntity.ok(ApiResponse.success(intent, "Payment intent retrieved", null));
    }

    @PostMapping("/{id}/cancel")
    public ResponseEntity<ApiResponse<Void>> cancelPaymentIntent(@PathVariable String id) {
        orchestrationService.cancelIntent(id);
        return ResponseEntity.ok(ApiResponse.success(null, "Payment intent cancelled", null));
    }
}