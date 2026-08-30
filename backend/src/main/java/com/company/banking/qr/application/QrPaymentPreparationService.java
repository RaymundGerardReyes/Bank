package com.company.banking.qr.application;

import com.company.banking.common.exception.BusinessException;
import com.company.banking.common.exception.ConflictException;
import com.company.banking.common.exception.ErrorCode;
import com.company.banking.common.exception.ForbiddenException;
import com.company.banking.merchant.domain.Merchant;
import com.company.banking.merchant.domain.MerchantPaymentProfile;
import com.company.banking.merchant.infrastructure.MerchantJpaRepository;
import com.company.banking.merchant.infrastructure.MerchantPaymentProfileJpaRepository;
import com.company.banking.payment.domain.PaymentIntent;
import com.company.banking.payment.domain.PaymentIntentStatus;
import com.company.banking.payment.infrastructure.PaymentIntentJpaRepository;
import com.company.banking.qr.domain.QrPaymentRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;

@Service
@RequiredArgsConstructor
@Slf4j
public class QrPaymentPreparationService {

    private final PaymentIntentJpaRepository paymentIntentRepository;
    private final MerchantJpaRepository merchantRepository;
    private final MerchantPaymentProfileJpaRepository profileRepository;
    
    private static final long RECOVERY_THRESHOLD_MINUTES = 3;

    @Transactional
    public QrPaymentRequest prepareQrGeneration(Long authenticatedCustomerId, String intentId) {
        // 1. Lock the intent
        PaymentIntent intent = paymentIntentRepository.findByIntentIdForUpdate(intentId)
                .orElseThrow(() -> new BusinessException(ErrorCode.NOT_FOUND, "Payment Intent not found"));

        // 2. Authorize Merchant
        Merchant merchant = merchantRepository.findByIdAndOwnerId(intent.getMerchantId(), authenticatedCustomerId)
                .orElseThrow(() -> new ForbiddenException("Unauthorized to access this payment intent"));

        // 3. Resolve preferred provider FIRST (Fails fast if misconfigured before changing state)
        MerchantPaymentProfile profile = profileRepository.findByMerchantId(merchant.getId())
                .stream()
                .filter(p -> "ACTIVE".equals(p.getStatus()) && Boolean.TRUE.equals(p.getIsPreferred()))
                .findFirst()
                .orElseThrow(() -> new BusinessException(ErrorCode.INVALID_REQUEST, "No preferred active payment provider configured"));

        // 4. Validate State & Handle Concurrency
        if (intent.getStatus() == PaymentIntentStatus.QR_GENERATING) {
            if (intent.getQrGenerationStartedAt() == null) {
                throw new IllegalStateException("Invariant violation: QR_GENERATING state lacks a start timestamp");
            }
            long minutesInProgress = ChronoUnit.MINUTES.between(intent.getQrGenerationStartedAt(), LocalDateTime.now());
            if (minutesInProgress < RECOVERY_THRESHOLD_MINUTES) {
                log.warn("Concurrent request rejected. QR generation already fresh/in-progress for intent: {}", intentId);
                throw new ConflictException("QR generation is currently in progress. Please try again shortly.");
            } else {
                log.info("Recovering stale QR generation operation for intent: {} using same idempotency key.", intentId);
            }
        } else {
            // 5. Explicit Domain Transition
            intent.transitionTo(PaymentIntentStatus.QR_GENERATING);
            paymentIntentRepository.save(intent);
        }

        // 6. Build Immutable Request
        return QrPaymentRequest.builder()
                .idempotencyKey("QR-GEN-" + intent.getIntentId()) // Highly deterministic
                .intentId(intent.getIntentId())
                .authoritativeReference(intent.getIntentId()) // Explicit intent-as-reference
                .expectedProvider(profile.getProvider())
                .externalMerchantId(profile.getExternalMerchantId())
                .amount(intent.getAmount())
                .currency(intent.getCurrency())
                .build();
    }
}
