package com.company.banking.governance.domain;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "regulatory_requirements")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RegulatoryRequirement {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String regulation; // MORPS, MORB, AFASA, NRPS

    @Column(nullable = false)
    private String section; // e.g. "Sec 154", "Circular 1213"

    @Column(nullable = false, columnDefinition = "TEXT")
    private String applicability; // e.g. "Applies to all Operator of Payment Systems"

    @Column(name = "control_description", nullable = false, columnDefinition = "TEXT")
    private String controlDescription;

    @Column(name = "implementation_status", nullable = false)
    private String implementationStatus; // PLANNED, IMPLEMENTED, TESTED, EXEMPT

    @Column(name = "evidence_query", columnDefinition = "TEXT")
    private String evidenceQuery;

    @Column(nullable = false)
    private String owner;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        if (this.implementationStatus == null) {
            this.implementationStatus = "PLANNED";
        }
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
}
