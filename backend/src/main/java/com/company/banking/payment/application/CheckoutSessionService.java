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
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class CheckoutSessionService {

    private final CheckoutSessionJpaRepository sessionRepository;
    private final PaymentIntentJpaRepository intentRepository;
    private final MerchantJpaRepository merchantRepository;

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
                .orElseThrow(() -> new BusinessException(ErrorCode.NOT_FOUND, "Checkout session not found"));

        // Fetch safe merchant display name
        String merchantName = merchantRepository.findById(session.getMerchantId())
                .map(m -> m.getLegalName())
                .orElse("Nova Bank Merchant");

        return PublicCheckoutSessionResponse.builder()
                .id(session.getSessionId())
                .status(session.getStatus().name())
                .amount(session.getAmount())
                .currency(session.getCurrency())
                .description(session.getDescription())
                .merchantName(merchantName)
                .paymentMethods(List.of("INTERNAL_ACCOUNT"))
                .expiresAt(session.getExpiresAt())
                .build();
    }

    private CheckoutSessionResponse mapToResponse(CheckoutSession session) {
        return CheckoutSessionResponse.builder()
                .id(session.getSessionId())
                .status(session.getStatus().name())
                .amount(session.getAmount())
                .currency(session.getCurrency())
                .build();
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
}
