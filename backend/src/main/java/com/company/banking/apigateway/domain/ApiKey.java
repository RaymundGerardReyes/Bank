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
    private String keyHash;
    private String name;
    private String environment; // LIVE, SANDBOX
    private String cidrWhitelist;
    private Set<String> scopes;
    private LocalDateTime expiresAt;
    private LocalDateTime revokedAt;
    private LocalDateTime lastUsedAt;
    private LocalDateTime createdAt;

    public boolean isRevoked() {
        return revokedAt != null && revokedAt.isBefore(LocalDateTime.now());
    }

    public boolean isExpired() {
        return expiresAt != null && expiresAt.isBefore(LocalDateTime.now());
    }

    public boolean isActive() {
        return !isRevoked() && !isExpired();
    }
}
