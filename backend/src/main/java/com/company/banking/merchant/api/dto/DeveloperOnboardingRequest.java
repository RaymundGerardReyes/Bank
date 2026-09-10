package com.company.banking.merchant.api.dto;

import jakarta.validation.constraints.NotBlank;
import java.util.Set;

public record DeveloperOnboardingRequest(
    @NotBlank(message = "Legal name is required") String legalName,
    String businessRegistrationNumber,
    String merchantCode,
    @NotBlank(message = "Contact email is required") String email,
    String environment,
    String cidrWhitelist,
    Set<String> scopes,
    String onboardingType
) {
    public DeveloperOnboardingRequest(
        String legalName,
        String businessRegistrationNumber,
        String merchantCode,
        String email
    ) {
        this(legalName, businessRegistrationNumber, merchantCode, email, "LIVE", "0.0.0.0/0", null, "MERCHANT");
    }
}
