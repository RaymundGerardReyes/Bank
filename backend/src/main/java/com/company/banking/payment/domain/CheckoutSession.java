package com.company.banking.payment.domain;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "checkout_sessions", uniqueConstraints = {
    @UniqueConstraint(name = "uk_merchant_idempotency", columnNames = {"merchant_id", "idempotency_key"})
})
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CheckoutSession {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "session_id", unique = true, nullable = false, updatable = false)
    private String sessionId; // Opaque cs_... token

    @Column(name = "merchant_id", nullable = false, updatable = false)
    private Long merchantId;

    @Column(name = "idempotency_key", nullable = false, updatable = false)
    private String idempotencyKey;

    @Column(name = "payment_intent_id", nullable = false, updatable = false)
    private String paymentIntentId; // References PaymentIntent.intentId (pi_...)

    @Column(nullable = false, updatable = false)
    private BigDecimal amount;

    @Column(name = "currency", nullable = false, updatable = false)
    private String currency;

    private String description;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private CheckoutSessionStatus status;

    @Column(name = "selected_payment_method")
    private String selectedPaymentMethod;

    @Column(name = "success_url", nullable = false, updatable = false)
    private String successUrl;

    @Column(name = "cancel_url")
    private String cancelUrl;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "expires_at", nullable = false)
    private LocalDateTime expiresAt;
}
