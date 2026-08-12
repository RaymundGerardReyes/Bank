package com.company.banking.settlement.infrastructure;

import com.company.banking.settlement.domain.SettlementWindow;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface SettlementWindowJpaRepository extends JpaRepository<SettlementWindow, Long> {
    Optional<SettlementWindow> findByWindowReference(String windowReference);
}
