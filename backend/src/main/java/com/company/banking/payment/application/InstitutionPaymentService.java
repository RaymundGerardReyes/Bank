package com.company.banking.payment.application;

import com.company.banking.common.exception.BusinessException;
import com.company.banking.common.exception.ErrorCode;
import com.company.banking.payment.api.dto.CreatePaymentSessionRequest;
import com.company.banking.payment.api.dto.PaymentSessionApiResponse;
import com.company.banking.payment.domain.PaymentSession;
import com.company.banking.payment.domain.PaymentSessionStatus;
import com.company.banking.payment.infrastructure.PaymentSessionJpaRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class InstitutionPaymentService {

    private final PaymentSessionJpaRepository sessionRepository;

    @Value("${NEXT_PUBLIC_APP_URL:http://localhost:3000}")
    private String frontendUrl;

    @Transactional
    public PaymentSessionApiResponse createSession(Long institutionId, CreatePaymentSessionRequest request) {
        log.info("[PAYMENT SESSION] Creating session for institutionId: {}, Ref: {}", institutionId, request.getInstitutionReference());

        String sessionId = "PS-" + UUID.randomUUID().toString();

        PaymentSession session = PaymentSession.builder()
                .sessionId(sessionId)
                .institutionId(institutionId)
                .institutionReference(request.getInstitutionReference())
                .customerReference(request.getCustomerReference())
                .amount(request.getAmount())
                .currency(request.getCurrency())
                .description(request.getDescription())
                .callbackUrl(request.getCallbackUrl())
                .status(PaymentSessionStatus.ACTIVE) // Set active immediately for frontend checkout
                .expiresAt(LocalDateTime.now().plusMinutes(30)) // Default expiration
                .build();

        PaymentSession savedSession = sessionRepository.save(session);
        log.info("[PAYMENT SESSION] Session {} created successfully.", sessionId);

        return PaymentSessionApiResponse.fromEntity(savedSession, frontendUrl);
    }

    @Transactional(readOnly = true)
    public PaymentSessionApiResponse getSession(Long institutionId, String sessionId) {
        PaymentSession session = sessionRepository.findBySessionIdAndInstitutionId(sessionId, institutionId)
                .orElseThrow(() -> new BusinessException(ErrorCode.NOT_FOUND, "Payment session not found"));

        return PaymentSessionApiResponse.fromEntity(session, frontendUrl);
    }

    @Transactional
    public PaymentSessionApiResponse cancelSession(Long institutionId, String sessionId) {
        PaymentSession session = sessionRepository.findBySessionIdAndInstitutionId(sessionId, institutionId)
                .orElseThrow(() -> new BusinessException(ErrorCode.NOT_FOUND, "Payment session not found"));

        if (session.getStatus() == PaymentSessionStatus.SUCCESS || session.getStatus() == PaymentSessionStatus.COMPLETED) {
            throw new BusinessException(ErrorCode.INVALID_REQUEST, "Cannot cancel a completed payment session.");
        }

        session.setStatus(PaymentSessionStatus.FAILED);
        PaymentSession savedSession = sessionRepository.save(session);
        log.info("[PAYMENT SESSION] Session {} cancelled by institution.", sessionId);

        return PaymentSessionApiResponse.fromEntity(savedSession, frontendUrl);
    }
}