package com.company.banking.complaint.domain;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "customer_complaints")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CustomerComplaint {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "complaint_reference", nullable = false, unique = true)
    private String complaintReference;

    @Column(name = "customer_id", nullable = false)
    private Long customerId;

    @Column(nullable = false)
    private String category; // SERVICE_OUTAGE, UNAUTHORIZED_FEE, BEHAVIOR

    @Column(nullable = false)
    private String channel; // PHONE, EMAIL, APP

    @Column(nullable = false)
    private String status; // OPEN, ESCALATED, RESOLVED

    @Column(name = "sla_deadline", nullable = false)
    private LocalDateTime slaDeadline;

    @Column(name = "assigned_officer")
    private String assignedOfficer;

    @Column(name = "resolution_notes", columnDefinition = "TEXT")
    private String resolutionNotes;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "resolved_at")
    private LocalDateTime resolvedAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        if (this.status == null) {
            this.status = "OPEN";
        }
        if (this.slaDeadline == null) {
            // BSP typical SLA logic: default to 10 banking days, mocked as 14 calendar days
            this.slaDeadline = LocalDateTime.now().plusDays(14);
        }
    }
}
