package com.company.banking.payment.gateway;

import com.company.banking.payment.domain.PaymentProvider;
import com.company.banking.payment.gateway.dto.ExternalCheckoutRequest;
import com.company.banking.payment.gateway.dto.GatewayPaymentStatus;
import com.company.banking.payment.gateway.dto.PaymentSession;

/**
 * Provider-agnostic interface for external payment gateways.
 * This guarantees that the core orchestration and state machines never couple 
 * directly to a specific provider's API (e.g., Paynamics, Maya, PayMongo).
 */
public interface ExternalPaymentGateway {

    PaymentSession createCheckout(ExternalCheckoutRequest request);

    GatewayPaymentStatus getStatus(String providerReference);

    boolean verifyWebhookSignature(String rawPayload, String signature);

    PaymentProvider getProvider();
}