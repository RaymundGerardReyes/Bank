package com.company.banking.settlement.infrastructure;

import com.company.banking.settlement.domain.SettlementBatch;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SettlementBatchJpaRepository extends JpaRepository<SettlementBatch, Long> {
    List<SettlementBatch> findByStatus(String status);
    java.util.Optional<SettlementBatch> findByBatchReference(String batchReference);
}
