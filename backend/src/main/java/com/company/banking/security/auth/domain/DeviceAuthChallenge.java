package com.company.banking.security.auth.domain;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "device_auth_challenges")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DeviceAuthChallenge {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "challenge", nullable = false, unique = true)
    private String challenge;

    @Column(name = "device_id", nullable = false)
    private String deviceId;

    @Column(name = "customer_id", nullable = false)
    private Long customerId;

    @Column(name = "purpose", nullable = false)
    @Builder.Default
    private String purpose = "BIOMETRIC_LOGIN";

    @Column(name = "expires_at", nullable = false)
    private LocalDateTime expiresAt;

    @Column(name = "consumed", nullable = false)
    @Builder.Default
    private boolean consumed = false;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        if (this.purpose == null) {
            this.purpose = "BIOMETRIC_LOGIN";
        }
    }
}

