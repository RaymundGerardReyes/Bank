package com.company.banking.orchestration.domain;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "payment_gateways")
@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class PaymentGateway {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String name;

    @Column(nullable = false)
    private boolean isActive;

    @Column(nullable = false)
    private Integer priority;

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;
}