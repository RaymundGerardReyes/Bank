package com.company.banking.payment.api.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CheckoutSessionResponse {

    private String id;
    private String sessionId;
    private String paymentIntentId;
    private String checkoutUrl;
    private String url;
    private String status;
    private BigDecimal amount;
    private String currency;
    private String clientSecret;
}
