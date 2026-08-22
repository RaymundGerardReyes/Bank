package com.company.banking.payment.application;

import com.company.banking.payment.domain.PaymentEventOutbox;
import com.company.banking.payment.domain.PaymentEventOutboxStatus;
import com.company.banking.payment.domain.PaymentEventType;
import com.company.banking.payment.domain.PaymentIntent;
import com.company.banking.payment.domain.Refund;
import com.company.banking.payment.infrastructure.PaymentEventOutboxJpaRepository;
import com.company.banking.transaction.domain.Transaction;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

import com.company.banking.common.exception.BusinessException;
import com.company.banking.common.exception.ErrorCode;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Slf4j
public class PaymentEventOutboxService {

    private final PaymentEventOutboxJpaRepository outboxRepository;
    private final ObjectMapper objectMapper;

    // Called from within InternalPaymentExecutionService.capturePayment
    public void enqueuePaymentSucceeded(PaymentIntent intent, Transaction transaction) {
        String eventId = "evt_" + UUID.randomUUID().toString().replace("-", "");
        int nextSequence = outboxRepository.countByAggregateTypeAndAggregateId("PAYMENT_INTENT", intent.getIntentId()) + 1;
        
        try {
            // Immutable canonical payload matching the public contract
            Map<String, Object> sessionData = new HashMap<>();
            sessionData.put("id", intent.getIntentId()); // Map to public session reference
            sessionData.put("status", "PAID");
            sessionData.put("amount", intent.getAmount());
            sessionData.put("currency", intent.getCurrency());
            
            Map<String, Object> paymentData = new HashMap<>();
            paymentData.put("reference", transaction.getTransactionReference());

            Map<String, Object> dataNode = new HashMap<>();
            dataNode.put("checkout_session", sessionData);
            dataNode.put("payment", paymentData);

            Map<String, Object> finalPayload = new HashMap<>();
            finalPayload.put("id", eventId);
            finalPayload.put("type", PaymentEventType.CHECKOUT_PAYMENT_SUCCEEDED.name());
            finalPayload.put("api_version", "v1");
            finalPayload.put("created_at", LocalDateTime.now().toString());
            finalPayload.put("data", dataNode);

            PaymentEventOutbox event = PaymentEventOutbox.builder()
                    .eventId(eventId)
                    .merchantId(intent.getMerchantId())
                    .aggregateType("PAYMENT_INTENT")
                    .aggregateId(intent.getIntentId())
                    .sequence(nextSequence)
                    .apiVersion("v1")
                    .idempotencyKey("payment-succeeded:" + intent.getIntentId())
                    .eventType(PaymentEventType.CHECKOUT_PAYMENT_SUCCEEDED)
                    .payload(objectMapper.writeValueAsString(finalPayload))
                    .status(PaymentEventOutboxStatus.PENDING)
                    .attemptCount(0)
                    .build();

            outboxRepository.save(event);
            log.info("[OUTBOX] Enqueued {} for Intent {} (Seq: {})", event.getEventType(), intent.getIntentId(), nextSequence);
        } catch (Exception e) {
            log.error("Failed to construct outbox payload for intent {}", intent.getIntentId(), e);
            throw new RuntimeException("Could not serialize outbox event", e);
        }
    }

    public void enqueuePaymentRefunded(PaymentIntent intent, Refund refund) {
        String eventId = "evt_" + UUID.randomUUID().toString().replace("-", "");
        int nextSequence = outboxRepository.countByAggregateTypeAndAggregateId("PAYMENT_INTENT", intent.getIntentId()) + 1;

        try {
            Map<String, Object> refundData = new HashMap<>();
            refundData.put("id", refund.getRefundId());
            refundData.put("paymentIntentId", intent.getIntentId());
            refundData.put("amount", refund.getAmount());
            refundData.put("reason", refund.getReason());
            refundData.put("status", intent.getStatus().name());

            Map<String, Object> dataNode = new HashMap<>();
            dataNode.put("refund", refundData);

            Map<String, Object> finalPayload = new HashMap<>();
            finalPayload.put("id", eventId);
            finalPayload.put("type", PaymentEventType.CHECKOUT_PAYMENT_REFUNDED.name());
            finalPayload.put("api_version", "v1");
            finalPayload.put("created_at", LocalDateTime.now().toString());
            finalPayload.put("data", dataNode);

            PaymentEventOutbox event = PaymentEventOutbox.builder()
                    .eventId(eventId)
                    .merchantId(intent.getMerchantId())
                    .aggregateType("PAYMENT_INTENT")
                    .aggregateId(intent.getIntentId())
                    .sequence(nextSequence)
                    .apiVersion("v1")
                    .idempotencyKey("payment-refunded:" + refund.getRefundId())
                    .eventType(PaymentEventType.CHECKOUT_PAYMENT_REFUNDED)
                    .payload(objectMapper.writeValueAsString(finalPayload))
                    .status(PaymentEventOutboxStatus.PENDING)
                    .attemptCount(0)
                    .build();

            outboxRepository.save(event);
            log.info("[OUTBOX] Enqueued {} for Refund {} (Seq: {})", event.getEventType(), refund.getRefundId(), nextSequence);

        } catch (Exception e) {
            log.error("Failed to construct outbox payload for refund {}", refund.getRefundId(), e);
            throw new RuntimeException("Could not serialize outbox event", e);
        }
    }

    // Operational Endpoint: Dead-Letter Replay
    @Transactional
    public void replayDeadLetterEvent(String eventId) {
        PaymentEventOutbox event = outboxRepository.findByEventId(eventId)
                .orElseThrow(() -> new BusinessException(ErrorCode.NOT_FOUND, "Event not found"));

        if (event.getStatus() != PaymentEventOutboxStatus.DEAD_LETTER) {
            throw new BusinessException(ErrorCode.INVALID_REQUEST, "Only DEAD_LETTER events can be replayed. Current status: " + event.getStatus());
        }

        log.info("[OUTBOX] Operator triggered replay for DEAD_LETTER event {}", eventId);
        
        event.setStatus(PaymentEventOutboxStatus.RETRY);
        event.setNextAttemptAt(LocalDateTime.now());
        event.setLastError("Replayed by Operator");
        // DO NOT reset attemptCount; we want to preserve the history of how many times it failed previously
        outboxRepository.save(event);
    }
}
