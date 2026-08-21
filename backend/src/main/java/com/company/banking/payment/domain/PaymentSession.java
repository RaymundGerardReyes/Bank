package com.company.banking.payment.domain;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "payment_sessions")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PaymentSession {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Version
    @Column(nullable = false)
    @Builder.Default
    private Long version = 0L;

    @Column(name = "session_id", unique = true, nullable = false)
    private String sessionId;

    @Column(name = "institution_id", nullable = false)
    private Long institutionId;

    @Column(name = "institution_reference", nullable = false)
    private String institutionReference;

    @Column(name = "customer_reference")
    private String customerReference;

    @Column(nullable = false)
    private BigDecimal amount;

    @Column(nullable = false)
    private String currency;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private PaymentSessionStatus status;

    @Column(name = "callback_url", columnDefinition = "TEXT")
    private String callbackUrl;

    @Column(name = "expires_at")
    private LocalDateTime expiresAt;

    @Column(name = "completed_at")
    private LocalDateTime completedAt;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        if (this.status == null) {
            this.status = PaymentSessionStatus.CREATED;
        }
    }
}