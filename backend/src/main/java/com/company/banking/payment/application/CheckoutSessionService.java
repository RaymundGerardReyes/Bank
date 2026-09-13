package com.company.banking.payment.application;

import com.company.banking.common.exception.BusinessException;
import com.company.banking.common.exception.ErrorCode;
import com.company.banking.payment.api.dto.CheckoutSessionRequest;
import com.company.banking.payment.api.dto.CheckoutSessionResponse;
import com.company.banking.payment.domain.CheckoutSession;
import com.company.banking.payment.domain.CheckoutSessionStatus;
import com.company.banking.payment.domain.PaymentIntent;
import com.company.banking.payment.domain.PaymentIntentStatus;
import com.company.banking.payment.infrastructure.CheckoutSessionJpaRepository;
import com.company.banking.payment.infrastructure.PaymentIntentJpaRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.net.URI;
import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;

import com.company.banking.merchant.infrastructure.MerchantJpaRepository;
import com.company.banking.payment.api.dto.PublicCheckoutSessionResponse;
import com.company.banking.payment.domain.DynamicQrPayment;
import com.company.banking.payment.infrastructure.DynamicQrPaymentJpaRepository;
import org.springframework.beans.factory.annotation.Value;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class CheckoutSessionService {

    private final CheckoutSessionJpaRepository sessionRepository;
    private final PaymentIntentJpaRepository intentRepository;
    private final MerchantJpaRepository merchantRepository;
    private final DynamicQrPaymentJpaRepository dynamicQrPaymentJpaRepository;

    @Value("${PAYMENT_WEBHOOK_PUBLIC_URL:${payment.webhook-public-url:}}")
    private String paymentWebhookPublicUrl;

    @Value("${PAYMENT_WEBHOOK_HOST:${payment.webhook-host:}}")
    private String paymentWebhookHost;

    @Value("${payment.checkout-base-url:${PAYMENT_CHECKOUT_BASE_URL:}}")
    private String configuredCheckoutBaseUrl;

    @Transactional
    public CheckoutSessionResponse createSession(Long merchantId, String idempotencyKey, CheckoutSessionRequest request) {
        // 1. Idempotency Check
        Optional<CheckoutSession> existingSession = sessionRepository.findByMerchantIdAndIdempotencyKey(merchantId, idempotencyKey);
        if (existingSession.isPresent()) {
            log.info("[CHECKOUT] Returning idempotent session for key: {}", idempotencyKey);
            return mapToResponse(existingSession.get());
        }

        // 2. URL Security Validation
        validateUrlSaftey(request.getSuccessUrl());
        if (request.getCancelUrl() != null) validateUrlSaftey(request.getCancelUrl());

        // 3. Server-Side Financial Derivation
        BigDecimal derivedAmount = request.getLineItems().stream()
                .map(item -> item.getUnitAmount().multiply(BigDecimal.valueOf(item.getQuantity())))
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        String sessionId = "cs_" + UUID.randomUUID().toString().replace("-", "");
        String intentId = "pi_" + UUID.randomUUID().toString().replace("-", "");

        try {
            // 4. Create Authoritative Financial Intent
            PaymentIntent intent = intentRepository.save(PaymentIntent.builder()
                    .intentId(intentId)
                    .merchantId(merchantId)
                    .customerAccountNumber("PENDING_CHECKOUT")
                    .amount(derivedAmount)
                    .currency(request.getCurrency())
                    .status(PaymentIntentStatus.CREATED)
                    .description("Checkout for " + request.getReference())
                    .build());

            // 5. Create Customer-Facing Session Projection
            CheckoutSession session = sessionRepository.save(CheckoutSession.builder()
                    .sessionId(sessionId)
                    .merchantId(merchantId)
                    .idempotencyKey(idempotencyKey)
                    .paymentIntentId(intent.getIntentId())
                    .amount(derivedAmount)
                    .currency(request.getCurrency())
                    .description("Checkout for " + request.getReference())
                    .status(CheckoutSessionStatus.ACTIVE)
                    .successUrl(request.getSuccessUrl())
                    .cancelUrl(request.getCancelUrl())
                    .createdAt(LocalDateTime.now())
                    .expiresAt(LocalDateTime.now().plusHours(1))
                    .build());

            sessionRepository.flush();
            return mapToResponse(session);

        } catch (DataIntegrityViolationException e) {
            // Failsafe for race conditions on the unique idempotency constraint
            return mapToResponse(sessionRepository.findByMerchantIdAndIdempotencyKey(merchantId, idempotencyKey)
                    .orElseThrow(() -> new BusinessException(ErrorCode.CONFLICT, "Concurrent session creation blocked.")));
        }
    }

    @Transactional(readOnly = true)
    public PublicCheckoutSessionResponse getPublicSessionState(String publicToken) {
        CheckoutSession session = sessionRepository.findBySessionId(publicToken)
                .or(() -> sessionRepository.findByPaymentIntentId(publicToken))
                .orElse(null);

        if (session != null) {
            String merchantName = merchantRepository.findById(session.getMerchantId())
                    .map(m -> m.getLegalName())
                    .orElse("Nova Bank Merchant");

            boolean isExpired = session.getExpiresAt() != null && LocalDateTime.now().isAfter(session.getExpiresAt());
            boolean isLocked = isExpired ||
                    session.getStatus() == CheckoutSessionStatus.PAID ||
                    session.getStatus() == CheckoutSessionStatus.PAYMENT_FAILED ||
                    session.getStatus() == CheckoutSessionStatus.EXPIRED ||
                    session.getStatus() == CheckoutSessionStatus.CANCELLED;

            String statusStr = isExpired && session.getStatus() == CheckoutSessionStatus.ACTIVE 
                    ? CheckoutSessionStatus.EXPIRED.name() 
                    : session.getStatus().name();

            String returnUrl = isInternalSelfReferentialUrl(session.getSuccessUrl(), session) 
                    ? null 
                    : session.getSuccessUrl();

            String cancelUrl = isInternalSelfReferentialUrl(session.getCancelUrl(), session) 
                    ? null 
                    : session.getCancelUrl();

            String qrRef = null;
            String qrPayload = null;
            String qrStatus = null;
            LocalDateTime qrExpiresAt = null;

            if (session.getPaymentIntentId() != null) {
                Optional<PaymentIntent> intentOpt = intentRepository.findByIntentId(session.getPaymentIntentId());
                if (intentOpt.isPresent()) {
                    Optional<DynamicQrPayment> qrOpt = dynamicQrPaymentJpaRepository.findByPaymentIntentId(intentOpt.get().getId());
                    if (qrOpt.isPresent()) {
                        DynamicQrPayment qr = qrOpt.get();
                        qrRef = qr.getQrReference();
                        qrPayload = qr.getQrPayload();
                        qrStatus = qr.getStatus();
                        qrExpiresAt = qr.getExpiresAt();
                    }
                }
            }

            return PublicCheckoutSessionResponse.builder()
                    .id(session.getSessionId())
                    .status(statusStr)
                    .amount(session.getAmount())
                    .currency(session.getCurrency())
                    .description(session.getDescription())
                    .merchantName(merchantName)
                    .paymentMethods(List.of("INTERNAL_ACCOUNT", "QR_PH"))
                    .selectedPaymentMethod(session.getSelectedPaymentMethod())
                    .qrReference(qrRef)
                    .qrPayload(qrPayload)
                    .qrStatus(qrStatus)
                    .qrExpiresAt(qrExpiresAt)
                    .expiresAt(session.getExpiresAt())
                    .returnUrl(returnUrl)
                    .cancelUrl(cancelUrl)
                    .locked(isLocked)
                    .build();
        }

        PaymentIntent intent = intentRepository.findByIntentId(publicToken)
                .orElseThrow(() -> new BusinessException(ErrorCode.NOT_FOUND, "Checkout session not found"));

        String merchantName = merchantRepository.findById(intent.getMerchantId())
                .map(m -> m.getLegalName())
                .orElse("Nova Bank Merchant");

        boolean isTerminal = intent.getStatus() == PaymentIntentStatus.SUCCESS || 
                             intent.getStatus() == PaymentIntentStatus.CANCELLED ||
                             intent.getStatus() == PaymentIntentStatus.FAILED;

        String mappedStatus = switch (intent.getStatus()) {
            case SUCCESS -> "PAID";
            case FAILED -> "PAYMENT_FAILED";
            case CANCELLED -> "CANCELLED";
            case AUTHORIZED -> "AUTHORIZED";
            default -> "ACTIVE";
        };

        String qrRef = null;
        String qrPayload = null;
        String qrStatus = null;
        LocalDateTime qrExpiresAt = null;
        Optional<DynamicQrPayment> qrOpt = dynamicQrPaymentJpaRepository.findByPaymentIntentId(intent.getId());
        if (qrOpt.isPresent()) {
            DynamicQrPayment qr = qrOpt.get();
            qrRef = qr.getQrReference();
            qrPayload = qr.getQrPayload();
            qrStatus = qr.getStatus();
            qrExpiresAt = qr.getExpiresAt();
        }

        return PublicCheckoutSessionResponse.builder()
                .id(intent.getIntentId())
                .status(mappedStatus)
                .amount(intent.getAmount())
                .currency(intent.getCurrency() != null ? intent.getCurrency() : "PHP")
                .description(intent.getDescription() != null ? intent.getDescription() : "Order Payment")
                .merchantName(merchantName)
                .paymentMethods(List.of("INTERNAL_ACCOUNT", "QR_PH"))
                .selectedPaymentMethod(qrRef != null ? "QR_PH" : null)
                .qrReference(qrRef)
                .qrPayload(qrPayload)
                .qrStatus(qrStatus)
                .qrExpiresAt(qrExpiresAt)
                .expiresAt(intent.getCreatedAt() != null ? intent.getCreatedAt().plusHours(1) : LocalDateTime.now().plusHours(1))
                .returnUrl(null)
                .cancelUrl(null)
                .locked(isTerminal)
                .build();
    }

    private CheckoutSessionResponse mapToResponse(CheckoutSession session) {
        String checkoutUrl = resolveCheckoutUrl(session.getSessionId());

        return CheckoutSessionResponse.builder()
                .id(session.getSessionId())
                .sessionId(session.getSessionId())
                .paymentIntentId(session.getPaymentIntentId())
                .checkoutUrl(checkoutUrl)
                .url(checkoutUrl)
                .status(session.getStatus().name())
                .amount(session.getAmount())
                .currency(session.getCurrency())
                .clientSecret(session.getSessionId())
                .build();
    }

    private String resolveCheckoutBaseUrl() {
        // 1. External payment gateway public URL (extract scheme + authority, matching DefaultExternalPaymentGateway)
        if (paymentWebhookPublicUrl != null && !paymentWebhookPublicUrl.isBlank()) {
            try {
                URI uri = new URI(paymentWebhookPublicUrl.trim());
                if (uri.getScheme() != null && uri.getAuthority() != null) {
                    return uri.getScheme() + "://" + uri.getAuthority();
                }
            } catch (Exception e) {
                log.warn("[CHECKOUT] Could not parse authority from PAYMENT_WEBHOOK_PUBLIC_URL: {}", paymentWebhookPublicUrl);
            }
        }

        // 2. Fallback to PAYMENT_WEBHOOK_HOST (external payment gateway virtual host)
        if (paymentWebhookHost != null && !paymentWebhookHost.isBlank()) {
            String host = paymentWebhookHost.trim().replaceAll("/+$", "");
            if (host.startsWith("http://") || host.startsWith("https://")) {
                return host;
            }
            if (host.startsWith("localhost") || host.startsWith("127.0.0.1")) {
                return "http://" + host;
            }
            return "https://" + host;
        }

        // 3. Fallback to explicitly configured checkout base URL
        if (configuredCheckoutBaseUrl != null && !configuredCheckoutBaseUrl.isBlank()) {
            String clean = configuredCheckoutBaseUrl.trim().replaceAll("/+$", "");
            if (clean.startsWith("http://") || clean.startsWith("https://")) {
                return clean;
            }
            return "https://" + clean;
        }

        // 4. Default for local standalone development
        return "http://localhost:3000";
    }

    private String resolveCheckoutUrl(String sessionId) {
        String base = resolveCheckoutBaseUrl().replaceAll("/+$", "");
        return base + "/checkout/" + sessionId;
    }

    private void validateUrlSaftey(String urlString) {
        try {
            URI uri = new URI(urlString);
            if (!"https".equalsIgnoreCase(uri.getScheme())) {
                throw new BusinessException(ErrorCode.INVALID_REQUEST, "URLs must use HTTPS");
            }
        } catch (Exception e) {
            throw new BusinessException(ErrorCode.INVALID_REQUEST, "Malformed or unsafe URL provided");
        }
    }

    private boolean isInternalSelfReferentialUrl(String url, CheckoutSession session) {
        if (url == null || url.isBlank()) return true;
        String trimmed = url.trim();
        if ("NO_RETURN_URL".equalsIgnoreCase(trimmed) || "CLIENT_RETURN_PENDING".equalsIgnoreCase(trimmed)) return true;
        if (trimmed.equals("/success") || trimmed.equals("/cancel") || trimmed.startsWith("/api/v1/checkout/")) return true;
        if (session != null) {
            if (session.getSessionId() != null && trimmed.contains("/checkout/" + session.getSessionId())) return true;
            if (session.getPaymentIntentId() != null && trimmed.contains("/checkout/" + session.getPaymentIntentId())) return true;
        }
        return false;
    }
}
