package com.company.banking.payment.application;

import com.company.banking.common.exception.BusinessException;
import com.company.banking.common.exception.ErrorCode;
import com.company.banking.payment.api.dto.InitiatePaymentRequest;
import com.company.banking.payment.api.dto.InitiatePaymentResponse;
import com.company.banking.payment.api.dto.PaymentReceiptData;
import com.company.banking.payment.api.dto.SessionValidationResponse;
import com.company.banking.payment.gateway.ExternalPaymentGateway;
import com.company.banking.payment.gateway.dto.ExternalCheckoutRequest;
import com.company.banking.payment.domain.Institution;
import com.company.banking.payment.domain.PaymentAttempt;
import com.company.banking.payment.domain.PaymentSession;
import com.company.banking.payment.domain.PaymentSessionStatus;
import com.company.banking.payment.domain.PaymentReceiptPolicy;
import com.company.banking.payment.domain.exception.PaymentRequiredException;
import com.company.banking.payment.infrastructure.InstitutionJpaRepository;
import com.company.banking.payment.infrastructure.PaymentAttemptJpaRepository;
import com.company.banking.payment.infrastructure.PaymentSessionJpaRepository;
import com.company.banking.payment.routing.PaymentRouter;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class PublicCheckoutService {

    private final PaymentSessionJpaRepository sessionRepository;
    private final InstitutionJpaRepository institutionRepository;
    private final PaymentAttemptJpaRepository attemptRepository;
    private final PaymentRouter paymentRouter;
    private final PaymentReceiptPolicy paymentReceiptPolicy; // Added for Phase F

    @Transactional
    public SessionValidationResponse validateSession(String sessionId) {
        PaymentSession session = sessionRepository.findBySessionId(sessionId)
                .orElseThrow(() -> new BusinessException(ErrorCode.NOT_FOUND, "Payment session not found"));

        Institution institution = institutionRepository.findById(session.getInstitutionId())
                .orElseThrow(() -> new BusinessException(ErrorCode.NOT_FOUND, "Institution profile not found"));

        boolean isValid = true;
        if (session.getStatus() != PaymentSessionStatus.ACTIVE && session.getStatus() != PaymentSessionStatus.CREATED) {
            isValid = false;
        }
        if (session.getExpiresAt() != null && session.getExpiresAt().isBefore(LocalDateTime.now())) {
            isValid = false;
            if (session.getStatus() != PaymentSessionStatus.EXPIRED) {
                session.setStatus(PaymentSessionStatus.EXPIRED);
                sessionRepository.save(session);
            }
        }

        return SessionValidationResponse.builder()
                .valid(isValid)
                .sessionId(session.getSessionId())
                .institutionName(institution.getName())
                .institutionReference(session.getInstitutionReference())
                .customerReference(session.getCustomerReference())
                .amount(session.getAmount())
                .currency(session.getCurrency())
                .expiresAt(session.getExpiresAt())
                .status(session.getStatus().name())
                .build();
    }

    @Transactional
    public InitiatePaymentResponse initiatePayment(String sessionId, InitiatePaymentRequest request) {
        log.info("[CHECKOUT] Initiating payment for session {}, Method: {}", sessionId, request.getPaymentMethod());

        PaymentSession session = sessionRepository.findBySessionId(sessionId)
                .orElseThrow(() -> new BusinessException(ErrorCode.NOT_FOUND, "Payment session not found"));

        if (session.getStatus() != PaymentSessionStatus.ACTIVE && session.getStatus() != PaymentSessionStatus.CREATED) {
            throw new BusinessException(ErrorCode.INVALID_REQUEST, "Payment session is not in an actionable state.");
        }

        String attemptId = "ATT-" + UUID.randomUUID().toString().substring(0, 12).toUpperCase();
        ExternalPaymentGateway gateway = paymentRouter.route(request.getPaymentMethod(), session.getAmount(), session.getCurrency());

        ExternalCheckoutRequest extReq = ExternalCheckoutRequest.builder()
                .reference(attemptId)
                .amount(session.getAmount())
                .currency(session.getCurrency())
                .description(session.getDescription())
                .build();

        var extRes = gateway.createCheckout(extReq);

        PaymentAttempt attempt = PaymentAttempt.builder()
                .attemptId(attemptId)
                .paymentSessionId(session.getSessionId())
                .paymentIntentId(0L) 
                .provider(extRes.getProvider() != null ? extRes.getProvider().name() : "UNKNOWN")
                .providerReference(extRes.getProviderReference())
                .checkoutUrl(extRes.getCheckoutUrl())
                .status("PROCESSING")
                .expiresAt(LocalDateTime.now().plusMinutes(15))
                .build();

        attemptRepository.save(attempt);
        session.setStatus(PaymentSessionStatus.PROCESSING);
        sessionRepository.save(session);

        return InitiatePaymentResponse.builder()
                .attemptId(attemptId)
                .checkoutUrl(attempt.getCheckoutUrl())
                .expiresAt(attempt.getExpiresAt())
                .reference(extRes.getProviderReference())
                .instructions(extRes.getInstructions())
                .build();
    }

    // --- NEW PHASE F METHOD ---
    @Transactional(readOnly = true)
    public PaymentReceiptData getReceipt(String sessionId) {
        log.info("[RECEIPT] Requesting receipt generation for session: {}", sessionId);

        PaymentSession session = sessionRepository.findBySessionId(sessionId)
                .orElseThrow(() -> new BusinessException(ErrorCode.NOT_FOUND, "Payment session not found"));

        Institution institution = institutionRepository.findById(session.getInstitutionId())
                .orElseThrow(() -> new BusinessException(ErrorCode.NOT_FOUND, "Institution profile not found"));

        // Strict Policy Enforcement
        if (!paymentReceiptPolicy.isEligible(session)) {
            log.warn("[RECEIPT] Policy Rejection: Session {} is in state {}. Receipt generation blocked.", 
                     sessionId, session.getStatus());
            throw new PaymentRequiredException("Payment has not been finalized. A successful transaction is required to generate a receipt.");
        }

        String receiptReference = "RCPT-" + session.getSessionId().replace("PS-", "");

        return PaymentReceiptData.builder()
                .receiptReference(receiptReference)
                .sessionId(session.getSessionId())
                .institutionName(institution.getName())
                .institutionReference(session.getInstitutionReference())
                .customerReference(session.getCustomerReference())
                .amount(session.getAmount())
                .currency(session.getCurrency())
                .paidAt(session.getCompletedAt())
                .build();
    }
}