package com.company.banking.payment.application;

import com.company.banking.common.audit.AuditEventPublisher;
import com.company.banking.common.exception.BusinessException;
import com.company.banking.common.exception.ErrorCode;
import com.company.banking.payment.api.dto.CheckoutSessionResponse;
import com.company.banking.payment.domain.*;
import com.company.banking.payment.infrastructure.CheckoutSessionJpaRepository;
import com.company.banking.payment.infrastructure.PaymentAuthorizationJpaRepository;
import com.company.banking.payment.infrastructure.PaymentIntentJpaRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
@Slf4j
public class CheckoutPaymentConfirmationService {

    private final CheckoutSessionJpaRepository sessionRepository;
    private final PaymentIntentJpaRepository intentRepository;
    private final PaymentAuthorizationJpaRepository authorizationRepository;
    private final InternalPaymentExecutionService executionService;
    private final CheckoutSessionStateTransitionPolicy transitionPolicy;
    private final AuditEventPublisher auditEventPublisher;

    @Transactional
    public CheckoutSessionResponse confirmCheckout(String publicToken) {
        log.info("[CHECKOUT CONFIRMATION] Attempting capture for session: {}", publicToken);

        // 1. Lock the Checkout Session
        CheckoutSession session = sessionRepository.findBySessionIdForUpdate(publicToken)
                .orElseThrow(() -> new BusinessException(ErrorCode.NOT_FOUND, "Checkout session not found"));

        // 2. Idempotency Check (Terminal State)
        if (session.getStatus() == CheckoutSessionStatus.PAID) {
            log.info("[CHECKOUT CONFIRMATION] Session {} is already PAID. Idempotent return.", publicToken);
            return mapToResponse(session);
        }

        // 3. Verify Session Status
        transitionPolicy.validateTransition(session.getStatus(), CheckoutSessionStatus.PAID);

        // 4. Load the Cryptographic / Logical Authorization
        PaymentAuthorization authorization = authorizationRepository.findByCheckoutSessionId(session.getSessionId())
                .orElseThrow(() -> new BusinessException(ErrorCode.NOT_FOUND, "Payment Authorization not found"));

        if (LocalDateTime.now().isAfter(authorization.getExpiresAt())) {
            auditEventPublisher.publishEvent("CHECKOUT_PAYMENT_CONFIRMATION_REJECTED", session.getMerchantId().toString(), "Authorization expired", publicToken);
            throw new BusinessException(ErrorCode.INVALID_REQUEST, "Payment authorization has expired");
        }

        // 5. Load and Verify Financial Intent Congruence
        PaymentIntent intent = intentRepository.findByIntentId(session.getPaymentIntentId())
                .orElseThrow(() -> new BusinessException(ErrorCode.NOT_FOUND, "Payment Intent not found"));

        if (intent.getAmount().compareTo(authorization.getAmount()) != 0 || 
            intent.getAmount().compareTo(session.getAmount()) != 0) {
            auditEventPublisher.publishEvent("CHECKOUT_PAYMENT_CONFIRMATION_REJECTED", session.getMerchantId().toString(), "Amount tampering detected", publicToken);
            throw new BusinessException(ErrorCode.CONFLICT, "CRITICAL: Amount mismatch between session, intent, and authorization");
        }

        if (PaymentIntentStatus.AUTHORIZED != intent.getStatus()) {
            throw new BusinessException(ErrorCode.CONFLICT, "Payment Intent is not in an AUTHORIZED state");
        }

        auditEventPublisher.publishEvent("CHECKOUT_PAYMENT_CAPTURE_REQUESTED", session.getMerchantId().toString(), "Executing capture via internal engine", publicToken);

        // 6. Delegate Financial Mutation to the Phase 4 Engine
        try {
            // Reusing the existing execution core. The engine handles the balance deduction, ledger, and tx creation.
            executionService.capturePayment(intent.getIntentId(), session.getMerchantId(), authorization.getAuthorizationReference());
        } catch (Exception e) {
            log.error("[CHECKOUT CONFIRMATION] Capture failed for session {}: {}", publicToken, e.getMessage());
            auditEventPublisher.publishEvent("CHECKOUT_PAYMENT_CAPTURE_FAILED", session.getMerchantId().toString(), e.getMessage(), publicToken);
            // We do NOT mark the session as PAYMENT_FAILED on transient errors so the customer can retry, 
            // unless it's a hard decline. For now, bubble up the exception to trigger a DB rollback.
            throw e; 
        }

        // 7. Transition States
        session.setStatus(CheckoutSessionStatus.PAID);
        sessionRepository.save(session);
        
        // Authorization is effectively consumed
        authorization.setStatus(PaymentAuthorizationStatus.CANCELLED); // Or a specific CONSUMED state
        authorizationRepository.save(authorization);

        auditEventPublisher.publishEvent("CHECKOUT_PAYMENT_CAPTURED", session.getMerchantId().toString(), "Successfully captured " + session.getAmount(), publicToken);
        log.info("[CHECKOUT CONFIRMATION] Session {} successfully marked as PAID.", publicToken);

        return mapToResponse(session);
    }

    private CheckoutSessionResponse mapToResponse(CheckoutSession session) {
        return CheckoutSessionResponse.builder()
                .id(session.getSessionId())
                .status(session.getStatus().name())
                .amount(session.getAmount())
                .currency(session.getCurrency())
                .build(); // Exposing ONLY safe customer-facing properties
    }
}
