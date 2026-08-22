package com.company.banking.payment.api;

import com.company.banking.common.exception.ForbiddenException;
import com.company.banking.common.response.ApiResponse;
import com.company.banking.payment.api.dto.CheckoutSessionRequest;
import com.company.banking.payment.api.dto.CheckoutSessionResponse;
import com.company.banking.payment.api.dto.PublicCheckoutSessionResponse;
import com.company.banking.payment.application.CheckoutSessionService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import com.company.banking.payment.api.dto.SelectPaymentMethodRequest;
import com.company.banking.payment.application.CheckoutPaymentMethodService;

import com.company.banking.payment.api.dto.AuthorizeCheckoutRequest;
import com.company.banking.payment.application.InternalAccountAuthorizationService;

import com.company.banking.payment.application.CheckoutPaymentConfirmationService;

@RestController
@RequestMapping("/api/v1/checkout/sessions")
@RequiredArgsConstructor
public class CheckoutSessionController {

    private final CheckoutSessionService sessionService;
    private final CheckoutPaymentMethodService paymentMethodService;
    private final InternalAccountAuthorizationService authorizationService;
    private final CheckoutPaymentConfirmationService confirmationService;

    @PostMapping
    public ResponseEntity<ApiResponse<CheckoutSessionResponse>> createSession(
            Authentication authentication,
            @RequestHeader("Idempotency-Key") String idempotencyKey,
            @Valid @RequestBody CheckoutSessionRequest request) {

        Long merchantId = resolveMerchantStrictly(authentication);
        CheckoutSessionResponse response = sessionService.createSession(merchantId, idempotencyKey, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.success("Session created", response));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<PublicCheckoutSessionResponse>> getPublicSession(@PathVariable("id") String publicToken) {
        PublicCheckoutSessionResponse response = sessionService.getPublicSessionState(publicToken);
        return ResponseEntity.ok(ApiResponse.success("Session retrieved", response));
    }

    // Customer API: Public selection of funding source
    @PostMapping("/{id}/payment-method")
    public ResponseEntity<ApiResponse<CheckoutSessionResponse>> selectPaymentMethod(
            @PathVariable("id") String publicToken,
            @Valid @RequestBody SelectPaymentMethodRequest request) {
        
        CheckoutSessionResponse response = paymentMethodService.selectPaymentMethod(publicToken, request);
        return ResponseEntity.ok(ApiResponse.success("Payment method selected", response));
    }

    // Customer API: Authorize Payment
    @PostMapping("/{id}/authorize")
    public ResponseEntity<ApiResponse<CheckoutSessionResponse>> authorizeSession(
            @PathVariable("id") String publicToken,
            @Valid @RequestBody AuthorizeCheckoutRequest request) {

        CheckoutSessionResponse response = authorizationService.authorizeInternalAccount(publicToken, request.getCustomerAccountNumber());
        return ResponseEntity.ok(ApiResponse.success("Payment authorized successfully", response));
    }

    // Customer API: Confirm and Capture
    @PostMapping("/{id}/confirm")
    public ResponseEntity<ApiResponse<CheckoutSessionResponse>> confirmSession(@PathVariable("id") String publicToken) {
        // Derives CheckoutSession -> PaymentIntent -> PaymentAuthorization entirely server-side
        CheckoutSessionResponse response = confirmationService.confirmCheckout(publicToken);
        return ResponseEntity.ok(ApiResponse.success("Checkout confirmed successfully", response));
    }

    private Long resolveMerchantStrictly(Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new ForbiddenException("Unauthenticated request blocked at controller boundary.");
        }
        try {
            return Long.parseLong(authentication.getPrincipal().toString()); 
        } catch (Exception e) {
            throw new ForbiddenException("Invalid merchant identity resolution.");
        }
    }
}
