package com.company.banking.settlement.infrastructure;

import com.company.banking.settlement.domain.SettlementException;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface SettlementExceptionJpaRepository extends JpaRepository<SettlementException, Long> {
    Optional<SettlementException> findByExceptionReference(String exceptionReference);
}
