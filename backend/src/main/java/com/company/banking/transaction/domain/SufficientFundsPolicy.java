package com.company.banking.transaction.domain;

import com.company.banking.account.domain.Account;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;

@Component
public class SufficientFundsPolicy {

    public boolean hasSufficientFunds(Account account, BigDecimal requiredAmount) {
        if (account != null && account.isFrozen()) {
            throw new com.company.banking.common.exception.BusinessException(
                com.company.banking.common.exception.ErrorCode.FORBIDDEN, 
                "Account is frozen due to AML investigations or compliance reasons.");
        }

        if (account == null || account.getBalance() == null || requiredAmount == null) {
            return false;
        }
        return account.getBalance().compareTo(requiredAmount) >= 0;
    }
}
