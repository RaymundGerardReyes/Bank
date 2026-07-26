package com.company.banking.transaction.application;

import com.company.banking.common.exception.ConflictException;
import com.company.banking.transaction.application.port.out.LedgerPersistencePort;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class IdempotencyGuardService {

    private final LedgerPersistencePort ledgerPersistencePort;

    public void checkIdempotency(String idempotencyKey) {
        if (ledgerPersistencePort.existsByIdempotencyKey(idempotencyKey)) {
            throw new ConflictException("Transaction with this idempotency key has already been processed.");
        }
    }
}
