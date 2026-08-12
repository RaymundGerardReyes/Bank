package com.company.banking.settlement.domain;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "settlement_windows")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SettlementWindow {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "window_reference", nullable = false, unique = true)
    private String windowReference;

    @Column(name = "cycle_type", nullable = false)
    private String cycleType; // INTRADAY, EOD

    @Column(nullable = false)
    private String rail; // PESONET, INSTAPAY, PHILPASS

    @Column(name = "cut_off_time", nullable = false)
    private LocalDateTime cutOffTime;

    @Column(nullable = false)
    private String status; // OPEN, CLOSED, RECONCILED, FAILED

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        if (this.status == null) {
            this.status = "OPEN";
        }
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
}
