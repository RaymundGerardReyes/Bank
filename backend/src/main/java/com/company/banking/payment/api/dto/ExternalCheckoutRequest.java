package com.company.banking.payment.api.dto;

import lombok.Data;
import java.math.BigDecimal;

@Data
public class ExternalCheckoutRequest {
    private String paymentMethod;
    private BigDecimal amount;
    private String currency;
    private String reference;
}