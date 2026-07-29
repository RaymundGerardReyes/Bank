package com.company.banking.transaction.api.dto;

import lombok.Data;
import java.math.BigDecimal;

@Data
public class ReceiptNotificationRequest {
    private String transactionReference;
    private BigDecimal amount;
    private String date;
    private String sourceEmail;
    private String recipientEmail;
}