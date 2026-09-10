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

import com.company.banking.notification.application.port.out.PushNotificationPort;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.contains;
import static org.mockito.ArgumentMatchers.eq;
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

    @MockitoBean
    private PushNotificationPort pushNotificationPort;

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

    @Test
    @DisplayName("P04 (Denial Path): Mobile user rejects authorization request")
    public void p04_MobileDenialPath_ShouldRejectAndFailIntent() {
        // 1. Create Push Authorization
        AuthorizationAttempt attempt = authorizationService.createPushAuthorization(
                baseIntent.getId(),
                TEST_USER_ID,
                "192.168.1.100",
                new BigDecimal("1500.00"),
                "ACC-SRC-101",
                "ACC-DEST-202"
        );

        assertEquals("PENDING", attempt.getStatus());

        // 2. Deny Authorization
        authorizationService.denyMobileAuthorization(baseIntent.getId(), TEST_USER_ID);

        // 3. Verify attempt status is DENIED and intent status is FAILED
        AuthorizationAttempt deniedAttempt = attemptRepository.findById(attempt.getId()).orElseThrow();
        assertEquals("DENIED", deniedAttempt.getStatus(), "Attempt status must be DENIED");

        TransactionIntent failedIntent = intentRepository.findById(baseIntent.getId()).orElseThrow();
        assertEquals(TransactionIntentStatus.FAILED, failedIntent.getStatus(), "Intent status must transition to FAILED");

        // 4. Execution must be blocked
        BusinessException exception = assertThrows(BusinessException.class, () -> {
            authorizationService.executeIntent(baseIntent.getId(), TEST_USER_ID);
        });
        assertEquals(ErrorCode.FORBIDDEN, exception.getErrorCode());
    }

    @Test
    @DisplayName("P05 (Push Notification Parity): createPushAuthorization triggers real-time push to target user")
    public void p05_PushNotificationParity_ShouldDispatchRealtimeAlert() {
        authorizationService.createPushAuthorization(
                baseIntent.getId(),
                TEST_USER_ID,
                "192.168.1.50",
                new BigDecimal("1500.00"),
                "ACC-SRC-101",
                "ACC-DEST-202"
        );

        verify(pushNotificationPort, times(1)).sendPush(
                eq(TEST_USER_ID.toString()),
                eq("Authorize Transfer Request"),
                contains("1500.00"),
                eq("/authorizations/pending"),
                any()
        );
    }

    @Test
    @DisplayName("P06 (Multi-User Isolation): User B cannot query, approve, or deny User A's authorization")
    public void p06_MultiUserIsolation_ShouldBlockUnauthorizedUser() {
        authorizationService.createPushAuthorization(
                baseIntent.getId(),
                TEST_USER_ID,
                "192.168.1.100",
                new BigDecimal("1500.00"),
                "ACC-SRC-101",
                "ACC-DEST-202"
        );

        Long ATTACKER_USER_ID = 999L;

        // User B queries pending: must not see User A's pending authorizations
        List<AuthorizationAttempt> attackerPending = authorizationService.getPendingMobileAuthorizations(ATTACKER_USER_ID);
        assertTrue(attackerPending.isEmpty(), "Attacker must not see other users' pending authorizations");

        // User B attempts to approve User A's authorization: must throw FORBIDDEN
        BusinessException approveEx = assertThrows(BusinessException.class, () -> {
            authorizationService.approveMobileAuthorization(baseIntent.getId(), ATTACKER_USER_ID);
        });
        assertEquals(ErrorCode.FORBIDDEN, approveEx.getErrorCode());

        // User B attempts to deny User A's authorization: must throw FORBIDDEN
        BusinessException denyEx = assertThrows(BusinessException.class, () -> {
            authorizationService.denyMobileAuthorization(baseIntent.getId(), ATTACKER_USER_ID);
        });
        assertEquals(ErrorCode.FORBIDDEN, denyEx.getErrorCode());
    }

    @Test
    @DisplayName("P07 (Cross-Device Dynamic Polling Sequence): Web frontend polling lifecycle matches mobile state transitions")
    public void p07_CrossDeviceDynamicPolling_MatchesLifecycle() {
        // Initial state before push request
        assertEquals("PENDING_AUTH", authorizationService.getAuthorizationStatus(baseIntent.getId(), TEST_USER_ID));

        // 1. Web triggers push authorization -> Intent transitions to AUTHENTICATING
        authorizationService.createPushAuthorization(
                baseIntent.getId(),
                TEST_USER_ID,
                "10.0.0.1",
                new BigDecimal("1500.00"),
                "ACC-SRC-101",
                "ACC-DEST-202"
        );
        assertEquals("AUTHENTICATING", authorizationService.getAuthorizationStatus(baseIntent.getId(), TEST_USER_ID));

        // 2. Mobile app queries pending authorizations and sees 1 item
        List<AuthorizationAttempt> pending = authorizationService.getPendingMobileAuthorizations(TEST_USER_ID);
        assertEquals(1, pending.size());
        assertEquals("ACC-SRC-101", pending.get(0).getSourceAccount());
        assertEquals("ACC-DEST-202", pending.get(0).getDestinationAccount());

        // 3. Mobile user clicks "Confirm & Authorize" -> Intent transitions to AUTHORIZED
        authorizationService.approveMobileAuthorization(baseIntent.getId(), TEST_USER_ID);
        assertEquals("AUTHORIZED", authorizationService.getAuthorizationStatus(baseIntent.getId(), TEST_USER_ID));

        // 4. Pending list is now empty for mobile
        assertTrue(authorizationService.getPendingMobileAuthorizations(TEST_USER_ID).isEmpty());

        // 5. Web frontend polling detects AUTHORIZED and calls executeIntent
        TransactionResponse mockResponse = TransactionResponse.builder()
                .transactionReference("TXN-POLL-OK")
                .amount(new BigDecimal("1500.00"))
                .build();
        when(transactionUseCase.processInternalTransfer(any())).thenReturn(mockResponse);

        TransactionResponse result = authorizationService.executeIntent(baseIntent.getId(), TEST_USER_ID);
        assertNotNull(result);
        assertEquals("EXECUTED", authorizationService.getAuthorizationStatus(baseIntent.getId(), TEST_USER_ID));
    }
}
