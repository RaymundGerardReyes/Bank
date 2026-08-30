package com.company.banking.payment.application;

import com.company.banking.common.audit.AuditEventPublisher;
import com.company.banking.common.exception.BusinessException;
import com.company.banking.common.exception.ErrorCode;
import com.company.banking.common.exception.ForbiddenException;
import com.company.banking.payment.domain.DynamicQrPayment;
import com.company.banking.payment.domain.PaymentIntent;
import com.company.banking.payment.domain.PaymentIntentStatus;
import com.company.banking.payment.infrastructure.DynamicQrPaymentJpaRepository;
import com.company.banking.payment.infrastructure.PaymentIntentJpaRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class DynamicQrServiceTest {

    @Mock
    private PaymentIntentJpaRepository intentRepository;

    @Mock
    private DynamicQrPaymentJpaRepository qrRepository;

    @Mock
    private AuditEventPublisher auditEventPublisher;

    @InjectMocks
    private DynamicQrService dynamicQrService;

    private PaymentIntent mockIntent;
    private final String INTENT_ID = "intent_123";
    private final Long INTENT_DB_ID = 100L;
    private final Long MERCHANT_ID = 101L;

    @BeforeEach
    void setUp() {
        mockIntent = PaymentIntent.builder()
                .id(INTENT_DB_ID)
                .intentId(INTENT_ID)
                .merchantId(MERCHANT_ID)
                .status(PaymentIntentStatus.PENDING)
                .build();
    }

    @Test
    void qrUnit01_and_07_GeneratesActiveQrAndUpdatesIntent() {
        when(intentRepository.findByIntentId(INTENT_ID)).thenReturn(Optional.of(mockIntent));
        when(qrRepository.findByPaymentIntentId(INTENT_DB_ID)).thenReturn(Optional.empty());

        dynamicQrService.generateQrForIntent(INTENT_ID, MERCHANT_ID);

        ArgumentCaptor<DynamicQrPayment> qrCaptor = ArgumentCaptor.forClass(DynamicQrPayment.class);
        verify(qrRepository).save(qrCaptor.capture());
        
        DynamicQrPayment savedQr = qrCaptor.getValue();
        assertEquals("ACTIVE", savedQr.getStatus());
        assertEquals(PaymentIntentStatus.QR_GENERATED, mockIntent.getStatus());
    }

    @Test
    void qrUnit02_CrossMerchantAuthorizationFailure() {
        when(intentRepository.findByIntentId(INTENT_ID)).thenReturn(Optional.of(mockIntent));

        BusinessException ex = assertThrows(BusinessException.class, 
                () -> dynamicQrService.generateQrForIntent(INTENT_ID, 999L));

        assertEquals(ErrorCode.FORBIDDEN, ex.getErrorCode());
        verify(auditEventPublisher).publishEvent(eq("OBJECT_LEVEL_AUTH_FAILED"), anyString(), anyString(), anyString());
        verify(qrRepository, never()).save(any());
    }

    @Test
    void qrUnit04_DuplicateGenerationIsRejected() {
        when(intentRepository.findByIntentId(INTENT_ID)).thenReturn(Optional.of(mockIntent));
        when(qrRepository.findByPaymentIntentId(INTENT_DB_ID)).thenReturn(Optional.of(new DynamicQrPayment()));

        BusinessException ex = assertThrows(BusinessException.class, 
                () -> dynamicQrService.generateQrForIntent(INTENT_ID, MERCHANT_ID));

        assertEquals(ErrorCode.INVALID_REQUEST, ex.getErrorCode());
        verify(qrRepository, never()).save(any());
    }

    @Test
    void qrUnit06_ExpirationSetTo15Minutes() {
        when(intentRepository.findByIntentId(INTENT_ID)).thenReturn(Optional.of(mockIntent));
        when(qrRepository.findByPaymentIntentId(INTENT_DB_ID)).thenReturn(Optional.empty());

        dynamicQrService.generateQrForIntent(INTENT_ID, MERCHANT_ID);

        ArgumentCaptor<DynamicQrPayment> qrCaptor = ArgumentCaptor.forClass(DynamicQrPayment.class);
        verify(qrRepository).save(qrCaptor.capture());
        
        assertNotNull(qrCaptor.getValue().getExpiresAt());
    }

    @Test
    void qrUnit10_ValidScanTransitionsToScannedAndPending() {
        DynamicQrPayment activeQr = DynamicQrPayment.builder()
                .qrReference("qr_ref_001")
                .paymentIntentId(INTENT_DB_ID)
                .status("ACTIVE")
                .expiresAt(LocalDateTime.now().plusMinutes(5))
                .build();

        mockIntent.setStatus(PaymentIntentStatus.QR_GENERATED);

        when(qrRepository.findByQrReference("qr_ref_001")).thenReturn(Optional.of(activeQr));
        when(intentRepository.findById(INTENT_DB_ID)).thenReturn(Optional.of(mockIntent));

        dynamicQrService.processQrScan("qr_ref_001");

        assertEquals("SCANNED", activeQr.getStatus());
        assertEquals(PaymentIntentStatus.PENDING, mockIntent.getStatus());
    }

    @Test
    void qrPath09_ExpiredQrTransitionsToFailed() {
        DynamicQrPayment expiredQr = DynamicQrPayment.builder()
                .qrReference("qr_ref_expired")
                .paymentIntentId(INTENT_DB_ID)
                .status("ACTIVE")
                .expiresAt(LocalDateTime.now().minusMinutes(1))
                .build();

        mockIntent.setStatus(PaymentIntentStatus.QR_GENERATED);

        when(qrRepository.findByQrReference("qr_ref_expired")).thenReturn(Optional.of(expiredQr));
        when(intentRepository.findById(INTENT_DB_ID)).thenReturn(Optional.of(mockIntent));

        BusinessException ex = assertThrows(BusinessException.class, 
                () -> dynamicQrService.processQrScan("qr_ref_expired"));

        assertEquals(ErrorCode.INVALID_REQUEST, ex.getErrorCode());
        assertEquals("EXPIRED", expiredQr.getStatus());
        assertEquals(PaymentIntentStatus.FAILED, mockIntent.getStatus());
    }

    @Test
    void qrPath12_DuplicateScanRejected() {
        DynamicQrPayment scannedQr = DynamicQrPayment.builder()
                .qrReference("qr_ref_used")
                .status("SCANNED")
                .expiresAt(LocalDateTime.now().plusMinutes(5))
                .build();

        when(qrRepository.findByQrReference("qr_ref_used")).thenReturn(Optional.of(scannedQr));

        BusinessException ex = assertThrows(BusinessException.class, 
                () -> dynamicQrService.processQrScan("qr_ref_used"));

        assertEquals(ErrorCode.INVALID_REQUEST, ex.getErrorCode());
    }

    @Test
    void qrPath14_FullGenerateAndScanLifecycle() {
        // Step 1: Generate
        when(intentRepository.findByIntentId(INTENT_ID)).thenReturn(Optional.of(mockIntent));
        when(qrRepository.findByPaymentIntentId(INTENT_DB_ID)).thenReturn(Optional.empty());
        dynamicQrService.generateQrForIntent(INTENT_ID, MERCHANT_ID);
        assertEquals(PaymentIntentStatus.QR_GENERATED, mockIntent.getStatus());

        // Step 2: Scan
        DynamicQrPayment activeQr = DynamicQrPayment.builder()
                .qrReference("qr_ref_life")
                .paymentIntentId(INTENT_DB_ID)
                .status("ACTIVE")
                .expiresAt(LocalDateTime.now().plusMinutes(10))
                .build();
        when(qrRepository.findByQrReference("qr_ref_life")).thenReturn(Optional.of(activeQr));
        when(intentRepository.findById(INTENT_DB_ID)).thenReturn(Optional.of(mockIntent));
        
        dynamicQrService.processQrScan("qr_ref_life");
        assertEquals("SCANNED", activeQr.getStatus());
        assertEquals(PaymentIntentStatus.PENDING, mockIntent.getStatus());
    }
}
