package com.company.banking.orchestration.infrastructure;

import com.company.banking.orchestration.domain.RoutingRule;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.Optional;

@Repository
public interface RoutingRuleJpaRepository extends JpaRepository<RoutingRule, Long> {

    @Query("SELECT r FROM RoutingRule r WHERE r.currency = :currency AND :amount >= r.minAmount AND (:amount <= r.maxAmount OR r.maxAmount IS NULL)")
    Optional<RoutingRule> findOptimalRule(@Param("currency") String currency, @Param("amount") BigDecimal amount);
}
