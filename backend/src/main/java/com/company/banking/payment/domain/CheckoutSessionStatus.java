package com.company.banking.payment.domain;

public enum CheckoutSessionStatus {
    ACTIVE,
    PAYMENT_PENDING,
    AUTHORIZED,
    PAID,            // Terminal success
    PAYMENT_FAILED,  // Terminal failure
    EXPIRED,         // Terminal timeout
    CANCELLED        // Terminal abort
}
