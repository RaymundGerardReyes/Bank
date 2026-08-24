package com.company.banking.payment.domain;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "payment_authorizations", uniqueConstraints = {
    @UniqueConstraint(name = "uk_authorization_session", columnNames = {"checkout_session_id"})
})
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PaymentAuthorization {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false, updatable = false)
    private String authorizationReference; // e.g., auth_...

    @Column(nullable = false, updatable = false)
    private String checkoutSessionId;

    @Column(nullable = false, updatable = false)
    private String paymentIntentId;

    @Column(nullable = false, updatable = false)
    private String customerAccountNumber;

    @Column(nullable = false, updatable = false)
    private Long merchantId;

    @Column(nullable = false, updatable = false)
    private BigDecimal amount;

    @Column(nullable = false, updatable = false)
    private String currency;

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private PaymentAuthorizationStatus status;

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    private LocalDateTime authorizedAt;
    private LocalDateTime expiresAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
    }
}
