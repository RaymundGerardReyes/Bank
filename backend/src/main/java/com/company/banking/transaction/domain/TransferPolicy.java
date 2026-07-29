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

    public void validateVelocity(com.company.banking.account.domain.Account sourceAccount, BigDecimal amount, java.util.List<Transaction> todaysTransactions) {
        BigDecimal dailyLimit = new BigDecimal("50000.00");
        BigDecimal todayTotal = todaysTransactions == null ? BigDecimal.ZERO :
                todaysTransactions.stream()
                        .map(Transaction::getAmount)
                        .reduce(BigDecimal.ZERO, BigDecimal::add);

        if (todayTotal.add(amount).compareTo(dailyLimit) > 0) {
            throw new com.company.banking.common.exception.BusinessException(
                    com.company.banking.common.exception.ErrorCode.TRANSFER_VELOCITY_EXCEEDED,
                    "Cumulative daily transfer limit of $50,000.00 exceeded"
            );
        }
    }
}
