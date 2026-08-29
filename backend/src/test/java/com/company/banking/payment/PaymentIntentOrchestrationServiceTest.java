package com.company.banking.payment;

import com.company.banking.common.exception.BusinessException;
import com.company.banking.payment.application.PaymentIntentOrchestrationService;
import com.company.banking.payment.domain.PaymentIntent;
import com.company.banking.payment.infrastructure.PaymentIntentJpaRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class PaymentIntentOrchestrationServiceTest {

    @Mock
    private PaymentIntentJpaRepository paymentIntentRepository;

    @InjectMocks
    private PaymentIntentOrchestrationService service;

    @BeforeEach
    void setUp() {
        org.springframework.test.util.ReflectionTestUtils.setField(service, "allowedDomains", java.util.List.of("developerph.dev", "paymongo.com", "localhost"));
    }

    @Test
    void getPaymentIntent_SuccessWhenMerchantIdMatches() {
        PaymentIntent intent = PaymentIntent.builder()
                .intentId("PI-123")
                .merchantId(1L)
                .build();
        
        when(paymentIntentRepository.findByIntentId("PI-123")).thenReturn(Optional.of(intent));

        PaymentIntent result = service.getPaymentIntent("PI-123", 1L);
        assertNotNull(result);
        assertEquals("PI-123", result.getIntentId());
    }

    @Test
    void getPaymentIntent_ThrowsForbiddenWhenMerchantIdMismatches() {
        PaymentIntent intent = PaymentIntent.builder()
                .intentId("PI-123")
                .merchantId(2L) // Different merchant
                .build();
        
        when(paymentIntentRepository.findByIntentId("PI-123")).thenReturn(Optional.of(intent));

        BusinessException exception = assertThrows(BusinessException.class, () -> {
            service.getPaymentIntent("PI-123", 1L);
        });
        
        assertTrue(exception.getMessage().contains("Not authorized"));
    }

}
