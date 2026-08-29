package com.company.banking.payment.application.idempotency;

import com.company.banking.payment.application.idempotency.PaymentRequestNormalizer.NormalizedPaymentRequest;
import org.springframework.stereotype.Service;

import java.nio.ByteBuffer;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.Base64;

@Service
public class PaymentFingerprintService {

    public String generateFingerprint(NormalizedPaymentRequest request) {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");

            // Merchant ID
            appendString(digest, request.getMerchantId() != null ? request.getMerchantId().toString() : null);

            // Canonical boundary appending for string fields
            appendString(digest, request.getSourceAccount());
            
            // Amount
            appendString(digest, request.getAmount().getAmount().toPlainString());
            
            // Currency
            appendString(digest, request.getAmount().getCurrency().name());
            
            // Reference
            appendString(digest, request.getReference());

            // Description
            appendString(digest, request.getDescription());

            return Base64.getEncoder().encodeToString(digest.digest());

        } catch (NoSuchAlgorithmException e) {
            throw new RuntimeException("SHA-256 not available", e);
        }
    }

    private void appendString(MessageDigest digest, String value) {
        if (value == null) {
            // Unambiguous NULL marker
            digest.update((byte) 0x00);
        } else {
            // Value marker
            digest.update((byte) 0x01);
            
            byte[] bytes = value.getBytes(StandardCharsets.UTF_8);
            
            // Safe explicit integer length allocation (protects against byte shifting)
            digest.update(ByteBuffer.allocate(Integer.BYTES).putInt(bytes.length).array());
            
            digest.update(bytes);
        }
    }
}
