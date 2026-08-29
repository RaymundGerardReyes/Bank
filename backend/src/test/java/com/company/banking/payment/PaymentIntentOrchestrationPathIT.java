package com.company.banking.payment;

import com.company.banking.account.application.port.out.AccountPersistencePort;
import com.company.banking.account.domain.Account;
import com.company.banking.common.enums.AccountStatus;
import com.company.banking.common.exception.BusinessException;
import com.company.banking.common.exception.ErrorCode;
import com.company.banking.config.BaseIntegrationTest;
import com.company.banking.payment.api.dto.CreatePaymentIntentRequest;
import com.company.banking.payment.api.dto.PaymentSessionResponse;
import com.company.banking.payment.application.PaymentIntentOrchestrationService;
import com.company.banking.payment.domain.PaymentChannel;
import com.company.banking.payment.domain.PaymentIntent;
import com.company.banking.payment.domain.PaymentIntentStatus;
import com.company.banking.payment.domain.PaymentProvider;
import com.company.banking.payment.gateway.ExternalPaymentGateway;
import com.company.banking.payment.gateway.dto.PaymentSession;
import com.company.banking.payment.infrastructure.PaymentIntentJpaRepository;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.bean.override.mockito.MockitoBean;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@SpringBootTest
@ActiveProfiles("test")
public class PaymentIntentOrchestrationPathIT extends BaseIntegrationTest {

    @Autowired
    private PaymentIntentOrchestrationService orchestrationService;

    @Autowired
    private PaymentIntentJpaRepository paymentIntentRepository;

    @Autowired
    private AccountPersistencePort accountPersistencePort;

    @MockitoBean
    private ExternalPaymentGateway externalPaymentGateway;

    private Account sourceAccount;
    private final String IDEMPOTENCY_KEY = UUID.randomUUID().toString();

    @BeforeEach
    public void setup() {
        paymentIntentRepository.deleteAll();

        sourceAccount = accountPersistencePort.save(Account.builder()
                .accountNumber("ACC-INTENT-" + UUID.randomUUID().toString().substring(0, 8))
                .customerId(909L)
                .balance(new BigDecimal("10000.00"))
                .currency("PHP")
                .status(AccountStatus.ACTIVE)
                .allowOutgoing(true)
                .allowIncoming(true)
                .build());
    }

    private CreatePaymentIntentRequest createRequest(BigDecimal amount, String key) {
        CreatePaymentIntentRequest request = new CreatePaymentIntentRequest();
        request.setSourceAccountId(sourceAccount.getAccountNumber());
        request.setAmount(amount);
        request.setDescription("Test Checkout Intent");
        request.setIdempotencyKey(key);
        request.setMerchantReference("ORD-999");
        return request;
    }

    @Test
    @DisplayName("P01: Valid Checkout creates hold and transitions to CHECKOUT_CREATED")
    public void p01_ValidCheckout_TransitionsToCreated() {
        PaymentSession mockSession = PaymentSession.builder()
                .providerReference("pay_ref_123")
                .provider(PaymentProvider.INTERNAL)
                .channel(PaymentChannel.HOSTED_CHECKOUT)
                .checkoutUrl("https://pay.developerph.dev/pay/test_session_123")
                .expiresAt(LocalDateTime.now().plusHours(1))
                .build();

        when(externalPaymentGateway.createCheckout(any())).thenReturn(mockSession);

        PaymentSessionResponse response = orchestrationService.createIntent(909L, sourceAccount.getAccountNumber(), createRequest(new BigDecimal("500.00"), IDEMPOTENCY_KEY));

        assertNotNull(response.getPaymentIntentId());
        assertEquals("INTERNAL", response.getProvider());
        assertEquals("https://pay.developerph.dev/pay/test_session_123", response.getCheckoutUrl());

        Account updatedSource = accountPersistencePort.findByAccountNumber(sourceAccount.getAccountNumber()).orElseThrow();
        assertEquals(0, new BigDecimal("9500.00").compareTo(updatedSource.getBalance()), "Customer balance MUST reflect the payment hold.");
    }

    @Test
    @DisplayName("P02: Concurrent requests with same Idempotency Key resolve safely")
    public void p02_IdempotentCollision_ReturnsExistingIntent() {
        PaymentSession mockSession = PaymentSession.builder()
                .providerReference("pay_ref_123")
                .provider(PaymentProvider.INTERNAL)
                .channel(PaymentChannel.HOSTED_CHECKOUT)
                .checkoutUrl("https://pay.developerph.dev/pay/test_session_123")
                .expiresAt(LocalDateTime.now().plusHours(1))
                .build();

        when(externalPaymentGateway.createCheckout(any())).thenReturn(mockSession);

        CreatePaymentIntentRequest req = createRequest(new BigDecimal("200.00"), IDEMPOTENCY_KEY);
        PaymentSessionResponse firstCall = orchestrationService.createIntent(909L, sourceAccount.getAccountNumber(), req);
        PaymentSessionResponse secondCall = orchestrationService.createIntent(909L, sourceAccount.getAccountNumber(), req);

        assertEquals(firstCall.getPaymentIntentId(), secondCall.getPaymentIntentId(), "Idempotent calls MUST return the same Payment Intent ID");
        assertEquals(1, paymentIntentRepository.count(), "Only one intent must exist in the database");
    }

    @Test
    @DisplayName("P03: Security Rejection triggers if Gateway returns malicious URL")
    public void p03_SecurityRejection_OnMaliciousUrl() {
        PaymentSession mockSession = PaymentSession.builder()
                .providerReference("pay_ref_123")
                .provider(PaymentProvider.INTERNAL)
                .channel(PaymentChannel.HOSTED_CHECKOUT)
                .checkoutUrl("http://evil-phishing-domain.com/pay")
                .expiresAt(LocalDateTime.now().plusHours(1))
                .build();

        when(externalPaymentGateway.createCheckout(any())).thenReturn(mockSession);

        BusinessException exception = assertThrows(BusinessException.class, () -> {
            orchestrationService.createIntent(909L, sourceAccount.getAccountNumber(), createRequest(new BigDecimal("100.00"), IDEMPOTENCY_KEY));
        });

        assertEquals(ErrorCode.INTERNAL_SERVER_ERROR, exception.getErrorCode());
        assertTrue(exception.getMessage().contains("payment gateway checkout URL") || exception.getMessage().contains("security allowlist"));
    }

    @Test
    @DisplayName("P04: Cancellation rolls back held funds and marks as CANCELLED")
    public void p04_Cancellation_RestoresFundsAndTransitionsStatus() {
        PaymentIntent intent = paymentIntentRepository.save(PaymentIntent.builder()
                .intentId("PI-CANCEL-" + UUID.randomUUID().toString().substring(0, 8))
                .merchantId(1L)
                .customerAccountNumber(sourceAccount.getAccountNumber())
                .amount(new BigDecimal("300.00"))
                .currency("PHP")
                .status(PaymentIntentStatus.CHECKOUT_CREATED)
                .build());

        orchestrationService.cancelIntent(intent.getIntentId());

        PaymentIntent cancelledIntent = paymentIntentRepository.findByIntentId(intent.getIntentId()).orElseThrow();
        assertEquals(PaymentIntentStatus.CANCELLED, cancelledIntent.getStatus());

        Account restoredSource = accountPersistencePort.findByAccountNumber(sourceAccount.getAccountNumber()).orElseThrow();
        assertEquals(0, new BigDecimal("10300.00").compareTo(restoredSource.getBalance()), "Balance must be credited back upon cancellation.");
    }
}
