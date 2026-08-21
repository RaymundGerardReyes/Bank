package com.company.banking.payment.domain;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

/**
 * Phase G: Persists every inbound webhook delivery from external payment providers
 * (PayMongo, Paynamics, Maya). The composite unique constraint on (provider, externalEventId)
 * is the hard idempotency boundary — if the same event arrives twice due to provider retries,
 * the second insert will be rejected and processing will be skipped safely.
 */
@Entity
@Table(
    name = "inbound_webhook_events",
    uniqueConstraints = @UniqueConstraint(
        name = "uq_inbound_webhook_provider_event",
        columnNames = {"provider", "external_event_id"}
    )
)
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class InboundWebhookEvent {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /** The upstream provider name, e.g. "PAYMONGO", "PAYNAMICS", "MAYA". */
    @Column(nullable = false, length = 50)
    private String provider;

    /** The stable, unique event ID assigned by the provider. Used for deduplication. */
    @Column(name = "external_event_id", nullable = false, length = 255)
    private String externalEventId;

    /** The provider-specific event type, e.g. "checkout_session.payment.paid". */
    @Column(name = "event_type", nullable = false, length = 100)
    private String eventType;

    /** The verbatim raw bytes received as UTF-8 text. MUST NOT be re-serialized before HMAC verification. */
    @Column(name = "raw_payload", columnDefinition = "TEXT", nullable = false)
    private String rawPayload;

    /** The full value of the provider's signature header for audit purposes. */
    @Column(name = "signature_header", length = 512)
    private String signatureHeader;

    /** True if signature verification passed before processing began. */
    @Column(nullable = false)
    private boolean verified;

    /** The provider's payment/checkout reference extracted from the event payload. */
    @Column(name = "provider_reference", length = 255)
    private String providerReference;

    /** The canonical status derived from the event after normalization (e.g. SUCCESS, FAILED). */
    @Column(name = "normalized_status", length = 50)
    private String normalizedStatus;

    @Column(name = "received_at", nullable = false, updatable = false)
    private LocalDateTime receivedAt;

    @Column(name = "processed_at")
    private LocalDateTime processedAt;

    /** Processing lifecycle: RECEIVED, VERIFIED, PROCESSING, PROCESSED, FAILED, REQUIRES_REVIEW */
    @Column(name = "processing_status", nullable = false, length = 50)
    private String processingStatus;

    /** If processing fails, the reason is captured here for audit/review. */
    @Column(name = "failure_reason", columnDefinition = "TEXT")
    private String failureReason;

    /** How many times we attempted to process this event (if queued/retried). */
    @Column(name = "attempt_count", nullable = false)
    private Integer attemptCount;

    @PrePersist
    protected void onCreate() {
        this.receivedAt = LocalDateTime.now();
        if (this.processingStatus == null) {
            this.processingStatus = "RECEIVED";
        }
        if (this.attemptCount == null) {
            this.attemptCount = 0;
        }
    }
}
