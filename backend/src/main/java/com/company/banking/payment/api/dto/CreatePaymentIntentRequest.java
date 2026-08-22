package com.company.banking.payment.api.dto;

import lombok.Data;
import java.math.BigDecimal;

@Data
public class CreatePaymentIntentRequest {
    private String sourceAccountId;
    private BigDecimal amount;
    private String description;
    private String merchantReference;
    private String idempotencyKey;
}