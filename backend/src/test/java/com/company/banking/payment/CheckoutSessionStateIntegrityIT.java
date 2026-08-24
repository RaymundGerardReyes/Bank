package com.company.banking.payment;

import com.company.banking.common.exception.BusinessException;
import com.company.banking.payment.api.dto.SelectPaymentMethodRequest;
import com.company.banking.payment.application.CheckoutPaymentMethodService;
import com.company.banking.payment.domain.CheckoutPaymentMethod;
import com.company.banking.payment.domain.CheckoutSession;
import com.company.banking.payment.domain.CheckoutSessionStatus;
import com.company.banking.payment.infrastructure.CheckoutSessionJpaRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;



import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;
import java.util.concurrent.CountDownLatch;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.atomic.AtomicInteger;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@ActiveProfiles("test")

public class CheckoutSessionStateIntegrityIT {

    @Autowired
    private CheckoutPaymentMethodService paymentMethodService;

    @Autowired
    private CheckoutSessionJpaRepository sessionRepository;

    private CheckoutSession activeSession;

    @BeforeEach
    public void setup() {
        sessionRepository.deleteAll();

        activeSession = sessionRepository.save(CheckoutSession.builder()
                .sessionId("cs_" + UUID.randomUUID())
                .merchantId(99L)
                .idempotencyKey("test-key")
                .paymentIntentId("pi_" + UUID.randomUUID())
                .amount(new BigDecimal("500.00"))
                .currency("PHP")
                .status(CheckoutSessionStatus.ACTIVE)
                .successUrl("https://example.com")
                .createdAt(LocalDateTime.now())
                .expiresAt(LocalDateTime.now().plusHours(1))
                .build());
    }

    @Test
    public void paymentMethodSelection_ShouldTransitionToPaymentPending() {
        SelectPaymentMethodRequest req = new SelectPaymentMethodRequest();
        req.setPaymentMethod(CheckoutPaymentMethod.INTERNAL_ACCOUNT);

        paymentMethodService.selectPaymentMethod(activeSession.getSessionId(), req);

        CheckoutSession updated = sessionRepository.findBySessionId(activeSession.getSessionId()).orElseThrow();
        assertEquals(CheckoutSessionStatus.PAYMENT_PENDING, updated.getStatus());
        assertEquals("INTERNAL_ACCOUNT", updated.getSelectedPaymentMethod());
    }

    @Test
    public void expiredSession_ShouldRejectPaymentMethodSelection() {
        // Artificially expire the session
        activeSession.setExpiresAt(LocalDateTime.now().minusMinutes(5));
        sessionRepository.save(activeSession);

        SelectPaymentMethodRequest req = new SelectPaymentMethodRequest();
        req.setPaymentMethod(CheckoutPaymentMethod.INTERNAL_ACCOUNT);

        BusinessException ex = assertThrows(BusinessException.class, () -> {
            paymentMethodService.selectPaymentMethod(activeSession.getSessionId(), req);
        });

        assertTrue(ex.getMessage().contains("expired"));
        assertNotNull(sessionRepository.findById(activeSession.getId()).get().getStatus());
    }

    @Test
    public void paidSession_ShouldRejectPaymentMethodSelection() {
        activeSession.setStatus(CheckoutSessionStatus.PAID);
        sessionRepository.save(activeSession);

        SelectPaymentMethodRequest req = new SelectPaymentMethodRequest();
        req.setPaymentMethod(CheckoutPaymentMethod.INTERNAL_ACCOUNT);

        BusinessException ex = assertThrows(BusinessException.class, () -> {
            paymentMethodService.selectPaymentMethod(activeSession.getSessionId(), req);
        });

        assertTrue(ex.getMessage().contains("Illegal checkout session state transition"));
    }

    @Test
    public void concurrentPaymentMethodSelection_ShouldProduceOneValidOutcome() throws InterruptedException {
        int threads = 5;
        ExecutorService executor = Executors.newFixedThreadPool(threads);
        CountDownLatch latch = new CountDownLatch(1);
        CountDownLatch done = new CountDownLatch(threads);
        AtomicInteger successCount = new AtomicInteger(0);

        SelectPaymentMethodRequest req = new SelectPaymentMethodRequest();
        req.setPaymentMethod(CheckoutPaymentMethod.INTERNAL_ACCOUNT);

        for (int i = 0; i < threads; i++) {
            executor.submit(() -> {
                try {
                    latch.await();
                    paymentMethodService.selectPaymentMethod(activeSession.getSessionId(), req);
                    successCount.incrementAndGet();
                } catch (Exception ignored) {
                } finally {
                    done.countDown();
                }
            });
        }

        latch.countDown();
        done.await();

        // 1. Only ONE thread should succeed in advancing ACTIVE -> PAYMENT_PENDING
        assertEquals(1, successCount.get(), "Concurrency guard failed: multiple threads mutated the session");
        
        // 2. Final state must be PAYMENT_PENDING
        CheckoutSession finalSession = sessionRepository.findBySessionId(activeSession.getSessionId()).orElseThrow();
        assertEquals(CheckoutSessionStatus.PAYMENT_PENDING, finalSession.getStatus());
    }
}
