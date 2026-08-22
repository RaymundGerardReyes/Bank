package com.company.banking.payment.application;

import com.company.banking.payment.domain.PaymentEventOutbox;
import com.company.banking.payment.domain.PaymentEventOutboxStatus;
import com.company.banking.payment.infrastructure.PaymentEventOutboxJpaRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.concurrent.CompletableFuture;

@Service
@RequiredArgsConstructor
@Slf4j
public class PaymentEventOutboxRelay {

    private final PaymentEventOutboxJpaRepository outboxRepository;
    private final MerchantWebhookDeliveryService deliveryService;
    private final String workerId = UUID.randomUUID().toString();

    @Scheduled(fixedDelay = 5000)
    public void processOutbox() {
        List<PaymentEventOutbox> claimedEvents = claimEvents(10);
        
        // Dispatch asynchronously so the claiming transaction commits immediately,
        // preventing long database locks during HTTP calls.
        for (PaymentEventOutbox event : claimedEvents) {
            CompletableFuture.runAsync(() -> deliveryService.deliverEvent(event));
        }
    }

    @Transactional
    public List<PaymentEventOutbox> claimEvents(int limit) {
        List<PaymentEventOutbox> events = outboxRepository.findAndLockEligibleEvents(limit);
        for (PaymentEventOutbox event : events) {
            event.setStatus(PaymentEventOutboxStatus.DELIVERING);
            event.setLockedAt(LocalDateTime.now());
            event.setLockedBy(workerId);
            outboxRepository.save(event);
        }
        return events;
    }

    // Recovers events where a worker crashed mid-delivery (Lease mechanism)
    @Scheduled(fixedDelay = 60000)
    @Transactional
    public void recoverStuckLeases() {
        LocalDateTime threshold = LocalDateTime.now().minusMinutes(5);
        List<PaymentEventOutbox> stuckEvents = outboxRepository.findStuckDeliveries(threshold);
        
        for (PaymentEventOutbox event : stuckEvents) {
            log.warn("[OUTBOX RELAY] Recovering stuck event {} previously locked by {}", event.getEventId(), event.getLockedBy());
            event.setStatus(PaymentEventOutboxStatus.RETRY);
            event.setLockedAt(null);
            event.setLockedBy(null);
            outboxRepository.save(event);
        }
    }
}
