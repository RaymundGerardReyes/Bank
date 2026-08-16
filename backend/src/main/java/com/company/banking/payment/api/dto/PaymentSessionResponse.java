package com.company.banking.payment.api.dto;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class PaymentSessionResponse {
    private String paymentIntentId;
    private String provider;
    private String checkoutType;
    private String checkoutUrl;
    private LocalDateTime expiresAt;
    private String transactionReference;
}