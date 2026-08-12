package com.company.banking.governance.application;

import com.company.banking.common.audit.AuditEventPublisher;
import com.company.banking.common.exception.NotFoundException;
import com.company.banking.governance.domain.RegulatoryRequirement;
import com.company.banking.governance.infrastructure.RegulatoryRequirementJpaRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Slf4j
public class RegulatoryGovernanceService {

    private final RegulatoryRequirementJpaRepository regulatoryRequirementJpaRepository;
    private final AuditEventPublisher auditEventPublisher;

    @Transactional
    public RegulatoryRequirement logEvidence(Long requirementId, String evidenceQuery, String status) {
        RegulatoryRequirement req = regulatoryRequirementJpaRepository.findById(requirementId)
                .orElseThrow(() -> new NotFoundException("Regulatory Requirement not found"));

        req.setEvidenceQuery(evidenceQuery);
        req.setImplementationStatus(status);
        
        RegulatoryRequirement saved = regulatoryRequirementJpaRepository.save(req);

        log.info("[GOVERNANCE] Updated Evidence for Requirement: {}-{}", req.getRegulation(), req.getSection());
        auditEventPublisher.publishEvent("REGULATORY_EVIDENCE_UPDATED", req.getOwner(), 
                "Updated evidence for " + req.getRegulation() + " " + req.getSection(), "REQ-" + req.getId());

        return saved;
    }
}
