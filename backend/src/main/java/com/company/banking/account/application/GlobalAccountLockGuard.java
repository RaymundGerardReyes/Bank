package com.company.banking.account.application;

import com.company.banking.account.application.port.out.AccountPersistencePort;
import com.company.banking.account.domain.Account;
import com.company.banking.common.exception.BusinessException;
import com.company.banking.common.exception.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Component
@RequiredArgsConstructor
public class GlobalAccountLockGuard {

    private final AccountPersistencePort accountPersistencePort;

    @Transactional(propagation = Propagation.MANDATORY)
    public List<Account> acquireDeterministicLocks(String accountA, String accountB) {
        Account firstLock, secondLock;
        
        if (accountA.compareTo(accountB) < 0) {
            firstLock = fetchAndLock(accountA);
            secondLock = fetchAndLock(accountB);
        } else {
            firstLock = fetchAndLock(accountB);
            secondLock = fetchAndLock(accountA);
        }

        Account source = accountA.equals(firstLock.getAccountNumber()) ? firstLock : secondLock;
        Account destination = accountB.equals(firstLock.getAccountNumber()) ? firstLock : secondLock;
        
        return List.of(source, destination);
    }

    private Account fetchAndLock(String accountNumber) {
        return accountPersistencePort.findByAccountNumberForUpdate(accountNumber)
            .orElseThrow(() -> new BusinessException(ErrorCode.NOT_FOUND, "Account missing: " + accountNumber));
    }
}
