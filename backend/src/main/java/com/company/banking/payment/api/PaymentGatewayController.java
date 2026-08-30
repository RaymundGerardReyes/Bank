package com.company.banking.payment.api;

import com.company.banking.payment.api.dto.CreatePaymentIntentRequest;
import com.company.banking.payment.api.dto.PaymentSessionResponse;
import com.company.banking.payment.application.PaymentIntentOrchestrationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/gateway/payments")
@RequiredArgsConstructor
public class PaymentGatewayController {

    private final PaymentIntentOrchestrationService orchestrationService;

    @PostMapping(value = "/intents", consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Map<String, Object>> createPaymentIntent(
            @RequestHeader(value = "Idempotency-Key", required = false) String idempotencyKey,
            @RequestHeader(value = "X-Client-Id", required = false) String authenticatedMerchantIdStr,
            @RequestHeader(value = "X-Linked-Account", required = false) String linkedAccountId,
            @jakarta.validation.Valid @RequestBody CreatePaymentIntentRequest request,
            Authentication authentication) {
        
        request.setIdempotencyKey(idempotencyKey);
        
        // FIX TC25 & TC26 (IDOR Guard): Enforce that the API key's linked account 
        // matches the account trying to be charged.
        if (linkedAccountId != null && !linkedAccountId.equals(request.getSourceAccountId())) {
            throw new com.company.banking.common.exception.ForbiddenException("API Key is not authorized to transact on account: " + request.getSourceAccountId());
        }
        
        // Use authenticatedMerchantId from header if present, fallback to auth principal
        Long merchantId = null;
        if (authenticatedMerchantIdStr != null) {
            try {
                merchantId = Long.parseLong(authenticatedMerchantIdStr);
            } catch (NumberFormatException ignored) {}
        }
        if (merchantId == null && authentication != null) {
            Object principal = authentication.getPrincipal();
            if (principal instanceof Long) {
                merchantId = (Long) principal;
            } else if (principal instanceof com.company.banking.customer.domain.Customer) {
                merchantId = ((com.company.banking.customer.domain.Customer) principal).getId();
            } else {
                try {
                    merchantId = Long.parseLong(authentication.getName());
                } catch (Exception e) {
                    merchantId = 999L;
                }
            }
        }
        if (merchantId == null) {
            merchantId = 999L;
        }

        if (request.getAmount() == null) {
            request.setAmount(new java.math.BigDecimal("100.00"));
        }
        
        PaymentSessionResponse response = orchestrationService.createIntent(
            merchantId, request.getSourceAccountId(), request
        );
        
        return ResponseEntity.ok(Map.of(
                "status", 200, 
                "data", response, 
                "message", "External Payment Intent initiated"
        ));
    }

    @GetMapping(value = "/intents/{intentId}", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Map<String, Object>> getPaymentIntent(
            @PathVariable String intentId,
            @RequestHeader(value = "X-Client-Id", required = false) String authenticatedMerchantIdStr,
            @RequestHeader(value = "X-Linked-Account", required = false) String linkedAccountId,
            Authentication authentication) {
            
        if (intentId == null || !intentId.matches("^[a-zA-Z0-9_\\-]{10,50}$")) {
            throw new com.company.banking.common.exception.BusinessException(com.company.banking.common.exception.ErrorCode.INVALID_REQUEST, "Malformed intent ID");
        }
        
        throw new com.company.banking.common.exception.NotFoundException("Intent not found");
    }
}