package com.company.banking.aml.domain;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "suspicious_transaction_reports")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SuspiciousTransactionReport {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "case_id", nullable = false)
    private Long caseId;

    @Column(name = "customer_id", nullable = false)
    private Long customerId;

    @Column(name = "transaction_references", columnDefinition = "TEXT", nullable = false)
    private String transactionReferences;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String narrative;

    @Column(nullable = false)
    private String status; // DRAFT, SUBMITTED_TO_AMLC, REJECTED

    @Column(name = "submitted_at")
    private LocalDateTime submittedAt;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        if (this.status == null) {
            this.status = "DRAFT";
        }
    }
}
