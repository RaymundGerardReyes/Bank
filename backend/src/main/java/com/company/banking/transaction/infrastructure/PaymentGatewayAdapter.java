package com.company.banking.transaction.infrastructure;

import com.company.banking.transaction.application.port.out.PaymentGatewayPort;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;

@Component
@Slf4j
public class PaymentGatewayAdapter implements PaymentGatewayPort {

    @Override
    public boolean processExternalPayment(String sourceAccount, String routingNumber, String destinationAccount, BigDecimal amount) {
        log.info("Mock processing external wire transfer to routing {} account {} for amount {}", routingNumber, destinationAccount, amount);
        // Simulate a successful network wire
        return true;
    }
}
