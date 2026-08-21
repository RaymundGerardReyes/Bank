package com.company.banking.payment.gateway;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

/**
 * Externalized configuration for the PayMongo payment gateway.
 * Follows the identical pattern as PaynamicsCheckoutProperties —
 * bound via @ConfigurationProperties to the "payment.paymongo" prefix.
 *
 * In application-dev.yml / application-prod.yml, wire these from environment:
 *
 *   payment:
 *     paymongo:
 *       secret-key: ${PAYMONGO_SECRET_KEY:}
 *       webhook-secret: ${PAYMONGO_WEBHOOK_SECRET:}
 *       base-url: ${PAYMONGO_BASE_URL:https://api.paymongo.com}
 *       sandbox: ${PAYMONGO_SANDBOX:true}
 */
@Configuration
@ConfigurationProperties(prefix = "payment.paymongo")
@Data
public class PayMongoProperties {

    /** sk_test_... or sk_live_... — used for HTTP Basic Auth when calling PayMongo API. */
    private String secretKey;

    /**
     * The webhook signing secret provisioned per-endpoint in the PayMongo dashboard.
     * This is NOT the same value as secretKey. It is generated separately when you
     * register your webhook URL in the PayMongo portal.
     */
    private String webhookSecret;

    /** Base URL of the PayMongo API. Defaults to production if not overridden. */
    private String baseUrl = "https://api.paymongo.com";

    /** When true, logs extra diagnostics. Does not affect which credentials are used — that is driven by the key prefix (sk_test_ vs sk_live_). */
    private boolean sandbox = true;
}
