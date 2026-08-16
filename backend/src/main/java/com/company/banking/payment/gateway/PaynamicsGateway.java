package com.company.banking.payment.gateway;

import com.company.banking.payment.domain.PaymentChannel;
import com.company.banking.payment.domain.PaymentIntentStatus;
import com.company.banking.payment.domain.PaymentProvider;
import com.company.banking.payment.gateway.dto.ExternalCheckoutRequest;
import com.company.banking.payment.gateway.dto.GatewayPaymentStatus;
import com.company.banking.payment.gateway.dto.PaymentSession;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.UUID;

@Component
@ConditionalOnProperty(name = "payment.provider", havingValue = "paynamics", matchIfMissing = true)
@RequiredArgsConstructor
@Slf4j
public class PaynamicsGateway implements ExternalPaymentGateway {

    private final PaynamicsCheckoutProperties properties;

    @Override
    public PaymentSession createCheckout(ExternalCheckoutRequest request) {
        log.info("[PAYNAMICS] Initiating hosted checkout session for Intent: {}", request.getPaymentIntentId());
        
        // Mock generation of a secure provider session reference
        String providerReference = "paynamics_sess_" + UUID.randomUUID().toString().replace("-", "");
        
        // Fallback to sandbox if not explicitly defined in environment config
        String checkoutBaseUrl = properties.getCheckoutBaseUrl() != null 
            ? properties.getCheckoutBaseUrl() 
            : "https://sandbox.paynamics.com/checkout";
            
        String checkoutUrl = checkoutBaseUrl + "?session=" + providerReference;

        log.info("[PAYNAMICS] Checkout session successfully generated. Redirect URL: {}", checkoutUrl);

        return PaymentSession.builder()
                .providerReference(providerReference)
                .checkoutUrl(checkoutUrl)
                .expiresAt(LocalDateTime.now().plusMinutes(15))
                .provider(PaymentProvider.PAYNAMICS)
                .channel(PaymentChannel.HOSTED_CHECKOUT)
                .build();
    }

    @Override
    public GatewayPaymentStatus getStatus(String providerReference) {
        log.info("[PAYNAMICS] Fetching external real-time status for provider reference: {}", providerReference);
        
        // Stub implementation: returns PROCESSING
        return GatewayPaymentStatus.PROCESSING;
    }

    @Override
    public boolean verifyWebhookSignature(String rawPayload, String signature) {
        log.info("[PAYNAMICS] Executing HMAC-SHA256 signature verification on inbound webhook...");
        
        if (properties.getWebhookSecret() == null || signature == null) {
            log.warn("[PAYNAMICS] Signature verification failed: Missing secret or signature header.");
            return false;
        }
        
        // STUB: Always returning true for Phase 3 integration testing.
        // In production: compare HMAC-SHA256(rawPayload, properties.getWebhookSecret()) == signature
        return true; 
    }

    @Override
    public PaymentProvider getProvider() {
        return PaymentProvider.PAYNAMICS;
    }
}