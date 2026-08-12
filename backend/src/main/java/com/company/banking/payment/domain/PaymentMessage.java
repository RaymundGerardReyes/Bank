package com.company.banking.payment.domain;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "payment_messages")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PaymentMessage {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "message_id", nullable = false, unique = true)
    private String messageId;

    @Column(name = "payment_intent_id", nullable = false)
    private Long paymentIntentId;

    @Column(name = "message_type", nullable = false)
    private String messageType; // e.g. pacs.008.001.08

    @Column(nullable = false)
    private String version;

    @Column(name = "sender_bic", nullable = false)
    private String senderBic;

    @Column(name = "receiver_bic", nullable = false)
    private String receiverBic;

    @Column(name = "payload_xml", nullable = false, columnDefinition = "TEXT")
    private String payloadXml;

    @Column(name = "validation_status", nullable = false)
    private String validationStatus; // VALID, INVALID

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        if (this.validationStatus == null) {
            this.validationStatus = "VALID";
        }
    }
}
