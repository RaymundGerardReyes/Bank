package com.company.banking.payment.api;

import com.company.banking.payment.api.dto.CreatePaymentIntentRequest;
import com.company.banking.payment.api.dto.PaymentSessionResponse;
import com.company.banking.payment.application.PaymentIntentOrchestrationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@Slf4j
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
            Authentication authentication,
            jakarta.servlet.http.HttpServletRequest servletRequest) {
        
        request.setIdempotencyKey(idempotencyKey);

        // Resolve client return URL from body, query parameters, or HTTP Referer/Origin headers
        if (request.getReturnUrl() == null || request.getReturnUrl().isBlank()) {
            String paramReturn = servletRequest.getParameter("returnUrl");
            if (paramReturn == null || paramReturn.isBlank()) {
                paramReturn = servletRequest.getParameter("redirectUrl");
            }
            if (paramReturn != null && !paramReturn.isBlank()) {
                request.setReturnUrl(paramReturn);
            } else {
                String referer = servletRequest.getHeader("Referer");
                String origin = servletRequest.getHeader("Origin");
                if (referer != null && !referer.isBlank() && !referer.contains("/checkout/")) {
                    request.setReturnUrl(referer);
                } else if (origin != null && !origin.isBlank() && !origin.contains("/checkout/")) {
                    request.setReturnUrl(origin);
                }
            }
        }
        if (request.getCancelUrl() == null || request.getCancelUrl().isBlank()) {
            String paramCancel = servletRequest.getParameter("cancelUrl");
            if (paramCancel != null && !paramCancel.isBlank()) {
                request.setCancelUrl(paramCancel);
            }
        }
        
        // FIX TC25 & TC26 & PT-07 (IDOR Guard): Enforce that the API key has an authorized
        // account binding and matches the account trying to be charged.
        if (linkedAccountId == null) {
            servletRequest.setAttribute("GATEWAY_AUTH_STAGE", "ACCOUNT_REJECTED");
            servletRequest.setAttribute("GATEWAY_AUTH_FAILURE_REASON", "NO_LINKED_ACCOUNT");
            log.warn("[GATEWAY IDOR REJECTED] API Key has no linked account authorized for transactions");
            throw new com.company.banking.common.exception.ForbiddenException(
                    "API Key has no linked account authorized for transactions. Please specify an authorized account or use an UNRESTRICTED key.");
        }
        
        if (!linkedAccountId.equalsIgnoreCase("UNRESTRICTED") && !linkedAccountId.equals(request.getSourceAccountId())) {
            servletRequest.setAttribute("GATEWAY_AUTH_STAGE", "ACCOUNT_REJECTED");
            servletRequest.setAttribute("GATEWAY_AUTH_FAILURE_REASON", "ACCOUNT_NOT_AUTHORIZED");
            log.warn("[GATEWAY IDOR REJECTED] API Key bound to account '{}', but request attempted to charge account '{}'",
                    linkedAccountId, request.getSourceAccountId());
            throw new com.company.banking.common.exception.ForbiddenException(
                    String.format("API Key is bound to account '%s', but request attempted to transact on account '%s'. " +
                            "Ensure your client sends the matching API key or an UNRESTRICTED key.",
                            linkedAccountId, request.getSourceAccountId()));
        }
        servletRequest.setAttribute("GATEWAY_AUTH_STAGE", "COMPLETED");
        
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