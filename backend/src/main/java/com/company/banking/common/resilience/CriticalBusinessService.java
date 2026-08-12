package com.company.banking.common.resilience;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "critical_business_services")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CriticalBusinessService {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "service_name", nullable = false, unique = true)
    private String serviceName;

    @Column(name = "rto_minutes", nullable = false)
    private Integer rtoMinutes;

    @Column(name = "rpo_minutes", nullable = false)
    private Integer rpoMinutes;

    @Column(name = "max_tolerable_downtime_minutes", nullable = false)
    private Integer maxTolerableDowntimeMinutes;

    @Column(name = "recovery_strategy", nullable = false, columnDefinition = "TEXT")
    private String recoveryStrategy;

    @Column(nullable = false)
    private String status; // ONLINE, DEGRADED, RECOVERING, OFFLINE

    @Column(name = "last_tested_at")
    private LocalDateTime lastTestedAt;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        if (this.status == null) {
            this.status = "ONLINE";
        }
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
}
