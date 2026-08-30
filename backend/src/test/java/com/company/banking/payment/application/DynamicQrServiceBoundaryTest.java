package com.company.banking.payment.application;

import com.company.banking.common.audit.AuditEventPublisher;
import com.company.banking.common.exception.BusinessException;
import com.company.banking.common.exception.ErrorCode;
import com.company.banking.payment.domain.DynamicQrPayment;
import com.company.banking.payment.domain.PaymentIntent;
import com.company.banking.payment.domain.PaymentIntentStatus;
import com.company.banking.payment.infrastructure.DynamicQrPaymentJpaRepository;
import com.company.banking.payment.infrastructure.PaymentIntentJpaRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InOrder;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class DynamicQrServiceBoundaryTest {

    @Mock private PaymentIntentJpaRepository intentRepository;
    @Mock private DynamicQrPaymentJpaRepository qrRepository;
    @Mock private AuditEventPublisher auditEventPublisher;

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
    void b02_and_Ordering_UnauthorizedGeneration_SkipsPersistence() {
        when(intentRepository.findByIntentId(INTENT_ID)).thenReturn(Optional.of(mockIntent));

        BusinessException ex = assertThrows(BusinessException.class, 
                () -> dynamicQrService.generateQrForIntent(INTENT_ID, 999L));
        
        assertEquals(ErrorCode.FORBIDDEN, ex.getErrorCode());

        InOrder inOrder = inOrder(intentRepository, auditEventPublisher, qrRepository);
        inOrder.verify(intentRepository).findByIntentId(INTENT_ID);
        inOrder.verify(auditEventPublisher).publishEvent(eq("OBJECT_LEVEL_AUTH_FAILED"), any(), any(), any());
        inOrder.verify(qrRepository, never()).findByPaymentIntentId(any());
        inOrder.verify(qrRepository, never()).save(any());
    }

    @Test
    void b04_b06_ExpirationBoundary_FailsExactlyAtOrAfterExpiration() {
        DynamicQrPayment exactBoundaryQr = DynamicQrPayment.builder()
                .qrReference("qr_bound")
                .paymentIntentId(INTENT_DB_ID)
                .status("ACTIVE")
                .expiresAt(LocalDateTime.now().minusSeconds(1)) // Just before now
                .build();
                
        mockIntent.setStatus(PaymentIntentStatus.QR_GENERATED);

        when(qrRepository.findByQrReference("qr_bound")).thenReturn(Optional.of(exactBoundaryQr));
        when(intentRepository.findById(INTENT_DB_ID)).thenReturn(Optional.of(mockIntent));

        BusinessException ex = assertThrows(BusinessException.class, 
                () -> dynamicQrService.processQrScan("qr_bound"));

        assertEquals(ErrorCode.INVALID_REQUEST, ex.getErrorCode()); // Service throws INVALID_REQUEST for expired
        
        // B-13: Expiration path persists both terminal states
        assertEquals("EXPIRED", exactBoundaryQr.getStatus());
        assertEquals(PaymentIntentStatus.FAILED, mockIntent.getStatus());
        verify(qrRepository).save(exactBoundaryQr);
        verify(intentRepository).save(mockIntent);
    }

    @Test
    void b08_b09_AlreadyTerminalQr_RejectsSecondScan() {
        DynamicQrPayment scannedQr = DynamicQrPayment.builder()
                .qrReference("qr_done")
                .status("SCANNED") // Already SCANNED
                .expiresAt(LocalDateTime.now().plusMinutes(5)) // Not expired
                .build();

        when(qrRepository.findByQrReference("qr_done")).thenReturn(Optional.of(scannedQr));

        BusinessException ex = assertThrows(BusinessException.class, 
                () -> dynamicQrService.processQrScan("qr_done"));
                
        assertEquals(ErrorCode.INVALID_REQUEST, ex.getErrorCode());
        assertTrue(ex.getMessage().contains("This QR code cannot be scanned"));
        
        verify(intentRepository, never()).findById(any());
        verify(qrRepository, never()).save(any());
    }

    @Test
    void ordering_ValidGeneration_FollowsStrictChronology() {
        when(intentRepository.findByIntentId(INTENT_ID)).thenReturn(Optional.of(mockIntent));
        when(qrRepository.findByPaymentIntentId(INTENT_DB_ID)).thenReturn(Optional.empty());

        dynamicQrService.generateQrForIntent(INTENT_ID, MERCHANT_ID);

        InOrder inOrder = inOrder(intentRepository, qrRepository);
        inOrder.verify(intentRepository).findByIntentId(INTENT_ID);             // 1. Authorization/Lookup
        inOrder.verify(qrRepository).findByPaymentIntentId(INTENT_DB_ID);          // 2. Duplicate Check
        inOrder.verify(qrRepository).save(any(DynamicQrPayment.class));         // 3. Persist QR
        inOrder.verify(intentRepository).save(mockIntent);                      // 4. Update Intent
    }
}
