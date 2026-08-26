package com.company.banking.transaction;

import com.company.banking.common.exception.BusinessException;
import com.company.banking.common.exception.ErrorCode;
import com.company.banking.config.BaseIntegrationTest;
import com.company.banking.transaction.api.dto.TransactionResponse;
import com.company.banking.transaction.application.TransactionAuthorizationService;
import com.company.banking.transaction.application.port.in.TransactionUseCase;
import com.company.banking.transaction.domain.AuthorizationAttempt;
import com.company.banking.transaction.domain.TransactionIntent;
import com.company.banking.transaction.domain.TransactionIntentStatus;
import com.company.banking.transaction.infrastructure.AuthorizationAttemptJpaRepository;
import com.company.banking.transaction.infrastructure.TransactionIntentJpaRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.bean.override.mockito.MockitoBean;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@SpringBootTest
@ActiveProfiles("test")
public class TransactionAuthorizationPathIT extends BaseIntegrationTest {

    @Autowired
    private TransactionAuthorizationService authorizationService;

    @Autowired
    private TransactionIntentJpaRepository intentRepository;

    @Autowired
    private AuthorizationAttemptJpaRepository attemptRepository;

    @MockitoBean
    private TransactionUseCase transactionUseCase;

    private TransactionIntent baseIntent;
    private final Long TEST_USER_ID = 808L;

    @BeforeEach
    public void setup() {
        attemptRepository.deleteAll();
        intentRepository.deleteAll();

        baseIntent = TransactionIntent.builder()
                .userId(TEST_USER_ID)
                .rail("INTERNAL")
                .sourceAccountId("ACC-SRC-101")
                .recipient("ACC-DEST-202")
                .amount(new BigDecimal("1500.00"))
                .currency("PHP")
                .fee(BigDecimal.ZERO)
                .total(new BigDecimal("1500.00"))
                .status(TransactionIntentStatus.PENDING_AUTH)
                .idempotencyKey("idem_" + UUID.randomUUID().toString())
                .build();

        baseIntent = intentRepository.save(baseIntent);
    }

    @Test
    @DisplayName("P01 (MFA Success Path): Standard push authorization, approval, and execution flow")
    public void p01_MfaSuccessPath_ShouldAuthorizeAndExecute() {
        // 1. Create Push Authorization
        AuthorizationAttempt attempt = authorizationService.createPushAuthorization(
                baseIntent.getId(),
                TEST_USER_ID,
                "192.168.1.100",
                new BigDecimal("1500.00"),
                "ACC-SRC-101",
                "ACC-DEST-202"
        );

        TransactionIntent authenticatingIntent = intentRepository.findById(baseIntent.getId()).orElseThrow();
        assertEquals(TransactionIntentStatus.AUTHENTICATING, authenticatingIntent.getStatus(), "Intent must transition to AUTHENTICATING");

        assertNotNull(attempt.getId());
        assertEquals("PENDING", attempt.getStatus());
        assertEquals("OOB_MOBILE", attempt.getAuthType());

        // 2. Approve Mobile Authorization
        authorizationService.approveMobileAuthorization(baseIntent.getId(), TEST_USER_ID);

        TransactionIntent authorizedIntent = intentRepository.findById(baseIntent.getId()).orElseThrow();
        assertEquals(TransactionIntentStatus.AUTHORIZED, authorizedIntent.getStatus(), "Intent must transition to AUTHORIZED after MFA approval");

        // 3. Execute Intent
        TransactionResponse mockResponse = TransactionResponse.builder()
                .transactionReference("TXN-MOCKED-123")
                .amount(new BigDecimal("1500.00"))
                .build();

        when(transactionUseCase.processInternalTransfer(any())).thenReturn(mockResponse);

        TransactionResponse response = authorizationService.executeIntent(baseIntent.getId(), TEST_USER_ID);

        assertNotNull(response);
        assertEquals("TXN-MOCKED-123", response.getTransactionReference());

        TransactionIntent executedIntent = intentRepository.findById(baseIntent.getId()).orElseThrow();
        assertEquals(TransactionIntentStatus.EXECUTED, executedIntent.getStatus(), "Intent must transition to EXECUTED upon completion");

        verify(transactionUseCase, times(1)).processInternalTransfer(any());
    }

    @Test
    @DisplayName("P02 (Expiration Rejection): Expired push authorization prevents approval")
    public void p02_ExpirationRejection_ShouldBlockApproval() {
        baseIntent.setStatus(TransactionIntentStatus.AUTHENTICATING);
        intentRepository.save(baseIntent);

        AuthorizationAttempt expiredAttempt = AuthorizationAttempt.builder()
                .transactionIntentId(baseIntent.getId())
                .challenge("challenge_" + UUID.randomUUID().toString())
                .status("PENDING")
                .authType("OOB_MOBILE")
                .expiresAt(LocalDateTime.now().minusMinutes(5))
                .build();
        attemptRepository.save(expiredAttempt);

        BusinessException exception = assertThrows(BusinessException.class, () -> {
            authorizationService.approveMobileAuthorization(baseIntent.getId(), TEST_USER_ID);
        });

        assertEquals(ErrorCode.UNAUTHORIZED, exception.getErrorCode());
        assertTrue(exception.getMessage().contains("Challenge expired"));

        TransactionIntent lockedIntent = intentRepository.findById(baseIntent.getId()).orElseThrow();
        assertEquals(TransactionIntentStatus.AUTHENTICATING, lockedIntent.getStatus(), "Intent status must remain locked in AUTHENTICATING");

        verifyNoInteractions(transactionUseCase);
    }

    @Test
    @DisplayName("P03 (Double Execution Prevention): Prevents execution of un-authorized or already executed intents")
    public void p03_DoubleExecutionPrevention_ShouldThrowConflict() {
        baseIntent.setStatus(TransactionIntentStatus.EXECUTED);
        baseIntent.setExecutedTransactionId(777L);
        intentRepository.save(baseIntent);

        BusinessException exception = assertThrows(BusinessException.class, () -> {
            authorizationService.executeIntent(baseIntent.getId(), TEST_USER_ID);
        });

        assertEquals(ErrorCode.FORBIDDEN, exception.getErrorCode());
        assertTrue(exception.getMessage().contains("not authorized for execution"));

        verifyNoInteractions(transactionUseCase);
    }
}
