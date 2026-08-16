package com.company.banking.payment.api.dto;

import lombok.Builder;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
public class SessionValidationResponse {
    private boolean valid;
    private String sessionId;
    private String institutionName;
    private String institutionReference;
    private String customerReference;
    private BigDecimal amount;
    private String currency;
    private LocalDateTime expiresAt;
    private String status;
}