package com.company.banking.payment.domain;

import lombok.Builder;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * Clean, normalized payload dispatched to the external institution.
 * STRICT POLICY: Never expose Paynamics/Maya/PayMongo specific internal variables here.
 */
@Data
@Builder
public class InstitutionCallbackPayload {
    private String paymentSessionId;
    private String institutionReference;
    private String status;
    private BigDecimal amount;
    private String currency;
    private LocalDateTime completedAt;
}