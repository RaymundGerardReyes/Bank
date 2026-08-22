package com.company.banking.payment.api.dto.merchant;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class MerchantRefundRequest {

    @NotNull(message = "Refund amount is required")
    @Positive(message = "Refund amount must be greater than zero")
    private BigDecimal amount;

    @NotBlank(message = "Refund reason is required")
    private String reason;
}
