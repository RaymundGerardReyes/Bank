package com.company.banking.account.application;

import com.company.banking.account.api.dto.AccountResponse;
import com.company.banking.account.api.dto.OpenAccountRequest;
import com.company.banking.account.application.port.in.OpenAccountUseCase;
import com.company.banking.account.application.port.out.AccountPersistencePort;
import com.company.banking.account.domain.Account;
import com.company.banking.common.enums.AccountStatus;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class OpenAccountService implements OpenAccountUseCase {

    private final AccountPersistencePort accountPersistencePort;

    @Override
    @Transactional
    public AccountResponse openAccount(OpenAccountRequest request) {
        String accountNumber = "ACCT-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
        
        Account account = Account.builder()
                .customerId(request.getCustomerId())
                .accountNumber(accountNumber)
                .currency(request.getCurrency())
                .balance(request.getInitialDeposit() != null ? request.getInitialDeposit() : BigDecimal.ZERO)
                .status(AccountStatus.ACTIVE)
                .build();

        Account saved = accountPersistencePort.save(account);
        return AccountResponse.fromEntity(saved);
    }
}
