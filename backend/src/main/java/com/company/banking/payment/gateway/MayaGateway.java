package com.company.banking.payment.gateway;

import com.company.banking.payment.domain.PaymentProvider;
import com.company.banking.payment.gateway.dto.ExternalCheckoutRequest;
import com.company.banking.payment.gateway.dto.GatewayPaymentStatus;
import com.company.banking.payment.gateway.dto.PaymentSession;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Component;

/**
 * Stub implementation for the Maya payment gateway.
 * Proves the provider-agnostic interface boundary holds firm without leaking Paynamics logic.
 */
@Component
@ConditionalOnProperty(name = "payment.provider", havingValue = "maya")
@Slf4j
public class MayaGateway implements ExternalPaymentGateway, PaymentWebhookVerifier {

    @Override
    public PaymentSession createCheckout(ExternalCheckoutRequest request) {
        log.error("[MAYA] createCheckout called on stub");
        throw new UnsupportedOperationException("TODO: Implement Maya Gateway createCheckout");
    }

    @Override
    public GatewayPaymentStatus getStatus(String providerReference) {
        log.error("[MAYA] getStatus called on stub");
        throw new UnsupportedOperationException("TODO: Implement Maya Gateway getStatus");
    }

    @Override
    public boolean verifyWebhookSignature(String rawPayload, String signature) {
        log.error("[MAYA] verifyWebhookSignature called on stub");
        throw new UnsupportedOperationException("TODO: Implement Maya Gateway verifyWebhookSignature");
    }

    @Override
    public PaymentProvider getProvider() {
        return PaymentProvider.MAYA;
    }
}