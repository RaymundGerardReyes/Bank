package com.company.banking.fraud.domain;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "device_risk")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DeviceRisk {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "device_fingerprint", nullable = false, unique = true)
    private String deviceFingerprint;

    @Column(name = "risk_score", nullable = false)
    private Integer riskScore;

    @Column(name = "is_blacklisted", nullable = false)
    private Boolean isBlacklisted;

    @Column(name = "last_seen", nullable = false)
    private LocalDateTime lastSeen;

    @PrePersist
    @PreUpdate
    protected void onUpdate() {
        this.lastSeen = LocalDateTime.now();
        if (this.isBlacklisted == null) {
            this.isBlacklisted = false;
        }
    }
}
