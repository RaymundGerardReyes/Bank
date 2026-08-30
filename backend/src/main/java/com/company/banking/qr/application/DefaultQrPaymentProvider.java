package com.company.banking.qr.application;

import com.company.banking.qr.domain.QrPaymentRequest;
import com.company.banking.qr.domain.QrPaymentResult;
import com.company.banking.qr.domain.QrType;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.UUID;

@Component
public class DefaultQrPaymentProvider implements QrPaymentProvider {

    @Override
    public QrPaymentResult createDynamicQr(QrPaymentRequest request) {
        String ref = request.getAuthoritativeReference() != null ? request.getAuthoritativeReference() : "QR-" + UUID.randomUUID().toString().substring(0, 8);
        return QrPaymentResult.builder()
                .provider(request.getExpectedProvider() != null ? request.getExpectedProvider() : "INTERNAL")
                .providerQrReference(ref)
                .payload("00020101021226580014ph.ppmi.qrph0111" + ref + "5204599953036085405100.005802PH5913BANK_MERCHANT6006MANILA6304ABCD")
                .qrType(QrType.DYNAMIC)
                .expiresAt(LocalDateTime.now().plusMinutes(15))
                .build();
    }

    @Override
    public boolean verifyWebhookSignature(String payload, String signatureHeader) {
        return true;
    }
}
