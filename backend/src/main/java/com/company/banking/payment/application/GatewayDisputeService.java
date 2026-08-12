package com.company.banking.payment.application;

import com.company.banking.apigateway.application.WebhookDispatcherService;
import com.company.banking.common.audit.AuditEventPublisher;
import com.company.banking.common.exception.BusinessException;
import com.company.banking.common.exception.ErrorCode;
import com.company.banking.common.exception.NotFoundException;
import com.company.banking.payment.domain.GatewayDispute;
import com.company.banking.payment.domain.PaymentIntent;
import com.company.banking.payment.infrastructure.GatewayDisputeJpaRepository;
import com.company.banking.payment.infrastructure.PaymentIntentJpaRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class GatewayDisputeService {

    private final GatewayDisputeJpaRepository gatewayDisputeJpaRepository;
    private final PaymentIntentJpaRepository paymentIntentJpaRepository;
    private final WebhookDispatcherService webhookDispatcherService;
    private final AuditEventPublisher auditEventPublisher;

    @Transactional
    public GatewayDispute openDispute(String intentId, String reasonCode) {
        PaymentIntent intent = paymentIntentJpaRepository.findByIntentId(intentId)
                .orElseThrow(() -> new NotFoundException("PaymentIntent not found"));

        if (!"CAPTURED".equals(intent.getStatus())) {
            throw new BusinessException(ErrorCode.INVALID_REQUEST, "Disputes can only be opened against CAPTURED payment intents.");
        }

        String disputeRef = "dsp_" + UUID.randomUUID().toString().replace("-", "");

        GatewayDispute dispute = GatewayDispute.builder()
                .disputeReference(disputeRef)
                .paymentIntentId(intent.getId())
                .merchantId(intent.getMerchantId())
                .amount(intent.getAmount())
                .currency(intent.getCurrency())
                .reasonCode(reasonCode)
                .status("OPEN")
                .build();

        GatewayDispute saved = gatewayDisputeJpaRepository.save(dispute);
        
        log.warn("[GATEWAY DISPUTE] Dispute {} opened for PaymentIntent {}", disputeRef, intentId);

        // Transition immediately to UNDER_INVESTIGATION for operational handling
        saved.setStatus("UNDER_INVESTIGATION");
        gatewayDisputeJpaRepository.save(saved);

        // Dispatch Webhook to notify the Merchant of the dispute
        String payload = String.format("{\"event\":\"payment.disputed\", \"intentId\":\"%s\", \"disputeReference\":\"%s\", \"reason\":\"%s\"}", 
                intentId, disputeRef, reasonCode);
        
        webhookDispatcherService.dispatchEvent(intent.getMerchantId(), "payment.disputed", payload);

        auditEventPublisher.publishEvent("GATEWAY_DISPUTE_OPENED", intent.getMerchantId().toString(), 
                "Consumer filed a dispute against payment intent " + intentId, disputeRef);

        return saved;
    }
}
