package com.company.banking.transaction;

import com.company.banking.common.exception.BusinessException;
import com.company.banking.transaction.application.TransactionAuthorizationService;
import com.company.banking.transaction.application.port.in.TransactionUseCase;
import com.company.banking.transaction.domain.AuthorizationAttempt;
import com.company.banking.transaction.domain.TransactionIntent;
import com.company.banking.transaction.domain.TransactionIntentStatus;
import com.company.banking.transaction.infrastructure.AuthorizationAttemptJpaRepository;
import com.company.banking.transaction.infrastructure.TransactionIntentJpaRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class TransactionAuthorizationIT {

    @Mock
    private TransactionIntentJpaRepository intentRepository;

    @Mock
    private AuthorizationAttemptJpaRepository attemptRepository;

    // FIX: Added the missing mock declaration for TransactionUseCase
    @Mock
    private TransactionUseCase transactionUseCase;

    @InjectMocks
    private TransactionAuthorizationService authorizationService;

    @Test
    void createIntent_ShouldThrowException_WhenCrossUserAccess() {
        TransactionIntent intent = TransactionIntent.builder().userId(2L).build();

        BusinessException exception = assertThrows(BusinessException.class, () -> {
            authorizationService.createIntent(intent, 1L);
        });

        assertEquals("Cannot create intent for another user", exception.getMessage());
    }

    @Test
    void executeIntent_ShouldThrowException_WhenCrossUserAccess() {
        TransactionIntent intent = TransactionIntent.builder().id(1L).userId(2L).build();
        when(intentRepository.findByIdForUpdate(1L)).thenReturn(Optional.of(intent));

        BusinessException exception = assertThrows(BusinessException.class, () -> {
            authorizationService.executeIntent(1L, 1L);
        });

        assertEquals("Cannot access this intent", exception.getMessage());
    }

    @Test
    void executeIntent_ShouldThrowException_WhenIntentNotAuthorized() {
        // Arrange
        TransactionIntent intent = TransactionIntent.builder()
                .id(1L)
                .userId(1L)
                .status(TransactionIntentStatus.PENDING_AUTH)
                .build();

        when(intentRepository.findByIdForUpdate(1L)).thenReturn(Optional.of(intent));

        // Act & Assert
        BusinessException exception = assertThrows(BusinessException.class, () -> {
            authorizationService.executeIntent(1L, 1L);
        });

        assertEquals("Intent is not authorized for execution", exception.getMessage());
    }

    @Test
    void verifyAuthorization_ShouldThrowException_WhenChallengeExpired() {
        // Arrange
        AuthorizationAttempt attempt = AuthorizationAttempt.builder()
                .transactionIntentId(1L)
                .challenge("expired-challenge")
                .expiresAt(LocalDateTime.now().minusMinutes(1))
                .build();
                
        TransactionIntent intent = TransactionIntent.builder()
                .id(1L)
                .userId(1L)
                .build();

        when(attemptRepository.findByChallenge("expired-challenge")).thenReturn(Optional.of(attempt));
        when(intentRepository.findById(1L)).thenReturn(Optional.of(intent));

        // Act & Assert
        BusinessException exception = assertThrows(BusinessException.class, () -> {
            authorizationService.verifyAuthorization(1L, 1L, "expired-challenge", "payload");
        });

        assertEquals("Challenge expired", exception.getMessage());
    }

    @Test
    void verifyAuthorization_ShouldThrowException_WhenReplayAttack() {
        // Arrange
        AuthorizationAttempt attempt = AuthorizationAttempt.builder()
                .transactionIntentId(1L)
                .challenge("used-challenge")
                .status("VERIFIED") // already used
                .expiresAt(LocalDateTime.now().plusMinutes(5))
                .build();
                
        TransactionIntent intent = TransactionIntent.builder()
                .id(1L)
                .userId(1L)
                .build();

        when(attemptRepository.findByChallenge("used-challenge")).thenReturn(Optional.of(attempt));
        when(intentRepository.findById(1L)).thenReturn(Optional.of(intent));

        // Act & Assert
        BusinessException exception = assertThrows(BusinessException.class, () -> {
            authorizationService.verifyAuthorization(1L, 1L, "used-challenge", "payload");
        });

        assertEquals("Challenge has already been used or failed", exception.getMessage());
    }

    @Test
    void executeIntent_ShouldHandleUnknownState_WhenTransactionFails() {
        TransactionIntent intent = TransactionIntent.builder()
                .id(1L)
                .userId(1L)
                .status(TransactionIntentStatus.AUTHORIZED)
                .rail("INTERNAL")
                .build();

        when(intentRepository.findByIdForUpdate(1L)).thenReturn(Optional.of(intent));
        when(transactionUseCase.processInternalTransfer(any())).thenThrow(new RuntimeException("DB Connection Timeout"));

        BusinessException exception = assertThrows(BusinessException.class, () -> {
            authorizationService.executeIntent(1L, 1L);
        });

        assertEquals("Transaction execution outcome unknown: DB Connection Timeout", exception.getMessage());
        assertEquals(TransactionIntentStatus.UNKNOWN, intent.getStatus());

        verify(intentRepository, times(1)).save(intent);
    }
}