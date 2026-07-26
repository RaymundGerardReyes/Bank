package com.company.banking.transaction.domain;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
public class LedgerEntry {
    private String transactionReference;
    private String idempotencyKey;
    private String sourceAccountNumber;
    private String destinationAccountNumber;
    private BigDecimal amount;
    private String currency;
    private TransactionStatus status;
    private LocalDateTime timestamp;
}
