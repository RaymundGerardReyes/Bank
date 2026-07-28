package com.company.banking.account.application;

import com.company.banking.account.application.port.in.ChangeAccountStatusUseCase;
import com.company.banking.account.application.port.out.AccountPersistencePort;
import com.company.banking.account.domain.Account;
import com.company.banking.common.enums.AccountStatus;
import com.company.banking.common.exception.NotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class ChangeAccountStatusService implements ChangeAccountStatusUseCase {

    private final AccountPersistencePort accountPersistencePort;

    @Override
    @Transactional
    public void changeStatus(String accountNumber, AccountStatus newStatus) {
        Account account = accountPersistencePort.findByAccountNumber(accountNumber)
                .orElseThrow(() -> new NotFoundException("Account not found"));
        
        account.setStatus(newStatus);
        accountPersistencePort.save(account);
    }
}
