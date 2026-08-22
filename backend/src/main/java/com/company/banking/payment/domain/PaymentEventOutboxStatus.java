package com.company.banking.payment.domain;

public enum PaymentEventOutboxStatus {
    PENDING,
    DELIVERING,
    DELIVERED,
    RETRY,
    DEAD_LETTER
}
