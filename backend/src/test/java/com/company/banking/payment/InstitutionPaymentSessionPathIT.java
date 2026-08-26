package com.company.banking.payment;

import com.company.banking.common.exception.BusinessException;
import com.company.banking.common.exception.ErrorCode;
import com.company.banking.config.BaseIntegrationTest;
import com.company.banking.payment.api.dto.CreatePaymentSessionRequest;
import com.company.banking.payment.api.dto.PaymentSessionApiResponse;
import com.company.banking.payment.application.InstitutionPaymentService;
import com.company.banking.payment.domain.PaymentSession;
import com.company.banking.payment.domain.PaymentSessionStatus;
import com.company.banking.payment.infrastructure.PaymentSessionJpaRepository;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;

public class InstitutionPaymentSessionPathIT extends BaseIntegrationTest {

    @Autowired
    private InstitutionPaymentService paymentService;

    @Autowired
    private PaymentSessionJpaRepository sessionRepository;

    private final Long INSTITUTION_ID = 1001L;

    @Test
    @DisplayName("P01: Session Creation Golden Path")
    void testSessionCreationGoldenPath() {
        CreatePaymentSessionRequest request = new CreatePaymentSessionRequest();
        request.setInstitutionReference("INV-" + UUID.randomUUID().toString().substring(0, 8));
        request.setAmount(new BigDecimal("250.00"));
        request.setCurrency("PHP");
        request.setCallbackUrl("https://merchant.example.com/callback");

        PaymentSessionApiResponse session = paymentService.createSession(INSTITUTION_ID, request);

        assertNotNull(session);
        assertTrue(session.getSessionId().startsWith("PS-"), "Session ID must be properly prefixed");
        assertEquals("ACTIVE", session.getStatus());
        assertTrue(session.getExpiresAt().isAfter(LocalDateTime.now().plusMinutes(29)), "Session must expire in 30 minutes");
    }

    @Test
    @DisplayName("P02: Cross-Institution Session Access (IDOR Guard)")
    void testCrossInstitutionSessionAccess() {
        CreatePaymentSessionRequest request = new CreatePaymentSessionRequest();
        request.setInstitutionReference("INV-" + UUID.randomUUID().toString().substring(0, 8));
        request.setAmount(new BigDecimal("250.00"));
        request.setCurrency("PHP");
        request.setCallbackUrl("https://merchant.example.com/callback");

        PaymentSessionApiResponse session = paymentService.createSession(INSTITUTION_ID, request);
        Long maliciousInstitutionId = 2002L;

        BusinessException exception = assertThrows(BusinessException.class, () -> {
            paymentService.getSession(maliciousInstitutionId, session.getSessionId());
        });

        assertEquals(ErrorCode.NOT_FOUND, exception.getErrorCode(), "Must throw NOT_FOUND to prevent exposing the existence of other institutions' sessions");
    }

    @Test
    @DisplayName("P03: Cancel After Completion Guard")
    void testCancelAfterCompletionGuard() {
        CreatePaymentSessionRequest request = new CreatePaymentSessionRequest();
        request.setInstitutionReference("INV-" + UUID.randomUUID().toString().substring(0, 8));
        request.setAmount(new BigDecimal("250.00"));
        request.setCurrency("PHP");
        request.setCallbackUrl("https://merchant.example.com/callback");

        PaymentSessionApiResponse sessionResp = paymentService.createSession(INSTITUTION_ID, request);

        PaymentSession dbSession = sessionRepository.findBySessionIdAndInstitutionId(sessionResp.getSessionId(), INSTITUTION_ID).orElseThrow();
        dbSession.setStatus(PaymentSessionStatus.SUCCESS);
        sessionRepository.save(dbSession);

        BusinessException exception = assertThrows(BusinessException.class, () -> {
            paymentService.cancelSession(INSTITUTION_ID, sessionResp.getSessionId());
        });

        assertEquals(ErrorCode.INVALID_REQUEST, exception.getErrorCode());
        assertTrue(exception.getMessage().contains("Cannot cancel a completed payment session"));

        PaymentSession updatedSession = sessionRepository.findById(dbSession.getId()).orElseThrow();
        assertEquals(PaymentSessionStatus.SUCCESS, updatedSession.getStatus(), "Session status must strictly remain SUCCESS");
    }
}
