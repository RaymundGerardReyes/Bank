package com.company.banking.settlement.infrastructure;

import com.company.banking.settlement.domain.SettlementInstruction;
import jakarta.persistence.LockModeType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface SettlementInstructionJpaRepository extends JpaRepository<SettlementInstruction, Long> {
    
    Optional<SettlementInstruction> findBySettlementBatchId(Long batchId);
    
    Optional<SettlementInstruction> findByInstructionId(String instructionId);

    // --- PHASE 5D: Concurrency Lock for Reconciliation ---
    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("SELECT i FROM SettlementInstruction i WHERE i.instructionId = :instructionId")
    Optional<SettlementInstruction> findByInstructionIdForUpdate(@Param("instructionId") String instructionId);
}
