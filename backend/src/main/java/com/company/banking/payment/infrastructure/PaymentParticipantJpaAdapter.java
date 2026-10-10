package com.company.banking.payment.infrastructure;

import com.company.banking.payment.application.port.out.PaymentParticipantPersistencePort;
import com.company.banking.payment.domain.PaymentParticipant;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Optional;

@Component
@RequiredArgsConstructor
public class PaymentParticipantJpaAdapter implements PaymentParticipantPersistencePort {

    private final PaymentParticipantJpaRepository repository;

    @Override
    public List<PaymentParticipant> findAllActive() {
        return repository.findByStatus("ACTIVE");
    }

    @Override
    public List<PaymentParticipant> findByRailAndActive(String rail) {
        if (rail == null || rail.isBlank()) {
            return findAllActive();
        }
        return repository.findByRailContainingIgnoreCaseAndStatus(rail.trim(), "ACTIVE");
    }

    @Override
    public Optional<PaymentParticipant> findByBic(String bic) {
        return repository.findByBic(bic);
    }
}
