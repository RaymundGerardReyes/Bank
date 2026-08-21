package com.company.banking.payment.gateway;

import com.company.banking.payment.domain.PaymentChannel;
import com.company.banking.payment.domain.PaymentProvider;
import com.company.banking.payment.gateway.dto.ExternalCheckoutRequest;
import com.company.banking.payment.gateway.dto.GatewayPaymentStatus;
import com.company.banking.payment.gateway.dto.PaymentSession;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.time.LocalDateTime;
import java.util.Base64;
import java.util.HexFormat;
import java.util.Map;
import java.util.UUID;

/**
 * PayMongo Hosted Checkout gateway implementation.
 *
 * Structural twin of PaynamicsGateway — implements the same ExternalPaymentGateway
 * interface, uses PayMongoProperties the same way PaynamicsGateway uses
 * PaynamicsCheckoutProperties, and follows the same @Component/@ConditionalOnProperty/@Slf4j
 * pattern so the PaymentRouter can resolve it by PaymentProvider enum value.
 *
 * Key difference from the Paynamics stub:
 *   verifyWebhookSignature() contains the REAL HMAC-SHA256 implementation using
 *   the PayMongo signature format: HMAC-SHA256(timestamp + "." + rawBody, webhookSecret).
 *
 * PayMongo HTTP Basic Auth:
 *   Authorization: Basic base64(secretKey + ":")
 *   (password is an empty string — the colon is required)
 */
@Component
@ConditionalOnProperty(name = "payment.provider", havingValue = "paymongo")
@RequiredArgsConstructor
@Slf4j
public class PayMongoGateway implements ExternalPaymentGateway, PaymentWebhookVerifier {

    private static final String HMAC_ALGORITHM = "HmacSHA256";

    private final PayMongoProperties properties;

    // RestTemplate reuse — same pattern as InstitutionCallbackService
    private final RestTemplate restTemplate = new RestTemplate();

    // -------------------------------------------------------------------------
    // ExternalPaymentGateway — createCheckout
    // -------------------------------------------------------------------------

    @Override
    public PaymentSession createCheckout(ExternalCheckoutRequest request) {
        log.info("[PAYMONGO] Initiating Hosted Checkout session for reference: {}", request.getReference());

        validateSecretKey();

        // Build the PayMongo Checkout Session request body per their API docs.
        // POST https://api.paymongo.com/v1/checkout_sessions
        Map<String, Object> attributes = Map.of(
            "billing",         Map.of(),
            "description",     request.getDescription() != null ? request.getDescription() : "",
            "line_items",      java.util.List.of(Map.of(
                "currency",  request.getCurrency().toLowerCase(),
                "amount",    request.getAmount().multiply(java.math.BigDecimal.valueOf(100)).longValue(), // PayMongo uses centavos
                "name",      request.getDescription() != null ? request.getDescription() : "Payment",
                "quantity",  1
            )),
            "payment_method_types", java.util.List.of("card", "gcash", "maya", "paymaya"),
            "reference_number",     request.getReference(),
            "success_url",          resolveSuccessUrl(request),
            "cancel_url",           resolveCancelUrl(request)
        );

        Map<String, Object> requestBody = Map.of("data", Map.of("attributes", attributes));

        HttpHeaders headers = buildAuthHeaders();
        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);

        try {
            String url = properties.getBaseUrl() + "/v1/checkout_sessions";
            log.debug("[PAYMONGO] POST {} with reference {}", url, request.getReference());

            ResponseEntity<Map> response = restTemplate.postForEntity(url, entity, Map.class);

            if (response.getBody() == null) {
                throw new RuntimeException("[PAYMONGO] Null response body from checkout session creation.");
            }

            // Navigate: response.data.id (checkout session ID) and
            //           response.data.attributes.checkout_url
            @SuppressWarnings("unchecked")
            Map<String, Object> data = (Map<String, Object>) response.getBody().get("data");
            String sessionId = (String) data.get("id");

            @SuppressWarnings("unchecked")
            Map<String, Object> attrs = (Map<String, Object>) data.get("attributes");
            String checkoutUrl = (String) attrs.get("checkout_url");

            log.info("[PAYMONGO] Checkout session created. SessionId: {}, URL: {}", sessionId, checkoutUrl);

            return PaymentSession.builder()
                    .providerReference(sessionId)
                    .checkoutUrl(checkoutUrl)
                    .expiresAt(LocalDateTime.now().plusMinutes(15))
                    .provider(PaymentProvider.PAYMONGO)
                    .channel(PaymentChannel.HOSTED_CHECKOUT)
                    .build();

        } catch (Exception e) {
            log.error("[PAYMONGO] Failed to create checkout session for reference {}: {}", request.getReference(), e.getMessage(), e);
            throw new RuntimeException("[PAYMONGO] Checkout session creation failed: " + e.getMessage(), e);
        }
    }

    // -------------------------------------------------------------------------
    // ExternalPaymentGateway — getStatus
    // -------------------------------------------------------------------------

    @Override
    public GatewayPaymentStatus getStatus(String providerReference) {
        log.info("[PAYMONGO] Polling status for checkout session: {}", providerReference);

        validateSecretKey();

        try {
            String url = properties.getBaseUrl() + "/v1/checkout_sessions/" + providerReference;
            HttpEntity<Void> entity = new HttpEntity<>(buildAuthHeaders());

            ResponseEntity<Map> response = restTemplate.exchange(url,
                    org.springframework.http.HttpMethod.GET, entity, Map.class);

            if (response.getBody() == null) {
                log.warn("[PAYMONGO] Null status response for session {}", providerReference);
                return GatewayPaymentStatus.PROCESSING;
            }

            @SuppressWarnings("unchecked")
            Map<String, Object> data  = (Map<String, Object>) response.getBody().get("data");
            @SuppressWarnings("unchecked")
            Map<String, Object> attrs = (Map<String, Object>) data.get("attributes");
            String status = (String) attrs.get("payment_intent.status");

            return mapPayMongoStatus(status);

        } catch (Exception e) {
            log.error("[PAYMONGO] Status polling failed for session {}: {}", providerReference, e.getMessage());
            return GatewayPaymentStatus.PROCESSING;
        }
    }

    // -------------------------------------------------------------------------
    // ExternalPaymentGateway — verifyWebhookSignature (REAL HMAC-SHA256)
    // -------------------------------------------------------------------------

    /**
     * Verifies the PayMongo webhook signature using HMAC-SHA256.
     *
     * PayMongo Signature Header format:
     *   Paymongo-Signature: t=<timestamp>,te=<test_hmac>,li=<live_hmac>
     *
     * Signed payload construction (from PayMongo docs):
     *   signedPayload = timestamp + "." + rawBody
     *
     * Verification:
     *   computedHmac = HMAC-SHA256(signedPayload, webhookSecret)  [hex-encoded]
     *   compare computedHmac with "te" (test) or "li" (live) component
     *
     * IMPORTANT: rawPayload must be the verbatim HTTP request body bytes converted
     * to UTF-8 String — never re-serialized from a deserialized object.
     *
     * @param rawPayload  the verbatim raw request body as UTF-8 string
     * @param signature   the full "Paymongo-Signature" header value
     * @return true if the computed HMAC matches the header signature
     */
    @Override
    public boolean verifyWebhookSignature(String rawPayload, String signature) {
        log.info("[PAYMONGO] Beginning HMAC-SHA256 webhook signature verification.");

        if (properties.getWebhookSecret() == null || properties.getWebhookSecret().isBlank()) {
            log.error("[PAYMONGO] SECURITY HALT: PAYMONGO_WEBHOOK_SECRET is not configured. " +
                      "All inbound webhooks will be rejected until this is set.");
            return false;
        }

        if (signature == null || signature.isBlank()) {
            log.warn("[PAYMONGO] Rejected: Missing Paymongo-Signature header.");
            return false;
        }

        try {
            // ---- 1. Parse the signature header components ----
            // Format: t=1234567890,te=abc123...,li=def456...
            String timestamp = null;
            String testHmac  = null;
            String liveHmac  = null;

            for (String part : signature.split(",")) {
                String trimmed = part.trim();
                if (trimmed.startsWith("t="))  timestamp = trimmed.substring(2);
                if (trimmed.startsWith("te=")) testHmac  = trimmed.substring(3);
                if (trimmed.startsWith("li=")) liveHmac  = trimmed.substring(3);
            }

            if (timestamp == null || timestamp.isBlank()) {
                log.warn("[PAYMONGO] Rejected: Signature header missing timestamp component (t=).");
                return false;
            }

            // ---- 2. Build the signed payload ----
            String signedPayload = timestamp + "." + rawPayload;

            // ---- 3. Compute HMAC-SHA256 ----
            String computedHmac = computeHmacSha256(signedPayload, properties.getWebhookSecret());

            // ---- 4. Timing-safe comparison against test or live signature ----
            // Use test signature in sandbox mode, live signature in production.
            String expectedHmac = properties.isSandbox() ? testHmac : liveHmac;

            if (expectedHmac == null || expectedHmac.isBlank()) {
                log.warn("[PAYMONGO] Rejected: No {} signature component found in header.",
                         properties.isSandbox() ? "te (test)" : "li (live)");
                return false;
            }

            boolean match = timingSafeEquals(computedHmac, expectedHmac);

            if (match) {
                log.info("[PAYMONGO] Webhook signature VERIFIED for timestamp {}.", timestamp);
            } else {
                log.warn("[PAYMONGO] Webhook signature MISMATCH. Computed: {}, Expected: {}",
                         computedHmac, expectedHmac);
            }

            return match;

        } catch (Exception e) {
            log.error("[PAYMONGO] Signature verification threw an exception — rejecting webhook: {}", e.getMessage(), e);
            return false;
        }
    }

    // -------------------------------------------------------------------------
    // ExternalPaymentGateway — getProvider
    // -------------------------------------------------------------------------

    @Override
    public PaymentProvider getProvider() {
        return PaymentProvider.PAYMONGO;
    }

    // -------------------------------------------------------------------------
    // Private helpers
    // -------------------------------------------------------------------------

    /**
     * Computes HMAC-SHA256 of the input using the given secret, returns lowercase hex string.
     * Mirrors the Java pattern described in the PayMongo docs and the stub comment in
     * InstitutionCallbackService.generateSignature().
     */
    private String computeHmacSha256(String data, String secret) throws Exception {
        Mac mac = Mac.getInstance(HMAC_ALGORITHM);
        SecretKeySpec keySpec = new SecretKeySpec(
                secret.getBytes(StandardCharsets.UTF_8),
                HMAC_ALGORITHM
        );
        mac.init(keySpec);
        byte[] rawHmac = mac.doFinal(data.getBytes(StandardCharsets.UTF_8));
        return HexFormat.of().formatHex(rawHmac); // lowercase hex, Java 17+
    }

    /**
     * Constant-time string comparison to prevent timing attacks on signature checks.
     * Compares every character regardless of early mismatch — same length must be enforced first.
     */
    private boolean timingSafeEquals(String a, String b) {
        if (a == null || b == null) return false;
        if (a.length() != b.length()) return false;
        int result = 0;
        for (int i = 0; i < a.length(); i++) {
            result |= a.charAt(i) ^ b.charAt(i);
        }
        return result == 0;
    }

    /**
     * Builds HTTP Basic Auth headers for PayMongo API calls.
     * PayMongo uses: Authorization: Basic base64(secretKey + ":")
     * The colon after the key is mandatory; the password is empty.
     */
    private HttpHeaders buildAuthHeaders() {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        String credentials = properties.getSecretKey() + ":";
        String encoded = Base64.getEncoder().encodeToString(
                credentials.getBytes(StandardCharsets.UTF_8));
        headers.set("Authorization", "Basic " + encoded);
        return headers;
    }

    private void validateSecretKey() {
        if (properties.getSecretKey() == null || properties.getSecretKey().isBlank()) {
            throw new IllegalStateException(
                    "[PAYMONGO] PAYMONGO_SECRET_KEY is not configured. " +
                    "Set PAYMONGO_SECRET_KEY in your environment before invoking this gateway.");
        }
    }

    private String resolveSuccessUrl(ExternalCheckoutRequest request) {
        return request.getSuccessUrl() != null
                ? request.getSuccessUrl()
                : properties.getBaseUrl().replace("api.paymongo.com", "your-domain.com") + "/payment/success";
    }

    private String resolveCancelUrl(ExternalCheckoutRequest request) {
        return request.getCancelUrl() != null
                ? request.getCancelUrl()
                : properties.getBaseUrl().replace("api.paymongo.com", "your-domain.com") + "/payment/cancel";
    }

    private GatewayPaymentStatus mapPayMongoStatus(String paymongoStatus) {
        if (paymongoStatus == null) return GatewayPaymentStatus.PROCESSING;
        return switch (paymongoStatus.toLowerCase()) {
            case "paid", "succeeded"  -> GatewayPaymentStatus.SUCCESS;
            case "failed", "expired"  -> GatewayPaymentStatus.FAILED;
            case "cancelled", "voided" -> GatewayPaymentStatus.CANCELLED;
            default                    -> GatewayPaymentStatus.PROCESSING;
        };
    }
}
