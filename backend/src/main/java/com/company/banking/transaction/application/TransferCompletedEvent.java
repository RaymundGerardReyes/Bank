package com.company.banking.transaction.application;

import java.math.BigDecimal;

/**
 * Domain event published when an internal transfer completes successfully.
 */
public record TransferCompletedEvent(
        String transactionReference,
        String sourceAccountNumber,
        String destinationAccountNumber,
        BigDecimal amount,
        String currency
) {}
