package com.company.banking.orchestration.domain;

public enum PaymentRail {
    STRIPE_NETWORK,
    ADYEN_GLOBAL,
    LOCAL_RTGS,
    SWIFT_CROSS_BORDER
}