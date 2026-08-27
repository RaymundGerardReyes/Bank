package com.company.banking.transaction.api.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Request payload for withdrawing funds from a NovaBank virtual account.")
public class WithdrawRequest {

    @Schema(
        description = "The virtual account number to withdraw funds from.",
        example = "4859228705057459",
        requiredMode = Schema.RequiredMode.REQUIRED,
        minLength = 10,
        maxLength = 20
    )
    @NotBlank(message = "Account number is required")
    private String accountNumber;

    @Schema(
        description = "The withdrawal amount in the account's base currency.",
        example = "100.00",
        requiredMode = Schema.RequiredMode.REQUIRED,
        minimum = "0.01"
    )
    @NotNull(message = "Amount is required")
    @DecimalMin(value = "0.01", message = "Amount must be greater than zero")
    private BigDecimal amount;

    @Schema(
        description = "A unique client-generated key to safely retry the withdrawal without duplication.",
        example = "idemp-withdraw-9b4c2",
        requiredMode = Schema.RequiredMode.REQUIRED,
        maxLength = 100
    )
    @NotBlank(message = "Idempotency key is required")
    private String idempotencyKey;
}
