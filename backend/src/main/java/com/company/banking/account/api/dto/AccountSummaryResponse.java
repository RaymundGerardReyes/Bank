package com.company.banking.account.api.dto;

import com.company.banking.common.enums.AccountStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AccountSummaryResponse {
    private String accountNumber;
    private BigDecimal balance;
    private String currency;
    private AccountStatus status;
    private String swiftCode;
    private String cardExpiry;
    private String cardCvv;
}
