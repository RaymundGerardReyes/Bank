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
@Schema(description = "Request payload for external wire and ACH payments")
public class ExternalPaymentRequest {

    @NotBlank
    @Schema(description = "The source account number", example = "ACC-EXT-100200300", requiredMode = Schema.RequiredMode.REQUIRED)
    private String sourceAccountNumber;

    @NotBlank
    @Schema(description = "The destination account number outside the bank", example = "EXT-NOVA-999", requiredMode = Schema.RequiredMode.REQUIRED)
    private String destinationAccountNumber;

    @NotBlank
    @Schema(description = "Routing number of the destination bank", example = "ROUTING-1234", requiredMode = Schema.RequiredMode.REQUIRED)
    private String routingNumber;

    @NotBlank
    @Schema(description = "Name of the recipient", example = "Nova Global", requiredMode = Schema.RequiredMode.REQUIRED)
    private String recipientName;

    @NotNull
    @DecimalMin("0.01")
    @Schema(description = "Amount to transfer", example = "1000.00", requiredMode = Schema.RequiredMode.REQUIRED)
    private BigDecimal amount;

    @NotBlank
    @Schema(description = "The specific payment rail to use (e.g., SWIFT, ACH)", example = "SWIFT", requiredMode = Schema.RequiredMode.REQUIRED)
    private String railName;

    @NotBlank
    @Schema(description = "Unique idempotency key to prevent duplicate processing", example = "idemp_ext_b2a3c4", requiredMode = Schema.RequiredMode.REQUIRED)
    private String idempotencyKey;
}

