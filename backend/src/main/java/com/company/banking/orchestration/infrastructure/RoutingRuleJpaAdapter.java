package com.company.banking.orchestration.infrastructure;

import com.company.banking.orchestration.application.port.out.RoutingRulePersistencePort;
import com.company.banking.orchestration.domain.RoutingRule;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.Optional;

@Component
@RequiredArgsConstructor
public class RoutingRuleJpaAdapter implements RoutingRulePersistencePort {

    private final RoutingRuleJpaRepository routingRuleJpaRepository;

    @Override
    public Optional<RoutingRule> findOptimalRule(String currency, BigDecimal amount) {
        return routingRuleJpaRepository.findOptimalRule(currency, amount);
    }
}
