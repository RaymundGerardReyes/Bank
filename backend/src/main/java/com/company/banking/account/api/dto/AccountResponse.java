package com.company.banking.account.api.dto;

import com.company.banking.account.domain.Account;
import com.company.banking.common.enums.AccountStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AccountResponse {
    private String accountNumber;
    private Long customerId;
    private AccountStatus status;
    private BigDecimal balance;
    private String currency;
    private String swiftCode;
    private String cardExpiry;
    private String cardCvv;
    private LocalDateTime createdAt;

    public static AccountResponse fromEntity(Account account) {
        return AccountResponse.builder()
                .accountNumber(account.getAccountNumber())
                .customerId(account.getCustomerId())
                .status(account.getStatus())
                .balance(account.getBalance())
                .currency(account.getCurrency())
                .swiftCode(account.getSwiftCode())
                .cardExpiry(account.getCardExpiry())
                .cardCvv(account.getCardCvv())
                .createdAt(account.getCreatedAt())
                .build();
    }
}