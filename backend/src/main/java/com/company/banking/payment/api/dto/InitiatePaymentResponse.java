package com.company.banking.payment.api.dto;

import lombok.Builder;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Builder
public class InitiatePaymentResponse {
    private String attemptId;
    private String checkoutUrl;
    private LocalDateTime expiresAt;
    
    // For QR / OTC instructions
    private String reference;
    private String instructions;
}