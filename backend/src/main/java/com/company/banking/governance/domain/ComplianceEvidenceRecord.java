package com.company.banking.governance.domain;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "compliance_evidence_records")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ComplianceEvidenceRecord {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "evidence_reference", nullable = false, unique = true)
    private String evidenceReference;

    @Column(name = "regulatory_requirement_id", nullable = false)
    private Long regulatoryRequirementId;

    @Column(name = "evidence_type", nullable = false)
    private String evidenceType; // AUDIT_LOG, CONFIGURATION, INCIDENT_REPORT, PEN_TEST

    @Column(nullable = false, columnDefinition = "TEXT")
    private String description;

    @Column(name = "file_uri")
    private String fileUri; // S3 path or internal blob reference to the exported zip

    @Column(name = "verified_by")
    private String verifiedBy;

    @Column(name = "verified_at")
    private LocalDateTime verifiedAt;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
    }
}
