package com.company.banking.orchestration.infrastructure;

import com.company.banking.orchestration.domain.PaymentRailConfiguration;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface PaymentRailConfigurationJpaRepository extends JpaRepository<PaymentRailConfiguration, Long> {
    Optional<PaymentRailConfiguration> findByRailName(String railName);
}
