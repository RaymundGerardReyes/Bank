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

    @Column(unique = true, nullable = false, updatable = false)
    private String sessionId; // Opaque cs_... token

    @Column(name = "merchant_id", nullable = false, updatable = false)
    private Long merchantId;

    @Column(name = "idempotency_key", nullable = false, updatable = false)
    private String idempotencyKey;

    @Column(nullable = false, updatable = false)
    private String paymentIntentId; // References PaymentIntent.intentId (pi_...)

    @Column(nullable = false, updatable = false)
    private BigDecimal amount;

    @Column(nullable = false, updatable = false)
    private String currency;

    private String description;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private CheckoutSessionStatus status;

    private String selectedPaymentMethod;

    @Column(nullable = false, updatable = false)
    private String successUrl;

    private String cancelUrl;

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(nullable = false)
    private LocalDateTime expiresAt;
}
