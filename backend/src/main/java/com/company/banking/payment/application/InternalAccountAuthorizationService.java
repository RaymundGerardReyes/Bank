package com.company.banking.payment.application;

import com.company.banking.account.application.port.out.AccountPersistencePort;
import com.company.banking.account.domain.Account;
import com.company.banking.common.enums.AccountStatus;
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
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class InternalAccountAuthorizationService {

    private final CheckoutSessionJpaRepository sessionRepository;
    private final PaymentIntentJpaRepository intentRepository;
    private final PaymentAuthorizationJpaRepository authorizationRepository;
    private final AccountPersistencePort accountPersistencePort;

    @Transactional
    public CheckoutSessionResponse authorizeInternalAccount(String checkoutToken, String customerAccountNumber) {
        log.info("[CHECKOUT AUTHORIZATION] Attempting authorization for session {}", checkoutToken);

        // 1. Lock the Checkout Session
        CheckoutSession session = sessionRepository.findBySessionIdForUpdate(checkoutToken)
                .orElseThrow(() -> new BusinessException(ErrorCode.NOT_FOUND, "Checkout session not found"));

        // 2. Idempotency & State Checks
        if (session.getStatus() == CheckoutSessionStatus.AUTHORIZED) {
            log.info("[CHECKOUT AUTHORIZATION] Session {} is already authorized. Idempotent return.", checkoutToken);
            return mapToResponse(session);
        }

        if (session.getStatus() != CheckoutSessionStatus.PAYMENT_PENDING) {
            throw new BusinessException(ErrorCode.INVALID_REQUEST, 
                "Cannot authorize session in state: " + session.getStatus());
        }

        if (LocalDateTime.now().isAfter(session.getExpiresAt())) {
            session.setStatus(CheckoutSessionStatus.EXPIRED);
            sessionRepository.save(session);
            throw new BusinessException(ErrorCode.INVALID_REQUEST, "Checkout session has expired");
        }

        // 3. Lock and verify authoritative Payment Intent
        PaymentIntent intent = intentRepository.findByIntentId(session.getPaymentIntentId())
                .orElseThrow(() -> new BusinessException(ErrorCode.NOT_FOUND, "Payment Intent not found"));

        if (intent.getAmount().compareTo(session.getAmount()) != 0) {
            throw new BusinessException(ErrorCode.CONFLICT, "CRITICAL: Session and Intent amount mismatch");
        }

        // 4. Verify Customer Account Balance (No deduction yet!)
        Account account = accountPersistencePort.findByAccountNumber(customerAccountNumber)
                .orElseThrow(() -> new BusinessException(ErrorCode.NOT_FOUND, "Customer account not found"));

        if (account.getStatus() != AccountStatus.ACTIVE) {
            throw new BusinessException(ErrorCode.INVALID_REQUEST, "Account is not active");
        }

        if (account.getBalance().compareTo(intent.getAmount()) < 0) {
            throw new BusinessException(ErrorCode.INSUFFICIENT_FUNDS, "Insufficient funds for authorization");
        }

        // 5. Create Authorization Record
        PaymentAuthorization authorization = PaymentAuthorization.builder()
                .authorizationReference("auth_" + UUID.randomUUID().toString().replace("-", "").substring(0, 24))
                .checkoutSessionId(session.getSessionId())
                .paymentIntentId(intent.getIntentId())
                .customerAccountNumber(account.getAccountNumber())
                .merchantId(session.getMerchantId())
                .amount(intent.getAmount())
                .currency(intent.getCurrency())
                .status(PaymentAuthorizationStatus.AUTHORIZED)
                .authorizedAt(LocalDateTime.now())
                .expiresAt(LocalDateTime.now().plusDays(7))
                .build();
        authorizationRepository.save(authorization);

        // 6. Transition Payment Intent
        intent.setStatus(PaymentIntentStatus.AUTHORIZED);
        intent.setCustomerAccountNumber(account.getAccountNumber());
        intentRepository.save(intent);

        // 7. Transition Checkout Session
        session.setStatus(CheckoutSessionStatus.AUTHORIZED);
        CheckoutSession savedSession = sessionRepository.save(session);

        return mapToResponse(savedSession);
    }

    private CheckoutSessionResponse mapToResponse(CheckoutSession session) {
        return CheckoutSessionResponse.builder()
                .id(session.getSessionId())
                .status(session.getStatus().name())
                .amount(session.getAmount())
                .currency(session.getCurrency())
                .build();
    }
}
