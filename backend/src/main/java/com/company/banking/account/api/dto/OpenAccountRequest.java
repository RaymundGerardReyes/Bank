package com.company.banking.account.api.dto;

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
public class OpenAccountRequest {
    @NotNull(message = "Customer ID is required")
    private Long customerId;
    
    @NotBlank(message = "Currency is required")
    private String currency;
    
    private BigDecimal initialDeposit;

    // --- NEW ENTERPRISE VAM FIELDS ---
    @NotBlank(message = "Account type/template is required")
    private String accountType;

    private String parentAccountId; // Optional for root, Required for VAM
    private String accountName;
    private String nickname;
    private BigDecimal dailyLimit;
    private BigDecimal monthlyLimit;
    private boolean allowIncoming;
    private boolean allowOutgoing;
    private boolean requireDualApproval;
    private boolean issueVirtualCard;
}