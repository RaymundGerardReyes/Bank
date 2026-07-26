package com.company.banking.transaction.domain;

import org.springframework.stereotype.Component;

import java.math.BigDecimal;

@Component
public class TransferPolicy {

    public boolean isTransferAllowed(String sourceAccount, String destAccount, BigDecimal amount) {
        if (sourceAccount == null || destAccount == null || sourceAccount.equals(destAccount)) {
            return false;
        }
        return amount != null && amount.compareTo(BigDecimal.ZERO) > 0;
    }
}
