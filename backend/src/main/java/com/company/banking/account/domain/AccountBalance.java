package com.company.banking.account.domain;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AccountBalance {
    private BigDecimal availableBalance;
    private BigDecimal pendingHolds;
    
    public BigDecimal getNetBalance() {
        return availableBalance.subtract(pendingHolds != null ? pendingHolds : BigDecimal.ZERO);
    }
}
