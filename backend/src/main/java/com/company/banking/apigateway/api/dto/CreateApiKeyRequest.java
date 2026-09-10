package com.company.banking.apigateway.api.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.Set;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CreateApiKeyRequest {

    @NotBlank(message = "Key name is required")
    private String name;

    private String environment; // LIVE or SANDBOX

    private String cidrWhitelist;

    private Set<String> scopes;

    private String linkedAccountId;

    private String applicationId;

    private String applicationName;

    private BigDecimal perTransactionLimit;

    private BigDecimal dailyLimit;
}
