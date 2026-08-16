package com.company.banking.payment.application;

import com.company.banking.common.audit.AuditEventPublisher;
import com.company.banking.payment.domain.PaymentAttempt;
import com.company.banking.payment.domain.PaymentEvent;
import com.company.banking.payment.domain.PaymentIntent;
import com.company.banking.payment.gateway.ExternalPaymentGateway;
import com.company.banking.payment.gateway.dto.GatewayPaymentStatus;
import com.company.banking.payment.infrastructure.PaymentAttemptJpaRepository;
import com.company.banking.payment.infrastructure.PaymentEventJpaRepository;
import com.company.banking.payment.infrastructure.PaymentIntentJpaRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

import com.company.banking.payment.domain.PaymentSession;
import com.company.banking.payment.domain.PaymentSessionStatus;
import com.company.banking.payment.infrastructure.PaymentSessionJpaRepository;
import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
@Slf4j
public class PaymentReconciliationService {

    private final PaymentIntentJpaRepository intentRepository;
    private final PaymentAttemptJpaRepository attemptRepository;
    private final PaymentSessionJpaRepository sessionRepository;
    private final PaymentEventJpaRepository eventRepository;
    private final List<ExternalPaymentGateway> gateways;
    private final PaymentStateMachineService stateMachineService;
    private final InstitutionCallbackService institutionCallbackService;
    private final AuditEventPublisher auditEventPublisher;

    /**
     * Executes automatically every 15 minutes (configurable via properties).
     * Sweeps for intents stuck in PROCESSING and manually verifies them with the provider.
     */
    @Scheduled(cron = "${payment.reconciliation.cron:0 0/15 * * * ?}")
    @Transactional
    public void reconcileStuckPayments() {
        log.info("[RECONCILIATION] Starting scheduled sweep for stuck PAYMENT_INTENTS...");

        List<PaymentIntent> stuckIntents = intentRepository.findAll().stream()
                .filter(intent -> "PROCESSING".equals(intent.getStatus()))
                .toList();

        for (PaymentIntent intent : stuckIntents) {
            try {
                // 1. Find the latest provider attempt mapped to this intent
                PaymentAttempt attempt = attemptRepository.findAll().stream()
                        .filter(a -> a.getPaymentIntentId().equals(intent.getId()))
                        .findFirst()
                        .orElse(null);

                if (attempt == null || attempt.getProviderReference() == null) continue;

                // 2. Resolve the correct gateway dynamically
                ExternalPaymentGateway gateway = gateways.stream()
                        .filter(g -> g.getProvider().name().equalsIgnoreCase(attempt.getProvider()))
                        .findFirst()
                        .orElseThrow(() -> new IllegalStateException("No active gateway found for " + attempt.getProvider()));

                // 3. Actively poll the external provider for the true status
                GatewayPaymentStatus gatewayStatus = gateway.getStatus(attempt.getProviderReference());
                String mappedStatus = gatewayStatus.name();

                // 4. If the provider reports a terminal state, drive the state machine
                if ("SUCCESS".equals(mappedStatus) || "FAILED".equals(mappedStatus) || "CANCELLED".equals(mappedStatus) || "EXPIRED".equals(mappedStatus)) {
                    log.info("[RECONCILIATION] Intent {} resolved as {}. Creating synthetic event.", intent.getIntentId(), mappedStatus);

                    PaymentEvent syntheticEvent = PaymentEvent.builder()
                            .eventId("REC-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase())
                            .paymentIntentId(intent.getId())
                            .eventType("SYSTEM_RECONCILIATION_UPDATE")
                            .rawPayload("{\"status\":\"" + mappedStatus + "\", \"source\":\"reconciliation_cron\"}")
                            .idempotencyKey("RECONCILE-" + intent.getIntentId() + "-" + System.currentTimeMillis())
                            .build();

                    syntheticEvent = eventRepository.save(syntheticEvent);

                    stateMachineService.processWebhookEventAsync(syntheticEvent.getId(), gateway.getProvider().name());

                    auditEventPublisher.publishEvent(
                            "PAYMENT_RECONCILED", 
                            "SYSTEM_CRON", 
                            "Reconciliation job successfully synchronized intent " + intent.getIntentId() + " to " + mappedStatus, 
                            intent.getIntentId()
                    );
                }
            } catch (Exception e) {
                log.error("[RECONCILIATION] Failed to reconcile intent {}", intent.getIntentId(), e);
            }
        }
        
        log.info("[RECONCILIATION] Sweep completed. Processed {} intents.", stuckIntents.size());
    }

    /**
     * Scheduled job for Phase I: Sweeps institutional PaymentSession records stuck in PROCESSING
     * that missed provider webhook notifications.
     */
    @Scheduled(cron = "${payment.reconciliation.session-cron:0 0/30 * * * ?}")
    @Transactional
    public void reconcileStuckSessions() {
        log.info("[RECONCILIATION] Sweeping for stuck institutional PaymentSessions...");

        List<PaymentSession> stuckSessions = sessionRepository.findAll().stream()
                .filter(session -> session.getStatus() == PaymentSessionStatus.PROCESSING)
                .filter(session -> session.getCreatedAt() != null && session.getCreatedAt().isBefore(LocalDateTime.now().minusMinutes(15)))
                .toList();

        for (PaymentSession session : stuckSessions) {
            try {
                PaymentAttempt attempt = attemptRepository.findAll().stream()
                        .filter(a -> session.getSessionId().equals(a.getPaymentSessionId()))
                        .findFirst()
                        .orElse(null);

                if (attempt == null || attempt.getProviderReference() == null) continue;

                ExternalPaymentGateway gateway = gateways.stream()
                        .filter(g -> g.getProvider().name().equalsIgnoreCase(attempt.getProvider()))
                        .findFirst()
                        .orElse(null);

                if (gateway == null) continue;

                GatewayPaymentStatus gatewayStatus = gateway.getStatus(attempt.getProviderReference());
                String statusName = gatewayStatus.name();

                if ("SUCCESS".equals(statusName) || "FAILED".equals(statusName) || "CANCELLED".equals(statusName)) {
                    log.info("[RECONCILIATION] Session {} attempt resolved to {}", session.getSessionId(), statusName);
                    stateMachineService.processAttemptOutcome(attempt.getProviderReference(), statusName, "SYSTEM_RECONCILIATION");
                }
            } catch (Exception e) {
                log.error("[RECONCILIATION] Failed to reconcile session {}", session.getSessionId(), e);
            }
        }

        log.info("[RECONCILIATION] Session sweep completed. Evaluated {} sessions.", stuckSessions.size());
    }
}