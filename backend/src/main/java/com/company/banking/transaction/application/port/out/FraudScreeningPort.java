package com.company.banking.transaction.application.port.out;

import java.math.BigDecimal;

public interface FraudScreeningPort {
    boolean isFraudulent(String sourceAccount, String destinationAccount, BigDecimal amount);
}
