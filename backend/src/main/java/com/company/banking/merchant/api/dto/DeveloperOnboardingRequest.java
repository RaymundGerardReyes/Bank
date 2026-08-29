package com.company.banking.merchant.api.dto;

import jakarta.validation.constraints.NotBlank;

public record DeveloperOnboardingRequest(
    @NotBlank(message = "Legal name is required") String legalName,
    @NotBlank(message = "Business registration number is required") String businessRegistrationNumber,
    @NotBlank(message = "Merchant code is required") String merchantCode,
    @NotBlank(message = "Contact email is required") String email
) {}
