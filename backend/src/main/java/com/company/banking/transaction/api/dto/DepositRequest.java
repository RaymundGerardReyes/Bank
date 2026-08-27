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
@Schema(description = "Request payload for depositing funds into a NovaBank virtual account.")
public class DepositRequest {

    @Schema(
        description = "The virtual account number receiving the deposit.",
        example = "4859228705057459",
        requiredMode = Schema.RequiredMode.REQUIRED,
        minLength = 10,
        maxLength = 20
    )
    @NotBlank(message = "Account number is required")
    private String accountNumber;

    @Schema(
        description = "The deposit amount in the account's base currency.",
        example = "250.00",
        requiredMode = Schema.RequiredMode.REQUIRED,
        minimum = "0.01"
    )
    @NotNull(message = "Amount is required")
    @DecimalMin(value = "0.01", message = "Amount must be greater than zero")
    private BigDecimal amount;

    @Schema(
        description = "A unique client-generated key to safely retry the deposit without duplication.",
        example = "idemp-deposit-8f92a",
        requiredMode = Schema.RequiredMode.REQUIRED,
        maxLength = 100
    )
    @NotBlank(message = "Idempotency key is required")
    private String idempotencyKey;
}
