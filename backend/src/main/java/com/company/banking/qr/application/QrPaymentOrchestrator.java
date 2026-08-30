package com.company.banking.qr.application;

import com.company.banking.qr.domain.QrPaymentRequest;
import com.company.banking.qr.domain.QrPaymentResult;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class QrPaymentOrchestrator {

    private final QrPaymentPreparationService preparationService;
    private final QrPaymentProvider qrPaymentProvider;
    private final QrPaymentFinalizationService finalizationService;

    public QrPaymentResult generateDynamicQrForIntent(Long authenticatedCustomerId, String intentId) {
        log.info("[QR ORCHESTRATOR] Initiating QR generation for intent: {}", intentId);

        // Transaction 1: Prepare and commit QR_GENERATING state
        QrPaymentRequest request = preparationService.prepareQrGeneration(authenticatedCustomerId, intentId);

        // Network I/O outside DB transaction
        QrPaymentResult result = qrPaymentProvider.createDynamicQr(request);

        // Transaction 2: Finalize and commit AWAITING_PAYMENT state & PaymentQrCode entity
        return finalizationService.finalizeQrGeneration(request, result);
    }
}
