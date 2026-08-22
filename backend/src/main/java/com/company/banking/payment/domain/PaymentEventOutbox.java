package com.company.banking.payment.domain;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.time.LocalDateTime;

@Entity
@Table(name = "payment_event_outbox")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PaymentEventOutbox {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false, updatable = false)
    private String eventId; // e.g., evt_01K8XYZ...

    @Column(nullable = false, updatable = false)
    private Long merchantId;

    @Column(nullable = false, updatable = false)
    private String aggregateType; // e.g., "CheckoutSession"

    @Column(nullable = false, updatable = false)
    private String aggregateId; // e.g., cs_01K8XYZ...

    @Column(name = "sequence", nullable = false, updatable = false)
    private Integer sequence;

    @Column(unique = true, nullable = false, updatable = false)
    private String idempotencyKey;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, updatable = false)
    private PaymentEventType eventType;

    @Column(name = "api_version", nullable = false, updatable = false)
    private String apiVersion;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(nullable = false, columnDefinition = "jsonb")
    private String payload; // Canonical JSON data

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    private LocalDateTime publishedAt;
    private LocalDateTime deliveredAt;

    @Column(nullable = false)
    private Integer attemptCount;

    private LocalDateTime nextAttemptAt;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private PaymentEventOutboxStatus status;

    @Column(columnDefinition = "text")
    private String lastError;

    @Column(name = "locked_at")
    private LocalDateTime lockedAt;

    @Column(name = "locked_by")
    private String lockedBy;

    @Column(name = "last_http_status")
    private Integer lastHttpStatus;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        if (this.attemptCount == null) {
            this.attemptCount = 0;
        }
        if (this.status == null) {
            this.status = PaymentEventOutboxStatus.PENDING;
        }
        if (this.apiVersion == null) {
            this.apiVersion = "v1";
        }
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
}
