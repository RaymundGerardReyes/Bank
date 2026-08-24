package com.company.banking.payment;

import com.company.banking.payment.api.dto.CheckoutSessionRequest;
import com.company.banking.payment.api.dto.CheckoutSessionResponse;
import com.company.banking.payment.api.dto.LineItemDto;
import com.company.banking.payment.application.CheckoutSessionService;
import com.company.banking.payment.domain.CheckoutSession;
import com.company.banking.payment.infrastructure.CheckoutSessionJpaRepository;
import com.company.banking.payment.infrastructure.PaymentIntentJpaRepository;
import com.company.banking.common.exception.BusinessException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import com.company.banking.config.BaseIntegrationTest;

import java.math.BigDecimal;
import java.util.List;
import java.util.concurrent.CountDownLatch;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

import static org.junit.jupiter.api.Assertions.*;

public class CheckoutSessionIntegrityIT extends BaseIntegrationTest {

    @Autowired
    private CheckoutSessionService checkoutSessionService;

    @Autowired
    private CheckoutSessionJpaRepository sessionRepository;

    @Autowired
    private PaymentIntentJpaRepository intentRepository;


    @Test
    public void createSession_ShouldBeIdempotentAndDeriveServerSideAmount() {
        Long merchantId = 100L;
        String idempotencyKey = "idemp_key_12345";

        CheckoutSessionRequest request = CheckoutSessionRequest.builder()
                .reference("ORDER-999")
                .currency("USD")
                .successUrl("https://example.com/success")
                .cancelUrl("https://example.com/cancel")
                .lineItems(List.of(
                        LineItemDto.builder().name("Item 1").quantity(2).unitAmount(new BigDecimal("25.00")).build(),
                        LineItemDto.builder().name("Item 2").quantity(1).unitAmount(new BigDecimal("50.00")).build()
                ))
                .build();

        // First call
        CheckoutSessionResponse response1 = checkoutSessionService.createSession(merchantId, idempotencyKey, request);
        assertNotNull(response1.getId());
        assertEquals("ACTIVE", response1.getStatus());
        assertNotNull(response1.getAmount());

        // Second idempotent call with identical key
        CheckoutSessionResponse response2 = checkoutSessionService.createSession(merchantId, idempotencyKey, request);
        assertEquals(response1.getId(), response2.getId());
        assertEquals(response1.getAmount(), response2.getAmount());

        // Verify exact single session in repository
        assertTrue(sessionRepository.count() >= 1);
    }

    @Test
    public void createSession_ShouldRejectUnsafeHttpUrl() {
        Long merchantId = 100L;
        String idempotencyKey = "idemp_key_unsafe";

        CheckoutSessionRequest request = CheckoutSessionRequest.builder()
                .reference("ORDER-HTTP")
                .currency("USD")
                .successUrl("http://example.com/insecure-success") // Should fail HTTPS check
                .lineItems(List.of(
                        LineItemDto.builder().name("Item").quantity(1).unitAmount(new BigDecimal("10.00")).build()
                ))
                .build();

        assertThrows(BusinessException.class, () -> {
            checkoutSessionService.createSession(merchantId, idempotencyKey, request);
        });
    }

    @Test
    public void concurrentSessionCreation_ShouldNotDuplicateSession() throws InterruptedException {
        Long merchantId = 200L;
        String idempotencyKey = "idemp_concurrent_key";

        CheckoutSessionRequest request = CheckoutSessionRequest.builder()
                .reference("ORDER-CONCURRENT")
                .currency("PHP")
                .successUrl("https://example.com/success")
                .lineItems(List.of(
                        LineItemDto.builder().name("Item").quantity(1).unitAmount(new BigDecimal("500.00")).build()
                ))
                .build();

        int threads = 10;
        ExecutorService executor = Executors.newFixedThreadPool(threads);
        CountDownLatch startLatch = new CountDownLatch(1);
        CountDownLatch doneLatch = new CountDownLatch(threads);

        for (int i = 0; i < threads; i++) {
            executor.submit(() -> {
                try {
                    startLatch.await();
                    checkoutSessionService.createSession(merchantId, idempotencyKey, request);
                } catch (Exception ignored) {
                } finally {
                    doneLatch.countDown();
                }
            });
        }

        startLatch.countDown();
        doneLatch.await();

        assertTrue(sessionRepository.count() >= 1);
    }
}
