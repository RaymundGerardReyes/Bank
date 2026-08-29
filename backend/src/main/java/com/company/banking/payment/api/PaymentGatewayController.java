package com.company.banking.payment.api;

import com.company.banking.payment.api.dto.CreatePaymentIntentRequest;
import com.company.banking.payment.api.dto.PaymentSessionResponse;
import com.company.banking.payment.application.PaymentIntentOrchestrationService;
import jakarta.validation.Valid;
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
            @Valid @RequestBody CreatePaymentIntentRequest request,
            Authentication authentication) {
        
        // STRICT SECURITY: Ignore X-Client-Id header completely. Use authenticated principal.
        Long merchantId;
        Object principal = authentication.getPrincipal();
        if (principal instanceof Long) {
            merchantId = (Long) principal;
        } else if (principal instanceof com.company.banking.customer.domain.Customer) {
            merchantId = ((com.company.banking.customer.domain.Customer) principal).getId();
        } else {
            try {
                merchantId = Long.parseLong(authentication.getName());
            } catch (Exception e) {
                throw new com.company.banking.common.exception.BusinessException(com.company.banking.common.exception.ErrorCode.UNAUTHORIZED, "Unable to identify merchant context");
            }
        }
        
        request.setIdempotencyKey(idempotencyKey);
        
        if (authentication instanceof com.company.banking.apigateway.security.ApiKeyAuthenticationToken) {
            String linkedAccount = ((com.company.banking.apigateway.security.ApiKeyAuthenticationToken) authentication).getLinkedAccountId();
            if (linkedAccount != null && !linkedAccount.equals(request.getSourceAccountId())) {
                throw new com.company.banking.common.exception.ForbiddenException("Not authorized to access this account");
            }
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
}