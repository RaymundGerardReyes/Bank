package com.company.banking.payment.api.dto.merchant;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
public class MerchantPaymentResponse {
    // Strictly hides database primary keys. Uses only opaque IDs (e.g., pi_01K8XYZ)
    private String id; 
    
    private String status; // AUTHORIZED, CAPTURED, FAILED, REFUNDED, CANCELLED
    private BigDecimal amount;
    private String currency;
    private String reference; // The merchant's original order reference
    
    // Identifies if this occurred in TEST or LIVE mode
    private String environment; 

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
