package com.company.banking.account.domain;

import com.company.banking.common.enums.AccountStatus;
import org.springframework.stereotype.Component;

@Component
public class AccountPolicy {

    public boolean canPerformTransactions(Account account) {
        if (account == null) {
            return false;
        }
        return account.getStatus() == AccountStatus.ACTIVE;
    }
}
