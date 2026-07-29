package com.company.banking.orchestration.application.port.out;

import com.company.banking.orchestration.api.dto.OrchestrationRequest;
import com.company.banking.orchestration.domain.PaymentRail;

public interface MultiRailGatewayPort {
    boolean executeTransfer(String railName, OrchestrationRequest request);
}