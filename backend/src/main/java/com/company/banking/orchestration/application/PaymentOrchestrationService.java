package com.company.banking.orchestration.application;

import com.company.banking.common.exception.BusinessException;
import com.company.banking.common.exception.ConflictException;
import com.company.banking.common.exception.ErrorCode;
import com.company.banking.orchestration.api.dto.OrchestrationRequest;
import com.company.banking.orchestration.api.dto.OrchestrationResponse;
import com.company.banking.orchestration.application.port.in.PaymentOrchestrationUseCase;
import com.company.banking.orchestration.application.port.out.MultiRailGatewayPort;
import com.company.banking.orchestration.application.port.out.RoutingRulePersistencePort;
import com.company.banking.orchestration.domain.PaymentGateway;
import com.company.banking.orchestration.domain.RoutingRule;
import com.company.banking.transaction.application.port.out.LedgerPersistencePort;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class PaymentOrchestrationService implements PaymentOrchestrationUseCase {

    private final MultiRailGatewayPort multiRailGatewayPort;
    private final LedgerPersistencePort ledgerPersistencePort;
    private final RoutingRulePersistencePort routingRulePersistencePort;

    @Override
    public OrchestrationResponse routePayment(OrchestrationRequest request) {
        log.info("[ORCHESTRATION] Initiating smart routing for {} {}", request.getAmount(), request.getCurrency());

        // 1. Strict Idempotency Check
        if (ledgerPersistencePort.existsByIdempotencyKey(request.getIdempotencyKey())) {
            throw new ConflictException("Payment orchestration with this idempotency key already processed");
        }

        // 2. Database-Driven Smart Routing Logic
        RoutingRule optimalRule = routingRulePersistencePort.findOptimalRule(request.getCurrency(), request.getAmount())
                .orElseThrow(() -> new BusinessException(ErrorCode.SYSTEM_ERROR, "No routing rule configured for " + request.getCurrency()));

        PaymentGateway primaryGateway = optimalRule.getPrimaryGateway();
        log.info("[ORCHESTRATION] Selected Primary Rail: {}", primaryGateway.getName());

        // We pass the string name instead of a hardcoded enum
        boolean success = multiRailGatewayPort.executeTransfer(primaryGateway.getName(), request);
        PaymentGateway executedGateway = primaryGateway;

        // 3. Automated Gateway Failover Logic
        if (!success) {
            PaymentGateway fallbackGateway = optimalRule.getFallbackGateway();
            
            if (fallbackGateway == null || !fallbackGateway.isActive()) {
                log.error("[ORCHESTRATION] FATAL: Primary gateway failed and no active fallback rail is configured.");
                throw new BusinessException(ErrorCode.PAYMENT_GATEWAY_ERROR, "Transaction failed. No fallback rail available.");
            }

            log.warn("[ORCHESTRATION] Primary Rail {} degraded. Initiating seamless failover to {}...", primaryGateway.getName(), fallbackGateway.getName());
            
            success = multiRailGatewayPort.executeTransfer(fallbackGateway.getName(), request);
            executedGateway = fallbackGateway;
            
            if (!success) {
                log.error("[ORCHESTRATION] FATAL: All payment rails exhausted and failed.");
                throw new BusinessException(ErrorCode.PAYMENT_GATEWAY_ERROR, "Multi-rail routing failed. All processors offline.");
            }
        }

        return OrchestrationResponse.builder()
                .orchestrationId("ORC-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase())
                .executedRail(executedGateway.getName())
                .status("AUTHORIZED")
                .amount(request.getAmount())
                .currency(request.getCurrency())
                .processedAt(LocalDateTime.now())
                .build();
    }
}