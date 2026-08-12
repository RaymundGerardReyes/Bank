package com.company.banking.settlement.domain;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "settlement_exceptions")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SettlementException {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "exception_reference", nullable = false, unique = true)
    private String exceptionReference;

    @Column(name = "settlement_instruction_id", nullable = false)
    private Long settlementInstructionId;

    @Column(name = "error_code", nullable = false)
    private String errorCode;

    @Column(name = "error_description", nullable = false, columnDefinition = "TEXT")
    private String errorDescription;

    @Column(nullable = false)
    private String status; // UNRESOLVED, RESOLVED, MANUAL_INTERVENTION

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        if (this.status == null) {
            this.status = "UNRESOLVED";
        }
    }
}
