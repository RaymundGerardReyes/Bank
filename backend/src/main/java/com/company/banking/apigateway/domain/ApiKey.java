package com.company.banking.apigateway.domain;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.Set;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ApiKey {

    private Long id;
    private String keyPrefix;
    private Long merchantId;
    private String keyHash;
    private String name;
    private String environment; // LIVE, SANDBOX
    private String cidrWhitelist;
    private Set<String> scopes;
    private String linkedAccountId; // <-- NEW: Sub-Account Binding
    private LocalDateTime expiresAt;
    private LocalDateTime revokedAt;
    private LocalDateTime lastUsedAt;
    private LocalDateTime createdAt;

    private String applicationId;
    private String applicationName;
    private java.math.BigDecimal perTransactionLimit;
    private java.math.BigDecimal dailyLimit;

    public boolean isRevoked() {
        return revokedAt != null && revokedAt.isBefore(LocalDateTime.now());
    }

    public boolean isExpired() {
        return expiresAt != null && expiresAt.isBefore(LocalDateTime.now());
    }

    public boolean isActive() {
        return !isRevoked() && !isExpired();
    }

    public boolean isLive() {
        return "LIVE".equalsIgnoreCase(environment);
    }

    public boolean isSandbox() {
        return "SANDBOX".equalsIgnoreCase(environment) || "TEST".equalsIgnoreCase(environment);
    }

    public boolean canAccessAccount(String targetAccountNumber) {
        if (targetAccountNumber == null || targetAccountNumber.trim().isEmpty()) {
            return true;
        }
        String cleanTarget = targetAccountNumber.trim();
        if (linkedAccountId != null && !linkedAccountId.trim().isEmpty()) {
            return cleanTarget.equalsIgnoreCase(linkedAccountId.trim());
        }
        // If no explicit linked account is set, default to allowing root/settlement account only for this merchant
        if (merchantId != null) {
            String defaultSettlement = "MERCHANT-SETTLEMENT-" + merchantId;
            return cleanTarget.equalsIgnoreCase(defaultSettlement);
        }
        return false;
    }
}
