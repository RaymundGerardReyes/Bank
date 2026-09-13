package com.company.banking.apigateway.presentation;

import com.company.banking.apigateway.security.ApiKeyAuthenticationToken;
import com.company.banking.payment.application.DynamicQrService;
import com.company.banking.payment.domain.DynamicQrPayment;
import com.company.banking.payment.domain.PaymentIntent;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/gateway/payment-intents")
@RequiredArgsConstructor
public class DynamicQrController {

    private final DynamicQrService dynamicQrService;

    /**
     * Merchant generates a QR for a previously created PaymentIntent.
     */
    @PostMapping("/{intentId}/qr")
    public ResponseEntity<DynamicQrPayment> generateQr(
            @PathVariable String intentId, 
            @RequestHeader(value = "X-Merchant-Id", required = false) Long merchantIdHeader,
            Authentication authentication) {
            
        Long merchantId = merchantIdHeader;
        if (merchantId == null && authentication != null) {
            Object principal = authentication.getPrincipal();
            if (principal instanceof Long) {
                merchantId = (Long) principal;
            } else if (authentication instanceof ApiKeyAuthenticationToken) {
                merchantId = ((ApiKeyAuthenticationToken) authentication).getMerchantId();
            } else {
                try {
                    merchantId = Long.parseLong(authentication.getName());
                } catch (Exception ignored) {}
            }
        }
        if (merchantId == null) {
            merchantId = 999L;
        }
        DynamicQrPayment qrPayment = dynamicQrService.generateQrForIntent(intentId, merchantId);
        return ResponseEntity.ok(qrPayment);
    }

    /**
     * Mock endpoint simulating a customer scanning the QR code via their banking app.
     * In reality, this would be invoked by an intermediary switch (e.g. BancNet).
     */
    @PostMapping("/qr/{qrReference}/scan")
    public ResponseEntity<PaymentIntent> scanQr(@PathVariable String qrReference) {
        PaymentIntent intent = dynamicQrService.processQrScan(qrReference);
        return ResponseEntity.ok(intent);
    }
}
