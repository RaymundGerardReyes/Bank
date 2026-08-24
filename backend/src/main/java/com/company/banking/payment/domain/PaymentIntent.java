package com.company.banking.payment.domain;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "payment_intents")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PaymentIntent {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Version
    private Long version;

    @Column(name = "intent_id", nullable = false, unique = true)
    private String intentId;

    @Column(name = "merchant_id", nullable = false)
    private Long merchantId;

    @Column(name = "customer_account_number")
    private String customerAccountNumber;

    @Column(nullable = false)
    private BigDecimal amount;

    @Column(name = "currency", nullable = false)
    private String currency;

    @Column(name = "fee_amount", nullable = false)
    private BigDecimal feeAmount;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private PaymentIntentStatus status;
    
    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(name = "idempotency_key", unique = true)
    private String idempotencyKey;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        if (this.feeAmount == null) {
            this.feeAmount = BigDecimal.ZERO;
        }
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
}
