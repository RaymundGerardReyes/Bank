package com.company.banking.transaction.api.dto;

import com.company.banking.transaction.domain.Transaction;
import com.company.banking.transaction.domain.TransactionStatus;
import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
public class TransactionResponse {
    private String transactionReference;
    private String sourceAccountNumber;
    private String destinationAccountNumber;
    private BigDecimal amount;
    private String currency;
    private TransactionStatus status;
    private String description;
    private LocalDateTime createdAt;
    
    // Extra fields for UI History Mapping
    private String senderName;
    private String recipientName;
    private String entryType;

    public static TransactionResponse fromEntity(Transaction transaction) {
        return TransactionResponse.builder()
                .transactionReference(transaction.getTransactionReference())
                .sourceAccountNumber(transaction.getSourceAccountNumber())
                .destinationAccountNumber(transaction.getDestinationAccountNumber())
                .amount(transaction.getAmount())
                .currency(transaction.getCurrency())
                .status(transaction.getStatus())
                .description(transaction.getDescription())
                .createdAt(transaction.getCreatedAt())
                .build();
    }
}
