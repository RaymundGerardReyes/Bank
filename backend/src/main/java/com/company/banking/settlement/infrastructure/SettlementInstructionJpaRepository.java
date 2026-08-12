package com.company.banking.settlement.infrastructure;

import com.company.banking.settlement.domain.SettlementInstruction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface SettlementInstructionJpaRepository extends JpaRepository<SettlementInstruction, Long> {
    Optional<SettlementInstruction> findByInstructionId(String instructionId);
}
