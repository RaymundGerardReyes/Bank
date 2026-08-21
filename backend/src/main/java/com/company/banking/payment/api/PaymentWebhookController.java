package com.company.banking.payment.api;

import com.company.banking.common.exception.BusinessException;
import com.company.banking.common.response.ApiResponse;
import com.company.banking.payment.application.PaymentWebhookService;
import com.company.banking.web.filter.CorrelationIdFilter;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.slf4j.MDC;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * Phase G: Secure inbound webhook controller.
 *
 * Critical architectural rules enforced here:
 *
 *   1. @RequestBody byte[] rawBody — Spring delivers the verbatim HTTP bytes.
 *      We NEVER deserialize to Map/Object before signature verification.
 *      Deserializing first and re-serializing to verify is a security anti-pattern
 *      that can cause legitimate webhooks to fail (JSON key ordering, whitespace).
 *
 *   2. Signature header extraction via HttpServletRequest — provider-specific header
 *      names are resolved inside PaymentWebhookService, keeping the controller agnostic.
 *
 *   3. Zero business logic in this class — all processing is delegated to
 *      PaymentWebhookService. This controller is a pure HTTP adapter.
 *
 *   4. Always return 2xx — PayMongo and other providers retry on non-2xx responses.
 *      Signature failures return 401. Duplicate events return 200 silently.
 *      Any other error returns 500 so the provider retries rather than dropping the event.
 *
 * Route: POST /api/v1/webhooks/payment/{provider}
 * Examples:
 *   POST /api/v1/webhooks/payment/paymongo
 *   POST /api/v1/webhooks/payment/paynamics
 *   POST /api/v1/webhooks/payment/maya
 */
@Slf4j
@RestController
@RequestMapping("/api/v1/webhooks/payment")
@RequiredArgsConstructor
public class PaymentWebhookController {

    // Provider-specific signature header names
    private static final String PAYMONGO_SIGNATURE_HEADER  = "Paymongo-Signature";
    private static final String PAYNAMICS_SIGNATURE_HEADER = "X-Paynamics-Signature";
    private static final String MAYA_SIGNATURE_HEADER      = "X-Maya-Signature";

    private final PaymentWebhookService paymentWebhookService;

    /**
     * Universal inbound webhook endpoint for all registered external payment providers.
     *
     * @param provider    the provider name from the URL path (case-insensitive)
     * @param rawBody     verbatim HTTP request body bytes — NOT deserialized
     * @param request     used to extract the provider-specific signature header
     */
    @PostMapping("/{provider}")
    public ResponseEntity<ApiResponse<Void>> handleProviderWebhook(
            @PathVariable String provider,
            @RequestBody byte[] rawBody,
            HttpServletRequest request) {

        String correlationId = MDC.get(CorrelationIdFilter.MDC_KEY);
        log.info("[WEBHOOK] Inbound delivery from provider: {} | correlationId: {}", provider, correlationId);

        // Resolve the correct signature header for this provider
        String signatureHeader = resolveSignatureHeader(provider, request);

        try {
            paymentWebhookService.handle(provider, rawBody, signatureHeader);

            log.info("[WEBHOOK] Successfully processed webhook from provider: {}", provider);
            return ResponseEntity.ok(
                    ApiResponse.success(null, "Webhook received and processed", correlationId));

        } catch (BusinessException ex) {
            // UNAUTHORIZED = signature failure → tell the caller, but not our internals
            if (ex.getErrorCode().getHttpStatus() == org.springframework.http.HttpStatus.UNAUTHORIZED) {
                log.error("[WEBHOOK] Signature verification rejected for provider {}. correlationId: {}",
                          provider, correlationId);
                return ResponseEntity
                        .status(HttpStatus.UNAUTHORIZED)
                        .body(ApiResponse.error("Webhook signature invalid", correlationId));
            }
            // All other BusinessExceptions (unknown provider, bad JSON) → 400
            log.error("[WEBHOOK] Bad request from provider {}: {} | correlationId: {}",
                      provider, ex.getMessage(), correlationId);
            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body(ApiResponse.error(ex.getMessage(), correlationId));

        } catch (Exception ex) {
            // Unexpected failure — return 500 so provider retries delivery
            log.error("[WEBHOOK] Unexpected error processing webhook from provider {}: {} | correlationId: {}",
                      provider, ex.getMessage(), correlationId, ex);
            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Internal processing error — retry will be accepted", correlationId));
        }
    }

    /**
     * Maps the provider name to its specific signature header name.
     * Falls back to "X-Signature" for any unrecognized provider.
     */
    private String resolveSignatureHeader(String provider, HttpServletRequest request) {
        String headerName = switch (provider.toLowerCase()) {
            case "paymongo"   -> PAYMONGO_SIGNATURE_HEADER;
            case "paynamics"  -> PAYNAMICS_SIGNATURE_HEADER;
            case "maya"       -> MAYA_SIGNATURE_HEADER;
            default           -> "X-Signature";
        };
        String headerValue = request.getHeader(headerName);
        log.debug("[WEBHOOK] Resolved signature header '{}' = '{}' for provider {}",
                  headerName, headerValue != null ? "[present]" : "[missing]", provider);
        return headerValue;
    }
}