package com.company.banking.orchestration.infrastructure;

import com.company.banking.orchestration.application.port.out.PaymentRailConfigurationPort;
import com.company.banking.orchestration.domain.PaymentRailConfiguration;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.Optional;

@Component
@RequiredArgsConstructor
public class PaymentRailConfigurationJpaAdapter implements PaymentRailConfigurationPort {

    private final PaymentRailConfigurationJpaRepository repository;

    @Override
    public Optional<PaymentRailConfiguration> findByRailName(String railName) {
        return repository.findByRailName(railName);
    }
}
