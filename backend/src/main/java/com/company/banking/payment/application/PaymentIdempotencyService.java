package com.company.banking.payment.application;

import com.company.banking.payment.infrastructure.PaymentEventJpaRepository;
import com.company.banking.common.exception.ConflictException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class PaymentIdempotencyService {
    
    private final PaymentEventJpaRepository eventRepository;

    /**
     * Guards against duplicate webhook processing.
     * Throws a ConflictException if the idempotency key already exists.
     */
    public void checkAndGuardIdempotency(String idempotencyKey) {
        if (eventRepository.existsByIdempotencyKey(idempotencyKey)) {
            throw new ConflictException("Webhook event with this idempotency key has already been processed.");
        }
    }
}