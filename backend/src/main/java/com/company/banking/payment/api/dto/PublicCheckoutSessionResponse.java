package com.company.banking.payment.api.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PublicCheckoutSessionResponse {
    private String id;               // e.g., cs_01K8XYZ...
    private String status;           // ACTIVE, PAYMENT_PENDING, AUTHORIZED, PAID, EXPIRED, CANCELLED
    private String merchantName;     // Display name only, NO internal merchantId
    private BigDecimal amount;
    private String currency;
    private String description;      
    private List<String> paymentMethods; 
    private LocalDateTime expiresAt;
}
