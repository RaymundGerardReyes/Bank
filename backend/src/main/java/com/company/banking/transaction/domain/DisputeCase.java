package com.company.banking.transaction.domain;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "dispute_cases")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DisputeCase {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "customer_id", nullable = false)
    private Long customerId;

    @Column(name = "transaction_reference", nullable = false)
    private String transactionReference;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String reason;

    @Column(nullable = false)
    private String status; // FILED, UNDER_INVESTIGATION, RESOLVED_FAVOR_CUSTOMER, RESOLVED_FAVOR_BANK

    @Column(name = "filed_at", nullable = false, updatable = false)
    private LocalDateTime filedAt;

    @Column(name = "resolved_at")
    private LocalDateTime resolvedAt;

    @Column(name = "resolution_notes", columnDefinition = "TEXT")
    private String resolutionNotes;

    @PrePersist
    protected void onCreate() {
        this.filedAt = LocalDateTime.now();
        if (this.status == null) {
            this.status = "FILED";
        }
    }
}
