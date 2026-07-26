package com.company.banking.account.api.dto;

import com.company.banking.common.enums.AccountStatus;
import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;

@Data
@Builder
public class AccountSummaryResponse {
    private String accountNumber;
    private BigDecimal balance;
    private String currency;
    private AccountStatus status;
}
