package com.company.banking.payment;

import com.company.banking.common.exception.BusinessException;
import com.company.banking.common.exception.ErrorCode;
import com.company.banking.config.BaseIntegrationTest;
import com.company.banking.payment.application.DynamicQrService;
import com.company.banking.payment.domain.DynamicQrPayment;
import com.company.banking.payment.domain.PaymentIntent;
import com.company.banking.payment.domain.PaymentIntentStatus;
import com.company.banking.payment.infrastructure.DynamicQrPaymentJpaRepository;
import com.company.banking.payment.infrastructure.PaymentIntentJpaRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import org.springframework.transaction.annotation.Transactional;

@Transactional
public class DynamicQrPaymentPathIT extends BaseIntegrationTest {

    @Autowired
    private DynamicQrService dynamicQrService;

    @Autowired
    private PaymentIntentJpaRepository paymentIntentRepository;

    @Autowired
    private DynamicQrPaymentJpaRepository qrPaymentRepository;

    private PaymentIntent baseIntent;
    private final Long MERCHANT_ID = 1L;

    @BeforeEach
    void setUp() {
        baseIntent = paymentIntentRepository.save(PaymentIntent.builder()
                .intentId("INTENT-" + UUID.randomUUID().toString().substring(0, 8))
                .merchantId(MERCHANT_ID)
                .amount(new BigDecimal("100.00"))
                .currency("PHP")
                .feeAmount(BigDecimal.ZERO)
                .status(PaymentIntentStatus.PENDING)
                .idempotencyKey(UUID.randomUUID().toString())
                .build());
    }

    @Test
    @DisplayName("P01: QR Generation Golden Path")
    void testQrGenerationGoldenPath() {
        DynamicQrPayment qr = dynamicQrService.generateQrForIntent(baseIntent.getIntentId(), MERCHANT_ID);

        assertNotNull(qr);
        assertEquals("ACTIVE", qr.getStatus());
        assertTrue(qr.getExpiresAt().isAfter(LocalDateTime.now().plusMinutes(14)), "Expiry should be ~15 mins from now");

        PaymentIntent updatedIntent = paymentIntentRepository.findById(baseIntent.getId()).orElseThrow();
        assertEquals(PaymentIntentStatus.QR_GENERATED, updatedIntent.getStatus());
    }

    @Test
    @DisplayName("P02: Duplicate QR Generation Rejection (Idempotency)")
    void testDuplicateQrGenerationRejection() {
        dynamicQrService.generateQrForIntent(baseIntent.getIntentId(), MERCHANT_ID);

        BusinessException exception = assertThrows(BusinessException.class, () -> {
            dynamicQrService.generateQrForIntent(baseIntent.getIntentId(), MERCHANT_ID);
        });

        assertEquals(ErrorCode.INVALID_REQUEST, exception.getErrorCode());
        assertEquals(1, qrPaymentRepository.count(), "Only one QR record should exist per intent");
    }

    @Test
    @DisplayName("P03: IDOR Security Guard — Cross-Merchant QR Attempt")
    void testIdorSecurityGuard() {
        Long maliciousMerchantId = 2L;

        BusinessException exception = assertThrows(BusinessException.class, () -> {
            dynamicQrService.generateQrForIntent(baseIntent.getIntentId(), maliciousMerchantId);
        });

        assertEquals(ErrorCode.FORBIDDEN, exception.getErrorCode());
    }

    @Test
    @DisplayName("P04: QR Expiry Guard During Scan")
    void testQrExpiryGuardDuringScan() {
        DynamicQrPayment qr = dynamicQrService.generateQrForIntent(baseIntent.getIntentId(), MERCHANT_ID);
        qr.setExpiresAt(LocalDateTime.now().minusMinutes(1));
        qrPaymentRepository.save(qr);

        BusinessException exception = assertThrows(BusinessException.class, () -> {
            dynamicQrService.processQrScan(qr.getQrReference());
        });

        assertEquals(ErrorCode.INVALID_REQUEST, exception.getErrorCode());
        assertTrue(exception.getMessage().contains("expired"));

    }

    @Test
    @DisplayName("P05: Duplicate Scan Prevention")
    void testDuplicateScanPrevention() {
        DynamicQrPayment qr = dynamicQrService.generateQrForIntent(baseIntent.getIntentId(), MERCHANT_ID);
        qr.setStatus("SCANNED");
        qrPaymentRepository.save(qr);

        BusinessException exception = assertThrows(BusinessException.class, () -> {
            dynamicQrService.processQrScan(qr.getQrReference());
        });

        assertEquals(ErrorCode.INVALID_REQUEST, exception.getErrorCode());
    }
}
