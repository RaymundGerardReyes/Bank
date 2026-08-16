package com.company.banking.payment.application;

import com.company.banking.common.audit.AuditEventPublisher;
import com.company.banking.common.exception.BusinessException;
import com.company.banking.common.exception.ErrorCode;
import com.company.banking.common.exception.NotFoundException;
import com.company.banking.payment.domain.DynamicQrPayment;
import com.company.banking.payment.domain.PaymentIntent;
import com.company.banking.payment.infrastructure.DynamicQrPaymentJpaRepository;
import com.company.banking.payment.infrastructure.PaymentIntentJpaRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.UUID;

import com.company.banking.payment.domain.PaymentIntentStatus;

@Service
@RequiredArgsConstructor
@Slf4j
public class DynamicQrService {

    private final DynamicQrPaymentJpaRepository dynamicQrPaymentJpaRepository;
    private final PaymentIntentJpaRepository paymentIntentJpaRepository;
    private final AuditEventPublisher auditEventPublisher;

    /**
     * Generates a Dynamic QR mapping 1:1 to a PaymentIntent.
     */
    @Transactional
    public DynamicQrPayment generateQrForIntent(String intentId, Long merchantId) {
        PaymentIntent intent = paymentIntentJpaRepository.findByIntentId(intentId)
                .orElseThrow(() -> new NotFoundException("PaymentIntent not found"));

        if (!intent.getMerchantId().equals(merchantId)) {
            auditEventPublisher.publishEvent("OBJECT_LEVEL_AUTH_FAILED", merchantId.toString(), "Attempted to generate QR for another merchant's Intent", intentId);
            throw new BusinessException(ErrorCode.FORBIDDEN, "Access Denied: PaymentIntent belongs to a different merchant.");
        }

        if (dynamicQrPaymentJpaRepository.findByPaymentIntentId(intent.getId()).isPresent()) {
            throw new BusinessException(ErrorCode.INVALID_REQUEST, "A QR code has already been generated for this PaymentIntent.");
        }

        String qrRef = "QR-" + UUID.randomUUID().toString().replace("-", "").toUpperCase();
        
        // Mocking EMVCo QR Ph payload format
        String qrPayload = String.format("000201010212...540%05.2f5802PH...6304XXXX", intent.getAmount());

        DynamicQrPayment qrPayment = DynamicQrPayment.builder()
                .qrReference(qrRef)
                .paymentIntentId(intent.getId())
                .qrPayload(qrPayload)
                .status("ACTIVE")
                .expiresAt(LocalDateTime.now().plusMinutes(15)) // 15 minute dynamic expiration
                .build();

        DynamicQrPayment saved = dynamicQrPaymentJpaRepository.save(qrPayment);
        
        // Update intent status to QR_GENERATED as per state machine
        intent.setStatus(PaymentIntentStatus.QR_GENERATED);
        paymentIntentJpaRepository.save(intent);

        log.info("[DYNAMIC QR] Generated QR {} for Intent {}", qrRef, intentId);
        auditEventPublisher.publishEvent("DYNAMIC_QR_GENERATED", merchantId.toString(), "Generated QR Ph P2M Payload", qrRef);

        return saved;
    }

    /**
     * Called when a customer's banking app scans the QR. 
     * Enforces server-side authoritative validation and prevents duplicate scanning.
     */
    @Transactional
    public PaymentIntent processQrScan(String qrReference) {
        DynamicQrPayment qrPayment = dynamicQrPaymentJpaRepository.findByQrReference(qrReference)
                .orElseThrow(() -> new NotFoundException("QR Code not found or invalid"));

        if (qrPayment.getExpiresAt().isBefore(LocalDateTime.now())) {
            qrPayment.setStatus("EXPIRED");
            dynamicQrPaymentJpaRepository.save(qrPayment);
            
            // Also expire the parent intent
            PaymentIntent intent = paymentIntentJpaRepository.findById(qrPayment.getPaymentIntentId()).orElseThrow();
            intent.setStatus(PaymentIntentStatus.FAILED); // Or EXPIRED
            paymentIntentJpaRepository.save(intent);
            
            throw new BusinessException(ErrorCode.INVALID_REQUEST, "This QR code has expired.");
        }

        if (!"ACTIVE".equals(qrPayment.getStatus())) {
            throw new BusinessException(ErrorCode.INVALID_REQUEST, "This QR code cannot be scanned. Current status: " + qrPayment.getStatus());
        }

        // 1. Authoritatively load the underlying PaymentIntent instead of trusting the scanned amount
        PaymentIntent intent = paymentIntentJpaRepository.findById(qrPayment.getPaymentIntentId())
                .orElseThrow(() -> new NotFoundException("Underlying PaymentIntent not found"));

        // 2. Mark QR as SCANNED to enforce idempotency (duplicate scan protection)
        qrPayment.setStatus("SCANNED");
        qrPayment.setScannedAt(LocalDateTime.now());
        dynamicQrPaymentJpaRepository.save(qrPayment);

        // 3. Move Intent to PENDING (awaiting customer confirmation on their EMI/Bank app)
        intent.setStatus(PaymentIntentStatus.PENDING);
        paymentIntentJpaRepository.save(intent);

        log.info("[DYNAMIC QR] QR {} scanned. Transitioned Intent {} to PENDING.", qrReference, intent.getIntentId());
        
        auditEventPublisher.publishEvent("DYNAMIC_QR_SCANNED", "SYSTEM", "Customer scanned QR code. Awaiting authorization.", qrReference);

        return intent;
    }
}
