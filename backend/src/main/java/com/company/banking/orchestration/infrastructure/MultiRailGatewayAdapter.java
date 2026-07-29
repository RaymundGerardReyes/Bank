package com.company.banking.orchestration.infrastructure;

import com.company.banking.orchestration.api.dto.OrchestrationRequest;
import com.company.banking.orchestration.application.port.out.MultiRailGatewayPort;
import com.company.banking.orchestration.domain.PaymentRail;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

@Component
@Slf4j
public class MultiRailGatewayAdapter implements MultiRailGatewayPort {

    @Override
    public boolean executeTransfer(String railName, OrchestrationRequest request) {
        log.info("[MULTI-RAIL GATEWAY] Executing transfer via {} for amount {} {}", railName, request.getAmount(), request.getCurrency());
        // Mocking a successful call to an external processor (Stripe, Adyen, etc.)
        return true;
    }
}
