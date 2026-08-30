package com.company.banking.payment.domain;

public enum PaymentIntentStatus {
    CREATED,
    AUTHORIZED,
    CHECKOUT_CREATED,
    REDIRECTED,
    PROCESSING,
    SUCCESS,
    FAILED,
    CANCELLED,
    EXPIRED,
    CAPTURED,
    REFUNDED,
    PARTIALLY_REFUNDED,
    QR_GENERATED,
    QR_GENERATING,
    AWAITING_PAYMENT,
    PAID,
    SETTLED,
    PENDING
}