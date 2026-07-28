package com.company.banking.account.application;

import com.company.banking.account.api.dto.AccountResponse;
import com.company.banking.account.application.port.in.GetAccountDetailsUseCase;
import com.company.banking.account.application.port.out.AccountPersistencePort;
import com.company.banking.account.domain.Account;
import com.company.banking.common.exception.NotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class GetAccountDetailsService implements GetAccountDetailsUseCase {

    private final AccountPersistencePort accountPersistencePort;

    @Override
    @Transactional(readOnly = true)
    public AccountResponse getAccountDetails(String accountNumber) {
        Account account = accountPersistencePort.findByAccountNumber(accountNumber)
                .orElseThrow(() -> new NotFoundException("Account not found: " + accountNumber));

        return AccountResponse.fromEntity(account);
    }


}
