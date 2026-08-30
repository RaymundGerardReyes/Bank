package com.company.banking.qr.domain;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class QrPaymentRequest {
    private String idempotencyKey; 
    private String intentId;
    private String authoritativeReference; 
    private String expectedProvider;
    private String externalMerchantId;
    private BigDecimal amount;
    private String currency;
}
