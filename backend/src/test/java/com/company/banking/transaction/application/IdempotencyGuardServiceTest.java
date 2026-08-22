package com.company.banking.transaction.application;

import com.company.banking.common.exception.ConflictException;
import com.company.banking.transaction.application.port.out.LedgerPersistencePort;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
public class IdempotencyGuardServiceTest {

    @Mock
    private LedgerPersistencePort ledgerPersistencePort;

    @InjectMocks
    private IdempotencyGuardService idempotencyGuardService;

    @Test
    public void checkIdempotency_ShouldThrowConflictException_WhenKeyExists() {
        String duplicateKey = "idem-key-123";
        when(ledgerPersistencePort.existsByIdempotencyKey(duplicateKey)).thenReturn(true);

        assertThrows(ConflictException.class, () -> {
            idempotencyGuardService.checkIdempotency(duplicateKey);
        });

        verify(ledgerPersistencePort).existsByIdempotencyKey(duplicateKey);
    }

    @Test
    public void checkIdempotency_ShouldPass_WhenKeyIsNew() {
        String newKey = "idem-key-456";
        when(ledgerPersistencePort.existsByIdempotencyKey(newKey)).thenReturn(false);

        // Should not throw any exception
        idempotencyGuardService.checkIdempotency(newKey);

        verify(ledgerPersistencePort).existsByIdempotencyKey(newKey);
    }
}
