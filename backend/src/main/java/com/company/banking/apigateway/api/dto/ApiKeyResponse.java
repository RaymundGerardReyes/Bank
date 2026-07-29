package com.company.banking.apigateway.api.dto;

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
public class ApiKeyResponse {

    private Long id;
    private String name;
    private String environment;
    private String keyPrefix;
    private String maskedHash;
    private String rawKey; // Non-null only on creation
    private String cidrWhitelist;
    private Set<String> scopes;
    private LocalDateTime expiresAt;
    private LocalDateTime revokedAt;
    private LocalDateTime lastUsedAt;
    private LocalDateTime createdAt;
}
