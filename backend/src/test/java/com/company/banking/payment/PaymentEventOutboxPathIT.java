package com.company.banking.payment;

import com.company.banking.apigateway.infrastructure.WebhookEndpointJpaRepository;
import com.company.banking.payment.application.MerchantWebhookDeliveryService;
import com.company.banking.payment.application.PaymentEventOutboxRelay;
import com.company.banking.payment.domain.PaymentEventOutbox;
import com.company.banking.payment.domain.PaymentEventOutboxStatus;
import com.company.banking.payment.domain.PaymentEventType;
import com.company.banking.payment.infrastructure.PaymentEventOutboxJpaRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@ActiveProfiles("test")
public class PaymentEventOutboxPathIT {

    @Autowired
    private PaymentEventOutboxRelay outboxRelay;

    @Autowired
    private MerchantWebhookDeliveryService deliveryService;

    @Autowired
    private PaymentEventOutboxJpaRepository outboxRepository;

    @Autowired
    private WebhookEndpointJpaRepository webhookEndpointRepository;

    private PaymentEventOutbox pendingEvent;

    @BeforeEach
    public void setup() {
        outboxRepository.deleteAll();

        pendingEvent = PaymentEventOutbox.builder()
                .eventId("evt_" + UUID.randomUUID().toString().replaceAll("-", ""))
                .merchantId(101L)
                .aggregateType("CheckoutSession")
                .aggregateId("cs_" + UUID.randomUUID().toString().replaceAll("-", ""))
                .sequence(1)
                .idempotencyKey("idem_" + UUID.randomUUID().toString())
                .eventType(PaymentEventType.CHECKOUT_PAYMENT_SUCCEEDED)
                .apiVersion("v1")
                .payload("{\"status\": \"COMPLETED\"}")
                .status(PaymentEventOutboxStatus.PENDING)
                .attemptCount(0)
                .createdAt(LocalDateTime.now())
                .build();
        pendingEvent = outboxRepository.save(pendingEvent);
    }

    @Test
    @DisplayName("P01: Claim events successfully updates status to DELIVERING and assigns worker lock")
    public void p01_ClaimEvents_UpdatesStatusAndWorkerLock() {
        List<PaymentEventOutbox> claimed = outboxRelay.claimEvents(10);

        assertFalse(claimed.isEmpty(), "Outbox relay must claim available pending events");
        PaymentEventOutbox claimedEvent = outboxRepository.findById(pendingEvent.getId()).orElseThrow();
        assertEquals(PaymentEventOutboxStatus.DELIVERING, claimedEvent.getStatus());
        assertNotNull(claimedEvent.getLockedAt());
        assertNotNull(claimedEvent.getLockedBy());
    }

    @Test
    @DisplayName("P02: Outbox delivery attempt without active endpoints updates status to RETRY")
    public void p02_MissingEndpoint_TriggersFailureHandler() {
        deliveryService.deliverEvent(pendingEvent);

        PaymentEventOutbox processedEvent = outboxRepository.findById(pendingEvent.getId()).orElseThrow();
        assertEquals(PaymentEventOutboxStatus.RETRY, processedEvent.getStatus());
        assertEquals(1, processedEvent.getAttemptCount());
        assertNotNull(processedEvent.getNextAttemptAt());
    }

    @Test
    @DisplayName("P03: Event exhausting 6 total attempts transitions to DEAD_LETTER")
    public void p03_DeadLetterQueue_OnMaxAttemptsExhausted() {
        pendingEvent.setAttemptCount(5);
        pendingEvent.setStatus(PaymentEventOutboxStatus.RETRY);
        pendingEvent.setNextAttemptAt(LocalDateTime.now().minusMinutes(1));
        outboxRepository.save(pendingEvent);

        deliveryService.deliverEvent(pendingEvent);

        PaymentEventOutbox processedEvent = outboxRepository.findById(pendingEvent.getId()).orElseThrow();
        assertEquals(PaymentEventOutboxStatus.DEAD_LETTER, processedEvent.getStatus());
        assertEquals(6, processedEvent.getAttemptCount());
    }

    @Test
    @DisplayName("P04: Background lease recovery reclaims stuck deliveries locked by crashed workers")
    public void p04_LeaseRecovery_ReclaimsLockedEvents() {
        pendingEvent.setStatus(PaymentEventOutboxStatus.DELIVERING);
        pendingEvent.setLockedAt(LocalDateTime.now().minusMinutes(10));
        pendingEvent.setLockedBy("crashed-worker-uuid");
        outboxRepository.save(pendingEvent);

        outboxRelay.recoverStuckLeases();

        PaymentEventOutbox recoveredEvent = outboxRepository.findById(pendingEvent.getId()).orElseThrow();
        assertEquals(PaymentEventOutboxStatus.RETRY, recoveredEvent.getStatus(), "Lease should be broken and reset to RETRY");
        assertNull(recoveredEvent.getLockedAt(), "Lock timestamp must be cleared");
        assertNull(recoveredEvent.getLockedBy(), "Lock worker ID must be cleared");
    }
}
