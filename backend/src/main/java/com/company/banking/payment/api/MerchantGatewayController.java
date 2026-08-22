package com.company.banking.payment.api;

import com.company.banking.apigateway.security.ApiKeyAuthenticationToken;
import com.company.banking.common.exception.ForbiddenException;
import com.company.banking.common.response.ApiResponse;
import com.company.banking.payment.api.dto.CheckoutSessionRequest;
import com.company.banking.payment.api.dto.CheckoutSessionResponse;
import com.company.banking.payment.api.dto.merchant.MerchantCheckoutRequest;
import com.company.banking.payment.api.dto.merchant.MerchantPaymentResponse;
import com.company.banking.payment.api.dto.merchant.MerchantRefundRequest;
import com.company.banking.payment.application.CheckoutSessionService;
import com.company.banking.payment.application.InternalPaymentExecutionService;
import com.company.banking.payment.application.PaymentIntentOrchestrationService;
import com.company.banking.payment.domain.PaymentIntent;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import com.company.banking.payment.api.dto.LineItemDto;
import com.company.banking.payment.domain.Refund;

import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1/gateway")
@RequiredArgsConstructor
@Slf4j
public class MerchantGatewayController {

    private final CheckoutSessionService checkoutSessionService;
    private final PaymentIntentOrchestrationService paymentIntentService;
    private final InternalPaymentExecutionService executionService;

    // -------------------------------------------------------------------------
    // 1. CREATE CHECKOUT SESSION
    // -------------------------------------------------------------------------
    @PostMapping("/checkout/sessions")
    public ResponseEntity<ApiResponse<CheckoutSessionResponse>> createCheckoutSession(
            Authentication authentication,
            @RequestHeader("Idempotency-Key") String idempotencyKey,
            @Valid @RequestBody MerchantCheckoutRequest request) {

        ApiKeyAuthenticationToken apiToken = validateAndExtractApiToken(authentication);
        Long merchantId = (Long) apiToken.getPrincipal();

        log.info("[MERCHANT API] Creating checkout session for Merchant {} (Env: {})", merchantId, apiToken.getEnvironment());

        // Map the public strict DTO to the internal Domain DTO
        CheckoutSessionRequest internalRequest = mapToInternalCheckoutRequest(request);

        // Delegate to the Phase 6A/6B engine
        CheckoutSessionResponse response = checkoutSessionService.createSession(merchantId, idempotencyKey, internalRequest);

        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.success("Checkout Session Created", response));
    }

    // -------------------------------------------------------------------------
    // 2. RETRIEVE PAYMENT INTENT
    // -------------------------------------------------------------------------
    @GetMapping("/payments/{intentId}")
    public ResponseEntity<ApiResponse<MerchantPaymentResponse>> getPaymentIntent(
            Authentication authentication,
            @PathVariable("intentId") String intentId) {

        ApiKeyAuthenticationToken apiToken = validateAndExtractApiToken(authentication);
        Long merchantId = (Long) apiToken.getPrincipal();

        // The service already enforces that Merchant A cannot access Merchant B's intent
        PaymentIntent intent = paymentIntentService.getPaymentIntent(intentId, merchantId);

        MerchantPaymentResponse response = mapToPublicPaymentResponse(intent, apiToken.getEnvironment());
        return ResponseEntity.ok(ApiResponse.success("Payment Retrieved", response));
    }

    // -------------------------------------------------------------------------
    // 3. REFUND PAYMENT INTENT
    // -------------------------------------------------------------------------
    @PostMapping("/payments/{intentId}/refund")
    public ResponseEntity<ApiResponse<MerchantPaymentResponse>> refundPayment(
            Authentication authentication,
            @RequestHeader("Idempotency-Key") String idempotencyKey,
            @PathVariable("intentId") String intentId,
            @Valid @RequestBody MerchantRefundRequest request) {

        ApiKeyAuthenticationToken apiToken = validateAndExtractApiToken(authentication);
        Long merchantId = (Long) apiToken.getPrincipal();

        log.info("[MERCHANT API] Processing Refund for Intent {} by Merchant {}", intentId, merchantId);

        // Delegate to the Phase 4 Engine. This is fully transactional and produces the Outbox event!
        Refund refund = executionService.refundPayment(
                intentId,
                merchantId,
                idempotencyKey,
                request.getAmount(),
                request.getReason()
        );

        PaymentIntent refundedIntent = paymentIntentService.getPaymentIntent(intentId, merchantId);

        MerchantPaymentResponse response = mapToPublicPaymentResponse(refundedIntent, apiToken.getEnvironment());
        return ResponseEntity.ok(ApiResponse.success("Refund Processed", response));
    }

    // -------------------------------------------------------------------------
    // SECURITY & MAPPING UTILITIES
    // -------------------------------------------------------------------------

    private ApiKeyAuthenticationToken validateAndExtractApiToken(Authentication authentication) {
        if (!(authentication instanceof ApiKeyAuthenticationToken)) {
            throw new ForbiddenException("Invalid authentication type for Gateway API.");
        }
        return (ApiKeyAuthenticationToken) authentication;
    }

    private CheckoutSessionRequest mapToInternalCheckoutRequest(MerchantCheckoutRequest req) {
        CheckoutSessionRequest internalReq = new CheckoutSessionRequest();
        internalReq.setReference(req.getReference());
        internalReq.setCurrency(req.getCurrency());
        internalReq.setSuccessUrl(req.getSuccessUrl());
        internalReq.setCancelUrl(req.getCancelUrl());
        
        if (req.getLineItems() != null) {
            internalReq.setLineItems(req.getLineItems().stream().map(li -> {
                LineItemDto internalLi = new LineItemDto();
                internalLi.setName(li.getName());
                internalLi.setQuantity(li.getQuantity());
                internalLi.setUnitAmount(li.getUnitAmount());
                return internalLi;
            }).collect(Collectors.toList()));
        }
        return internalReq;
    }

    private MerchantPaymentResponse mapToPublicPaymentResponse(PaymentIntent intent, String environment) {
        return MerchantPaymentResponse.builder()
                .id(intent.getIntentId())
                .status(intent.getStatus().name())
                .amount(intent.getAmount())
                .currency(intent.getCurrency())
                .reference(intent.getDescription()) // Safely mapping the description to the original reference
                .environment(environment)
                .createdAt(intent.getCreatedAt())
                .updatedAt(intent.getUpdatedAt() != null ? intent.getUpdatedAt() : intent.getCreatedAt())
                .build();
    }
}
