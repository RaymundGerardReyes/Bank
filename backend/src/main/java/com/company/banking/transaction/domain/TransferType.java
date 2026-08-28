package com.company.banking.transaction.domain;

public enum TransferType {
    SAME_CURRENCY,
    CROSS_CURRENCY;

    public static TransferType from(CurrencyCode source, CurrencyCode destination) {
        if (source == null || destination == null) {
            throw new IllegalArgumentException("Source and destination currencies must not be null");
        }
        if (source == destination) {
            return SAME_CURRENCY;
        }
        return CROSS_CURRENCY;
    }
}
