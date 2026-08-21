package com.company.banking.payment.gateway;

import com.company.banking.payment.domain.PaymentProvider;

/**
 * Separates the "inbound trust boundary" (receiving webhooks) from the 
 * "outbound trust boundary" (calling the external API).
 * 
 * An external payment provider acting as a webhook source must implement this.
 */
public interface PaymentWebhookVerifier {

    /**
     * Authenticates the incoming webhook payload using the provider's signature algorithm.
     * MUST be performed on the raw HTTP bytes before any JSON deserialization.
     */
    boolean verifyWebhookSignature(String rawPayload, String signature);

    /** Identifies which provider this verifier is for. */
    PaymentProvider getProvider();
}
