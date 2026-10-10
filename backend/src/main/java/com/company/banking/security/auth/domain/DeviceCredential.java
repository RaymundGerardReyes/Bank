package com.company.banking.security.auth.domain;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "device_credentials")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DeviceCredential {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "customer_id", nullable = false)
    private Long customerId;

    @Column(name = "device_id", nullable = false, unique = true)
    private String deviceId;

    @Column(name = "public_key", nullable = false, length = 2048)
    private String publicKey;

    @Column(name = "algorithm", nullable = false)
    @Builder.Default
    private String algorithm = "SHA256withECDSA";

    @Column(name = "device_model")
    private String deviceModel;

    @Column(name = "status", nullable = false)
    @Builder.Default
    private String status = "ACTIVE"; // ACTIVE, REVOKED

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "last_used_at")
    private LocalDateTime lastUsedAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        if (this.status == null) {
            this.status = "ACTIVE";
        }
        if (this.algorithm == null) {
            this.algorithm = "SHA256withECDSA";
        }
    }
}

