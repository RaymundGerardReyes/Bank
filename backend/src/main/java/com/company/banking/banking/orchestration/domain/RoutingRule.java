package com.company.banking.orchestration.domain;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;

@Entity
@Table(name = "routing_rules")
@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class RoutingRule {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String currency;

    @Column(nullable = false)
    private BigDecimal minAmount;

    private BigDecimal maxAmount;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "primary_gateway_id", nullable = false)
    private PaymentGateway primaryGateway;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "fallback_gateway_id")
    private PaymentGateway fallbackGateway;
}