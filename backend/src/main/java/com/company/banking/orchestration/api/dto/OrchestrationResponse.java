package com.company.banking.orchestration.api.dto;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
public class OrchestrationResponse {
    private String orchestrationId;
    private String executedRail;
    private String status;
    private BigDecimal amount;
    private String currency;
    private LocalDateTime processedAt;
}