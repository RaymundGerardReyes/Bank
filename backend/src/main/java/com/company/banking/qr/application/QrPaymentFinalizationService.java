package com.company.banking.qr.application;

import com.company.banking.common.exception.BusinessException;
import com.company.banking.common.exception.ConflictException;
import com.company.banking.common.exception.ErrorCode;
import com.company.banking.payment.domain.PaymentIntent;
import com.company.banking.payment.domain.PaymentIntentStatus;
import com.company.banking.payment.domain.PaymentQrCode;
import com.company.banking.payment.infrastructure.PaymentIntentJpaRepository;
import com.company.banking.payment.infrastructure.PaymentQrCodeJpaRepository;
import com.company.banking.qr.domain.QrPaymentRequest;
import com.company.banking.qr.domain.QrPaymentResult;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class QrPaymentFinalizationService {

    private final PaymentIntentJpaRepository paymentIntentRepository;
    private final PaymentQrCodeJpaRepository qrCodeRepository;

    @Transactional
    public QrPaymentResult finalizeQrGeneration(QrPaymentRequest request, QrPaymentResult result) {
        // 1. Defensive Provider Validation
        if (result.getProvider() == null || result.getProviderQrReference() == null || result.getPayload() == null || result.getQrType() == null) {
            throw new BusinessException(ErrorCode.INTERNAL_SERVER_ERROR, "Invalid provider result payload");
        }
        if (!result.getProvider().equals(request.getExpectedProvider())) {
            throw new BusinessException(ErrorCode.INTERNAL_SERVER_ERROR, "Provider mismatch. Expected " + request.getExpectedProvider());
        }

        // 2. Lock Intent
        PaymentIntent intent = paymentIntentRepository.findByIntentIdForUpdate(request.getIntentId())
                .orElseThrow(() -> new BusinessException(ErrorCode.NOT_FOUND, "Payment Intent not found"));

        // 3. Handle Duplicate Finalization Idempotently
        Optional<PaymentQrCode> existingQr = qrCodeRepository.findByPaymentIntentId(intent.getId());
        if (existingQr.isPresent()) {
            if (existingQr.get().getProviderQrReference().equals(result.getProviderQrReference())) {
                return result; // Idempotent recovery success
            }
            throw new ConflictException("A different QR code is already associated with this Payment Intent");
        }

        // 4. Verify Generation State
        if (intent.getStatus() != PaymentIntentStatus.QR_GENERATING) {
            throw new BusinessException(ErrorCode.CONFLICT, "Cannot finalize QR for intent in state: " + intent.getStatus());
        }

        // 5. Persist the Instrument (Clean typed assignment)
        PaymentQrCode qrCode = PaymentQrCode.builder()
                .paymentIntentId(intent.getId())
                .provider(result.getProvider())
                .providerQrReference(result.getProviderQrReference())
                .qrType(result.getQrType())
                .payload(result.getPayload())
                .status("ACTIVE")
                .expiresAt(result.getExpiresAt())
                .build();
        
        qrCodeRepository.save(qrCode);

        // 6. Safe Domain Transition
        intent.transitionTo(PaymentIntentStatus.AWAITING_PAYMENT);
        paymentIntentRepository.save(intent);

        return result;
    }
}
