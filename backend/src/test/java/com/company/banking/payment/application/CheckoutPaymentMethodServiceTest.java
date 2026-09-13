package com.company.banking.payment.application;

import com.company.banking.common.exception.BusinessException;
import com.company.banking.common.exception.ErrorCode;
import com.company.banking.payment.api.dto.CheckoutSessionResponse;
import com.company.banking.payment.api.dto.SelectPaymentMethodRequest;
import com.company.banking.payment.domain.CheckoutPaymentMethod;
import com.company.banking.payment.domain.CheckoutSession;
import com.company.banking.payment.domain.CheckoutSessionStateTransitionPolicy;
import com.company.banking.payment.domain.CheckoutSessionStatus;
import com.company.banking.payment.domain.PaymentIntent;
import com.company.banking.payment.domain.PaymentIntentStatus;
import com.company.banking.payment.infrastructure.CheckoutSessionJpaRepository;
import com.company.banking.payment.infrastructure.DynamicQrPaymentJpaRepository;
import com.company.banking.payment.infrastructure.PaymentIntentJpaRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class CheckoutPaymentMethodServiceTest {

    @Mock
    private CheckoutSessionJpaRepository sessionRepository;

    @Mock
    private CheckoutSessionStateTransitionPolicy transitionPolicy;

    @Mock
    private PaymentIntentJpaRepository intentRepository;

    @Mock
    private DynamicQrService dynamicQrService;

    @Mock
    private DynamicQrPaymentJpaRepository dynamicQrPaymentJpaRepository;

    @InjectMocks
    private CheckoutPaymentMethodService paymentMethodService;

    private CheckoutSession mockSession;
    private PaymentIntent mockIntent;
    private final String PUBLIC_TOKEN = "cs_test_session_123";
    private final String INTENT_ID = "pi_test_intent_123";
    private final Long MERCHANT_ID = 1001L;

    @BeforeEach
    void setUp() {
        mockSession = CheckoutSession.builder()
                .sessionId(PUBLIC_TOKEN)
                .merchantId(MERCHANT_ID)
                .paymentIntentId(INTENT_ID)
                .amount(new BigDecimal("1500.00"))
                .currency("PHP")
                .status(CheckoutSessionStatus.ACTIVE)
                .expiresAt(LocalDateTime.now().plusHours(1))
                .build();

        mockIntent = PaymentIntent.builder()
                .id(99L)
                .intentId(INTENT_ID)
                .merchantId(MERCHANT_ID)
                .amount(new BigDecimal("1500.00"))
                .currency("PHP")
                .status(PaymentIntentStatus.CREATED)
                .build();
    }

    @Test
    @DisplayName("Unit 1: Select QR_PH payment method transitions state and generates dynamic QR")
    void testSelectQrPhGeneratesQrAndTransitionsToPaymentPending() {
        SelectPaymentMethodRequest request = new SelectPaymentMethodRequest();
        request.setPaymentMethod(CheckoutPaymentMethod.QR_PH);

        when(sessionRepository.findBySessionIdForUpdate(PUBLIC_TOKEN)).thenReturn(Optional.of(mockSession));
        when(intentRepository.findByIntentId(INTENT_ID)).thenReturn(Optional.of(mockIntent));
        when(dynamicQrPaymentJpaRepository.findByPaymentIntentId(99L)).thenReturn(Optional.empty());
        when(sessionRepository.save(any(CheckoutSession.class))).thenAnswer(i -> i.getArgument(0));

        CheckoutSessionResponse response = paymentMethodService.selectPaymentMethod(PUBLIC_TOKEN, request);

        assertNotNull(response);
        assertEquals(PUBLIC_TOKEN, response.getId());
        assertEquals("PAYMENT_PENDING", response.getStatus());
        assertEquals("QR_PH", mockSession.getSelectedPaymentMethod());
        assertEquals(CheckoutSessionStatus.PAYMENT_PENDING, mockSession.getStatus());

        verify(transitionPolicy).validateTransition(CheckoutSessionStatus.ACTIVE, CheckoutSessionStatus.PAYMENT_PENDING);
        verify(dynamicQrService).generateQrForIntent(INTENT_ID, MERCHANT_ID);
        verify(sessionRepository).save(mockSession);
    }

    @Test
    @DisplayName("Unit 2: Select INTERNAL_ACCOUNT transitions to PAYMENT_PENDING without generating QR")
    void testSelectInternalAccountTransitionsWithoutGeneratingQr() {
        SelectPaymentMethodRequest request = new SelectPaymentMethodRequest();
        request.setPaymentMethod(CheckoutPaymentMethod.INTERNAL_ACCOUNT);

        when(sessionRepository.findBySessionIdForUpdate(PUBLIC_TOKEN)).thenReturn(Optional.of(mockSession));
        when(sessionRepository.save(any(CheckoutSession.class))).thenAnswer(i -> i.getArgument(0));

        CheckoutSessionResponse response = paymentMethodService.selectPaymentMethod(PUBLIC_TOKEN, request);

        assertNotNull(response);
        assertEquals("PAYMENT_PENDING", response.getStatus());
        assertEquals("INTERNAL_ACCOUNT", mockSession.getSelectedPaymentMethod());

        verify(transitionPolicy).validateTransition(CheckoutSessionStatus.ACTIVE, CheckoutSessionStatus.PAYMENT_PENDING);
        verifyNoInteractions(dynamicQrService);
    }

    @Test
    @DisplayName("Unit 3: Expired session throws BusinessException when selecting payment method")
    void testExpiredSessionRejectsSelection() {
        mockSession.setExpiresAt(LocalDateTime.now().minusMinutes(5));
        SelectPaymentMethodRequest request = new SelectPaymentMethodRequest();
        request.setPaymentMethod(CheckoutPaymentMethod.QR_PH);

        when(sessionRepository.findBySessionIdForUpdate(PUBLIC_TOKEN)).thenReturn(Optional.of(mockSession));

        BusinessException ex = assertThrows(BusinessException.class, () ->
                paymentMethodService.selectPaymentMethod(PUBLIC_TOKEN, request));

        assertEquals(ErrorCode.INVALID_REQUEST, ex.getErrorCode());
        assertTrue(ex.getMessage().contains("expired"));
        assertEquals(CheckoutSessionStatus.EXPIRED, mockSession.getStatus());
    }
}

