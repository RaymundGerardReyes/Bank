package com.company.banking.payment.domain;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "payment_participants")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PaymentParticipant {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String bic; // Bank Identifier Code

    @Column(name = "institution_name", nullable = false)
    private String institutionName;

    @Column(nullable = false)
    private String role; // SENDER, RECEIVER, CLEARING_HOUSE

    @Column(nullable = false)
    private String rail; // PESONET, INSTAPAY, PHILPASS

    @Column(nullable = false)
    private String status; // ACTIVE, SUSPENDED

    @Column(name = "settlement_account", nullable = false)
    private String settlementAccount;

    @Column(name = "connectivity_status", nullable = false)
    private String connectivityStatus; // ONLINE, OFFLINE

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        if (this.status == null) {
            this.status = "ACTIVE";
        }
        if (this.connectivityStatus == null) {
            this.connectivityStatus = "ONLINE";
        }
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
}
