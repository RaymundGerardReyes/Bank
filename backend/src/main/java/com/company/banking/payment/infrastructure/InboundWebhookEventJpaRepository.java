package com.company.banking.payment.infrastructure;

import com.company.banking.payment.domain.InboundWebhookEvent;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

/**
 * Repository for inbound_webhook_events.
 * The primary guard is existsByProviderAndExternalEventId — called before any processing
 * begins to enforce the (provider, external_event_id) idempotency contract.
 */
@Repository
public interface InboundWebhookEventJpaRepository extends JpaRepository<InboundWebhookEvent, Long> {

    /**
     * Core idempotency check. Returns true if this event has already been received and persisted.
     * If true, the caller must silently acknowledge the webhook and skip re-processing.
     */
    boolean existsByProviderAndExternalEventId(String provider, String externalEventId);

    Optional<InboundWebhookEvent> findByProviderAndExternalEventId(String provider, String externalEventId);
}
