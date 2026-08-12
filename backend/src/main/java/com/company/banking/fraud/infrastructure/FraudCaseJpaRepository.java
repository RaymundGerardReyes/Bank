package com.company.banking.fraud.infrastructure;

import com.company.banking.fraud.domain.FraudCase;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface FraudCaseJpaRepository extends JpaRepository<FraudCase, Long> {
    Optional<FraudCase> findByFraudReference(String fraudReference);
}
