package com.company.banking.transaction.domain;

public enum TransactionIntentStatus {
    DRAFT,
    PENDING_AUTH,
    AUTHENTICATING,
    AUTHORIZED,
    PROCESSING,
    EXECUTED,
    EXPIRED,
    AUTH_FAILED,
    FAILED,
    UNKNOWN,
    RECONCILING
}
