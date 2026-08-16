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
    QR_GENERATED,
    PENDING
}