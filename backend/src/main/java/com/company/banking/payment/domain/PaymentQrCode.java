package com.company.banking.payment.domain;

import com.company.banking.qr.domain.QrType;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "payment_qr_codes")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PaymentQrCode {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "payment_intent_id", nullable = false, unique = true)
    private Long paymentIntentId;

    @Column(nullable = false)
    private String provider;

    @Column(name = "provider_qr_reference", nullable = false)
    private String providerQrReference;

    @Enumerated(EnumType.STRING)
    @Column(name = "qr_type", nullable = false)
    private QrType qrType;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String payload;

    @Column(nullable = false)
    private String status;

    @Column(name = "expires_at")
    private LocalDateTime expiresAt;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        if (this.status == null) this.status = "ACTIVE";
    }
}
