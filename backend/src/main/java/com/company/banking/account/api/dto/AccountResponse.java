package com.company.banking.account.api.dto;

import com.company.banking.account.domain.Account;
import com.company.banking.common.enums.AccountStatus;
import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
public class AccountResponse {
    private String accountNumber;
    private Long customerId;
    private AccountStatus status;
    private BigDecimal balance;
    private String currency;
    private LocalDateTime createdAt;

    public static AccountResponse fromEntity(Account account) {
        return AccountResponse.builder()
                .accountNumber(account.getAccountNumber())
                .customerId(account.getCustomerId())
                .status(account.getStatus())
                .balance(account.getBalance())
                .currency(account.getCurrency())
                .createdAt(account.getCreatedAt())
                .build();
    }
}
