package com.company.banking.payment.api.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PaymentSessionResponse {
    private String paymentIntentId;
    private String provider;
    private String checkoutType;
    private String checkoutUrl;
    private LocalDateTime expiresAt;
    private String transactionReference;
}