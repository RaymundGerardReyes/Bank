package com.company.banking.payment.gateway.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ExternalCheckoutRequest {
    private String paymentIntentId;
    private BigDecimal amount;
    private String currency;
    private String description;
    private String customerReference;
    private String successUrl;
    private String failUrl;
    private String cancelUrl;
    private String merchantOrderId;
    private String reference;
}