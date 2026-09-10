package com.company.banking.apigateway.api.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
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
    private String rawKey; 
    private String cidrWhitelist;
    private Set<String> scopes;
    private String linkedAccountId;
    private String applicationId;
    private String applicationName;
    private BigDecimal perTransactionLimit;
    private BigDecimal dailyLimit;
    private LocalDateTime expiresAt;
    private LocalDateTime revokedAt;
    private LocalDateTime lastUsedAt;
    private LocalDateTime createdAt;
}
