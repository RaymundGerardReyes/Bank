package com.company.banking.payment.api.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Positive;
import lombok.Data;
import java.math.BigDecimal;

@Data
public class CreatePaymentIntentRequest {

    @NotBlank(message = "sourceAccountId cannot be blank or null")
    @Pattern(regexp = "^(?!null$).*", message = "sourceAccountId cannot be the literal string 'null'")
    private String sourceAccountId;

    private BigDecimal amount;

    private String currency;

    private String description;
    private String merchantReference;
    private String idempotencyKey;
}