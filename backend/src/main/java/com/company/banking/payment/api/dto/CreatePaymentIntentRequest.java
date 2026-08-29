package com.company.banking.payment.api.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Positive;
import lombok.Data;
import java.math.BigDecimal;

@Data
public class CreatePaymentIntentRequest {

    @NotBlank(message = "Source account ID is required")
    @Pattern(regexp = "^[^\\u0000]+$", message = "Invalid characters or literal null detected")
    private String sourceAccountId;

    @NotNull(message = "Amount is required")
    @Positive(message = "Amount must be strictly positive")
    private BigDecimal amount;

    private String currency;

    private String description;
    private String merchantReference;
    private String idempotencyKey;
}