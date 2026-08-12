package com.company.banking.governance.application;

import com.company.banking.common.audit.AuditEventPublisher;
import com.company.banking.common.exception.NotFoundException;
import com.company.banking.governance.domain.ComplianceEvidenceRecord;
import com.company.banking.governance.domain.RegulatoryRequirement;
import com.company.banking.governance.infrastructure.ComplianceEvidenceRecordJpaRepository;
import com.company.banking.governance.infrastructure.RegulatoryRequirementJpaRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class RegulatoryReportingService {

    private final RegulatoryRequirementJpaRepository regulatoryRequirementJpaRepository;
    private final ComplianceEvidenceRecordJpaRepository complianceEvidenceRecordJpaRepository;
    private final AuditEventPublisher auditEventPublisher;

    @Transactional
    public ComplianceEvidenceRecord generateEvidenceReport(Long requirementId, String evidenceType, String description, String officer) {
        
        RegulatoryRequirement requirement = regulatoryRequirementJpaRepository.findById(requirementId)
                .orElseThrow(() -> new NotFoundException("Regulatory Requirement not found"));

        String evidenceRef = "EVD-" + UUID.randomUUID().toString().replace("-", "").substring(0, 10).toUpperCase();

        // In a full implementation, this method would dynamically query the `api_audit_events` or `audit_events`
        // tables based on the requirement's scope, bundle them into a secure CSV/ZIP, and upload to S3, returning the URI.
        String mockFileUri = "s3://bsp-evidence-vault/2026/" + requirement.getRegulation() + "/" + evidenceRef + ".zip";

        ComplianceEvidenceRecord evidence = ComplianceEvidenceRecord.builder()
                .evidenceReference(evidenceRef)
                .regulatoryRequirementId(requirement.getId())
                .evidenceType(evidenceType)
                .description(description)
                .fileUri(mockFileUri)
                .verifiedBy(officer)
                .verifiedAt(LocalDateTime.now())
                .build();

        ComplianceEvidenceRecord saved = complianceEvidenceRecordJpaRepository.save(evidence);

        // Update the master matrix to indicate this control is formally TESTED
        requirement.setImplementationStatus("TESTED");
        requirement.setEvidenceQuery(mockFileUri);
        regulatoryRequirementJpaRepository.save(requirement);

        log.info("[GOVERNANCE] Evidence {} generated for {}", evidenceRef, requirement.getRegulation());
        
        auditEventPublisher.publishEvent("COMPLIANCE_EVIDENCE_GENERATED", officer, 
                "Generated evidence for " + requirement.getRegulation() + " " + requirement.getSection(), evidenceRef);

        return saved;
    }
}
