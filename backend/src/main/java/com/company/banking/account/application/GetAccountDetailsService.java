package com.company.banking.account.application;

import com.company.banking.account.api.dto.AccountResponse;
import com.company.banking.account.api.dto.OpenAccountRequest;
import com.company.banking.account.application.port.in.AccountUseCase;
import com.company.banking.account.application.port.out.AccountPersistencePort;
import com.company.banking.account.domain.Account;
import com.company.banking.common.enums.AccountStatus;
import com.company.banking.common.exception.NotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class GetAccountDetailsService implements AccountUseCase {

    private final AccountPersistencePort accountPersistencePort;

    @Override
    @Transactional
    public AccountResponse openAccount(OpenAccountRequest request) {
        String accountNumber = "ACCT-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
        
        Account account = Account.builder()
                .accountNumber(accountNumber)
                .customerId(request.getCustomerId())
                .status(AccountStatus.ACTIVE)
                .balance(request.getInitialDeposit() != null ? request.getInitialDeposit() : BigDecimal.ZERO)
                .currency(request.getCurrency() != null ? request.getCurrency() : "USD")
                .build();

        Account saved = accountPersistencePort.save(account);
        return AccountResponse.fromEntity(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public AccountResponse getAccountDetails(String accountNumber) {
        Account account = accountPersistencePort.findByAccountNumber(accountNumber)
                .orElseThrow(() -> new NotFoundException("Account not found: " + accountNumber));

        return AccountResponse.fromEntity(account);
    }

    @Override
    @Transactional(readOnly = true)
    public List<AccountResponse> listCustomerAccounts(Long customerId) {
        return accountPersistencePort.findByCustomerId(customerId)
                .stream()
                .map(AccountResponse::fromEntity)
                .collect(Collectors.toList());
    }
}
