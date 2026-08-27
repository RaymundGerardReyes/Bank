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
@Schema(description = "Request payload for internal fund transfers")
public class InternalTransferRequest {

    @NotBlank
    @Schema(description = "The source account number", example = "4859228705057459", requiredMode = Schema.RequiredMode.REQUIRED)
    private String sourceAccountNumber;

    @NotBlank
    @Schema(description = "The destination account number", example = "4859228705057460", requiredMode = Schema.RequiredMode.REQUIRED)
    private String destinationAccountNumber;

    @NotNull
    @DecimalMin("0.01")
    @Schema(description = "Amount to transfer in base currency", example = "150.00", requiredMode = Schema.RequiredMode.REQUIRED)
    private BigDecimal amount;

    @NotBlank
    @Schema(description = "Unique idempotency key to prevent duplicate processing", example = "idemp_8f7b231c-9a4d-4e99-8b1c-3b9c7d4a2f81", requiredMode = Schema.RequiredMode.REQUIRED)
    private String idempotencyKey;

    @Schema(description = "Optional transfer description", example = "Payment for consulting services")
    private String description;

    @Schema(description = "Optional scheduled execution date (ISO-8601)", example = "2026-09-01T10:00:00Z")
    private String scheduledDate;
}

