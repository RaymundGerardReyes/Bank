package com.company.banking.transaction.domain;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "authorization_attempts")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AuthorizationAttempt {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "transaction_intent_id", nullable = false)
    private Long transactionIntentId;

    @Column(nullable = false, unique = true)
    private String challenge;

    @Column(name = "credential_id")
    private String credentialId;

    @Column(nullable = false)
    private String status;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "expires_at", nullable = false)
    private LocalDateTime expiresAt;

    @Column(name = "verified_at")
    private LocalDateTime verifiedAt;

    @Column(name = "auth_type")
    private String authType;

    @Column(name = "ip_address")
    private String ipAddress;

    private java.math.BigDecimal amount;

    @Column(name = "source_account")
    private String sourceAccount;

    @Column(name = "destination_account")
    private String destinationAccount;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        if (this.expiresAt == null) {
            this.expiresAt = this.createdAt.plusMinutes(5);
        }
        if (this.status == null) {
            this.status = "PENDING";
        }
        if (this.authType == null) {
            this.authType = "WEBAUTHN";
        }
    }
}
