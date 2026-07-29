package com.company.banking.orchestration.application.port.in;

import com.company.banking.orchestration.api.dto.OrchestrationRequest;
import com.company.banking.orchestration.api.dto.OrchestrationResponse;

public interface PaymentOrchestrationUseCase {
    OrchestrationResponse routePayment(OrchestrationRequest request);
}