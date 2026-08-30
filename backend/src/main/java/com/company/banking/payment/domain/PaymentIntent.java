package com.company.banking.payment.domain;

import com.company.banking.common.exception.BusinessException;
import com.company.banking.common.exception.ErrorCode;
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

    @Column(name = "intent_id", unique = true, nullable = false)
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

    @Column(name = "qr_generation_started_at")
    private LocalDateTime qrGenerationStartedAt;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
        if (this.feeAmount == null) {
            this.feeAmount = BigDecimal.ZERO;
        }
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }

    /**
     * Enforces the explicit Domain State Machine for Payment Intents.
     */
    public void transitionTo(PaymentIntentStatus newStatus) {
        boolean valid = false;
        
        switch (this.status) {
            case CREATED:
            case PENDING:
                valid = (newStatus == PaymentIntentStatus.QR_GENERATING || newStatus == PaymentIntentStatus.CANCELLED);
                break;
            case QR_GENERATING:
                valid = (newStatus == PaymentIntentStatus.AWAITING_PAYMENT || newStatus == PaymentIntentStatus.FAILED);
                break;
            case AWAITING_PAYMENT:
                valid = (newStatus == PaymentIntentStatus.PAID || newStatus == PaymentIntentStatus.EXPIRED || newStatus == PaymentIntentStatus.CANCELLED);
                break;
            case PAID:
            case SETTLED:
            case EXPIRED:
            case CANCELLED:
            case FAILED:
                // Terminal states explicitly reject all further transitions
                valid = false;
                break;
            default:
                valid = false;
        }

        if (!valid) {
            throw new BusinessException(
                ErrorCode.INVALID_REQUEST, 
                "Invalid state transition from " + this.status + " to " + newStatus
            );
        }
        
        this.status = newStatus;
        
        // Invariant: QR_GENERATING requires a non-null timestamp. 
        // We retain it after transitioning as an immutable audit snapshot.
        if (newStatus == PaymentIntentStatus.QR_GENERATING) {
            this.qrGenerationStartedAt = LocalDateTime.now();
        }
    }
}
