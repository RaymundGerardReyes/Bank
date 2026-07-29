package com.company.banking.orchestration.application.port.out;

import com.company.banking.orchestration.domain.RoutingRule;
import java.math.BigDecimal;
import java.util.Optional;

public interface RoutingRulePersistencePort {
    Optional<RoutingRule> findOptimalRule(String currency, BigDecimal amount);
}
