package com.company.banking.payment.application;

import com.company.banking.common.exception.BusinessException;
import com.company.banking.common.exception.ErrorCode;
import com.company.banking.payment.api.dto.CheckoutSessionResponse;
import com.company.banking.payment.api.dto.SelectPaymentMethodRequest;
import com.company.banking.payment.domain.CheckoutSession;
import com.company.banking.payment.domain.CheckoutSessionStateTransitionPolicy;
import com.company.banking.payment.domain.CheckoutSessionStatus;
import com.company.banking.payment.domain.CheckoutPaymentMethod;
import com.company.banking.payment.domain.PaymentIntent;
import com.company.banking.payment.infrastructure.CheckoutSessionJpaRepository;
import com.company.banking.payment.infrastructure.DynamicQrPaymentJpaRepository;
import com.company.banking.payment.infrastructure.PaymentIntentJpaRepository;
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
    private final PaymentIntentJpaRepository intentRepository;
    private final DynamicQrService dynamicQrService;
    private final DynamicQrPaymentJpaRepository dynamicQrPaymentJpaRepository;

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

        // 5. Trigger Dynamic QR Generation for QR_PH if not already generated
        if (request.getPaymentMethod() == CheckoutPaymentMethod.QR_PH && session.getPaymentIntentId() != null) {
            PaymentIntent intent = intentRepository.findByIntentId(session.getPaymentIntentId())
                    .orElseThrow(() -> new BusinessException(ErrorCode.NOT_FOUND, "Payment Intent not found"));
            
            if (dynamicQrPaymentJpaRepository.findByPaymentIntentId(intent.getId()).isEmpty()) {
                dynamicQrService.generateQrForIntent(intent.getIntentId(), session.getMerchantId());
                log.info("[CHECKOUT] Dynamic QR Ph generated for session {} and intent {}", publicToken, intent.getIntentId());
            }
        }
        
        CheckoutSession savedSession = sessionRepository.save(session);

        return CheckoutSessionResponse.builder()
                .id(savedSession.getSessionId())
                .status(savedSession.getStatus().name())
                .amount(savedSession.getAmount())
                .currency(savedSession.getCurrency())
                .build();
    }
}
