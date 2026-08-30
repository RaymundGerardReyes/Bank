package com.company.banking.qr.application;

import com.company.banking.qr.domain.QrPaymentRequest;
import com.company.banking.qr.domain.QrPaymentResult;

public interface QrPaymentProvider {
    /**
     * Generates a dynamic QR via the participating PSP/bank.
     * 
     * INVARIANT: The concrete production adapter MUST map request.getIdempotencyKey() 
     * to the provider's documented idempotency mechanism (e.g., an Idempotency-Key HTTP header).
     * This guarantees that network retries converge on the same external operation.
     */
    QrPaymentResult createDynamicQr(QrPaymentRequest request);

    boolean verifyWebhookSignature(String payload, String signatureHeader);
}
