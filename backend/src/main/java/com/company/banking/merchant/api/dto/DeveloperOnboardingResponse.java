package com.company.banking.merchant.api.dto;

public record DeveloperOnboardingResponse(
    Long merchantId,
    String settlementAccountNumber,
    String apiKey
) {}
