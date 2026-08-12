package com.company.banking.orchestration.domain;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;

@Entity
@Table(name = "payment_rail_configurations")
@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class PaymentRailConfiguration {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String railName; // e.g., "InstaPay", "PESONet", "SWIFT"

    @Column(nullable = false)
    private String processingType; // "REAL_TIME", "BATCH"

    private BigDecimal maxAmountPerTx;

    @Column(nullable = false)
    private boolean active;
}
