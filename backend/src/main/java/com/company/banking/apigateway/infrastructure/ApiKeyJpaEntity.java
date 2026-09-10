package com.company.banking.apigateway.infrastructure;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "api_keys")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ApiKeyJpaEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String keyPrefix;

    @Column(name = "merchant_id", nullable = false)
    private Long merchantId;

    @Column(nullable = false, unique = true)
    private String keyHash;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String environment;

    private String cidrWhitelist;

    private String scopes;

    @Column(name = "linked_account_id")
    private String linkedAccountId;

    @Column(name = "application_id")
    private String applicationId;

    @Column(name = "application_name")
    private String applicationName;

    @Column(name = "per_transaction_limit")
    private java.math.BigDecimal perTransactionLimit;

    @Column(name = "daily_limit")
    private java.math.BigDecimal dailyLimit;

    @Column(nullable = false)
    private LocalDateTime expiresAt;

    private LocalDateTime revokedAt;

    private LocalDateTime lastUsedAt;

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
    }
}
