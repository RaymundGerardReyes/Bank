package com.company.banking.account.domain;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;

@Data
@Builder
public class AccountLimit {
    private BigDecimal dailyTransferLimit;
    private BigDecimal monthlyTransferLimit;
    
    public boolean isWithinDailyLimit(BigDecimal amount) {
        return amount.compareTo(dailyTransferLimit) <= 0;
    }
}
