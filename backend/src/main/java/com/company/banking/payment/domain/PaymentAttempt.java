package com.company.banking.payment.domain;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "payment_attempts")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PaymentAttempt {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Version
    @Column(nullable = false)
    @Builder.Default
    private Long version = 0L;

    @Column(name = "attempt_id", unique = true, nullable = false)
    private String attemptId;

    @Column(name = "payment_intent_id", nullable = false)
    private Long paymentIntentId;

    // --- NEW FIELD FOR PHASE C (Safely Added) ---
    @Column(name = "payment_session_id")
    private String paymentSessionId;

    @Column(nullable = false)
    private String provider;

    @Column(name = "provider_reference")
    private String providerReference;

    @Column(name = "checkout_url", columnDefinition = "TEXT")
    private String checkoutUrl;

    @Column(nullable = false)
    private String status; // CREATED, PROCESSING, SUCCESS, FAILED, CANCELLED, TIMEOUT

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "expires_at")
    private LocalDateTime expiresAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        if (this.status == null) {
            this.status = "CREATED";
        }
    }
}