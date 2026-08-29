package com.company.banking.payment.domain;

public enum IdempotencyClaimStatus {
    PROCESSING,
    COMPLETED,
    UNKNOWN,
    FAILED
}
