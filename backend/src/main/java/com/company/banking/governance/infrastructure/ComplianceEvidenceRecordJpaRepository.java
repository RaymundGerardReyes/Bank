package com.company.banking.governance.infrastructure;

import com.company.banking.governance.domain.ComplianceEvidenceRecord;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ComplianceEvidenceRecordJpaRepository extends JpaRepository<ComplianceEvidenceRecord, Long> {
    List<ComplianceEvidenceRecord> findByRegulatoryRequirementId(Long regulatoryRequirementId);
}
