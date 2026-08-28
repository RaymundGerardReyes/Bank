package com.company.banking.transaction.infrastructure;

import com.company.banking.transaction.application.port.out.FraudScreeningPort;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;

@Component
@Slf4j
public class FraudScreeningAdapter implements FraudScreeningPort {

    private static final BigDecimal FRAUD_THRESHOLD = new BigDecimal("100000.00");

    @Override
    public boolean isFraudulent(String sourceAccount, String destinationAccount, BigDecimal amount) {
        log.info("Screening transaction for fraud: {} -> {} for {}", sourceAccount, destinationAccount, amount);
        
        // Simple mock rule: flag anything over $100k
        if (amount.compareTo(FRAUD_THRESHOLD) > 0) {
            log.warn("Transaction flagged as fraudulent by threshold rule!");
            return true;
        }
        if (destinationAccount != null && destinationAccount.startsWith("EXT-SUSPICIOUS-")) {
            log.warn("Transaction flagged as fraudulent by suspicious destination rule!");
            return true;
        }
        
        return false;
    }
}
