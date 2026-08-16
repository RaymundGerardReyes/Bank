package com.company.banking.payment.api.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class CreatePaymentSessionRequest {
    
    @NotBlank(message = "Institution reference is required")
    private String institutionReference;

    private String customerReference;

    @NotNull(message = "Amount is required")
    @DecimalMin(value = "0.01", message = "Amount must be greater than zero")
    private BigDecimal amount;

    @NotBlank(message = "Currency is required")
    private String currency;

    private String description;

    @NotBlank(message = "Callback URL is required for webhook notifications")
    private String callbackUrl;
}