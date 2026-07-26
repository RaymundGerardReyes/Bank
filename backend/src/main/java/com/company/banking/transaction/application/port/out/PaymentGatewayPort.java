package com.company.banking.transaction.application.port.out;

import java.math.BigDecimal;

public interface PaymentGatewayPort {
    boolean processExternalPayment(String sourceAccount, String routingNumber, String destinationAccount, BigDecimal amount);
}
