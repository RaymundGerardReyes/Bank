package com.company.banking.settlement.domain;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "settlement_instructions")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SettlementInstruction {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "instruction_id", unique = true, nullable = false)
    private String instructionId;

    // The UNIQUE constraint is our absolute safeguard against double-instruction creation
    @Column(name = "settlement_batch_id", unique = true, nullable = false)
    private Long settlementBatchId;

    @Column(name = "merchant_id", nullable = false)
    private Long merchantId;

    @Column(nullable = false, updatable = false)
    private BigDecimal amount;

    @Column(nullable = false, updatable = false)
    private String currency;

    @Column(nullable = false)
    private String status; // DRAFT, READY, SUBMITTED, SETTLED, EXCEPTION

    @Column(name = "destination_account", nullable = false, updatable = false)
    private String destinationAccount;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        if (this.status == null) {
            this.status = "DRAFT";
        }
    }
}
