package com.company.banking.payment.routing;

import com.company.banking.payment.domain.PaymentMethod;
import com.company.banking.payment.gateway.ExternalPaymentGateway;

import java.math.BigDecimal;

public interface PaymentRouter {
    /**
     * Determines the appropriate downstream processor (rail) based on the payment method.
     */
    ExternalPaymentGateway route(PaymentMethod method, BigDecimal amount, String currency);
}