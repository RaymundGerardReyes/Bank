package com.company.banking.payment.application;

import com.company.banking.common.exception.BusinessException;
import com.company.banking.common.exception.ErrorCode;
import com.company.banking.payment.api.dto.CheckoutSessionResponse;
import com.company.banking.payment.api.dto.SelectPaymentMethodRequest;
import com.company.banking.payment.domain.CheckoutSession;
import com.company.banking.payment.domain.CheckoutSessionStateTransitionPolicy;
import com.company.banking.payment.domain.CheckoutSessionStatus;
import com.company.banking.payment.infrastructure.CheckoutSessionJpaRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
@Slf4j
public class CheckoutPaymentMethodService {

    private final CheckoutSessionJpaRepository sessionRepository;
    private final CheckoutSessionStateTransitionPolicy transitionPolicy;

    @Transactional
    public CheckoutSessionResponse selectPaymentMethod(String publicToken, SelectPaymentMethodRequest request) {
        log.info("[CHECKOUT] Customer selecting payment method {} for session {}", request.getPaymentMethod(), publicToken);

        // 1. Acquire Pessimistic Lock
        CheckoutSession session = sessionRepository.findBySessionIdForUpdate(publicToken)
                .orElseThrow(() -> new BusinessException(ErrorCode.NOT_FOUND, "Checkout session not found"));

        // 2. Enforce Expiration Boundary
        if (LocalDateTime.now().isAfter(session.getExpiresAt()) && session.getStatus() != CheckoutSessionStatus.EXPIRED) {
            transitionPolicy.validateTransition(session.getStatus(), CheckoutSessionStatus.EXPIRED);
            session.setStatus(CheckoutSessionStatus.EXPIRED);
            sessionRepository.save(session);
            throw new BusinessException(ErrorCode.INVALID_REQUEST, "This checkout session has expired.");
        }

        // 3. Enforce State Machine Transition
        transitionPolicy.validateTransition(session.getStatus(), CheckoutSessionStatus.PAYMENT_PENDING);

        // 4. Update State
        session.setSelectedPaymentMethod(request.getPaymentMethod().name());
        session.setStatus(CheckoutSessionStatus.PAYMENT_PENDING);
        
        CheckoutSession savedSession = sessionRepository.save(session);

        return CheckoutSessionResponse.builder()
                .id(savedSession.getSessionId())
                .status(savedSession.getStatus().name())
                .amount(savedSession.getAmount())
                .currency(savedSession.getCurrency())
                .build();
    }
}
