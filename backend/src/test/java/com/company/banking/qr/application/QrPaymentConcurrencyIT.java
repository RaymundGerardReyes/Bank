package com.company.banking.qr.application;

import com.company.banking.common.exception.ConflictException;
import com.company.banking.config.BaseIntegrationTest;
import com.company.banking.customer.application.port.out.CustomerPersistencePort;
import com.company.banking.customer.domain.Customer;
import com.company.banking.merchant.domain.Merchant;
import com.company.banking.merchant.domain.MerchantPaymentProfile;
import com.company.banking.merchant.infrastructure.MerchantJpaRepository;
import com.company.banking.merchant.infrastructure.MerchantPaymentProfileJpaRepository;
import com.company.banking.payment.domain.PaymentIntent;
import com.company.banking.payment.domain.PaymentIntentStatus;
import com.company.banking.payment.infrastructure.PaymentIntentJpaRepository;
import com.company.banking.payment.infrastructure.PaymentQrCodeJpaRepository;
import com.company.banking.qr.domain.QrPaymentRequest;
import com.company.banking.qr.domain.QrPaymentResult;
import com.company.banking.qr.domain.QrType;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.bean.override.mockito.MockitoBean;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.concurrent.CountDownLatch;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.atomic.AtomicInteger;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@SpringBootTest
@ActiveProfiles("test")
public class QrPaymentConcurrencyIT extends BaseIntegrationTest {

    @Autowired private QrPaymentOrchestrator orchestrator;
    @Autowired private PaymentIntentJpaRepository intentRepository;
    @Autowired private MerchantJpaRepository merchantRepository;
    @Autowired private MerchantPaymentProfileJpaRepository profileRepository;
    @Autowired private PaymentQrCodeJpaRepository qrRepository;
    @Autowired private CustomerPersistencePort customerPort;

    @MockitoBean private QrPaymentProvider qrPaymentProvider;

    private PaymentIntent baseIntent;
    private Customer testCustomer;

    @BeforeEach
    void setup() {
        qrRepository.deleteAll();
        intentRepository.deleteAll();
        profileRepository.deleteAll();
        merchantRepository.deleteAll();

        testCustomer = customerPort.save(Customer.builder()
                .email("owner-" + UUID.randomUUID() + "@test.com")
                .firstName("Test").lastName("Owner")
                .password("encoded").role(com.company.banking.common.enums.RoleType.MERCHANT)
                .build());

        Merchant merchant = merchantRepository.save(Merchant.builder()
                .ownerId(testCustomer.getId())
                .legalName("Concurrency Merchant")
                .merchantCode("M-CONC-" + UUID.randomUUID().toString().substring(0, 4))
                .businessRegistrationNumber("BRN-" + UUID.randomUUID())
                .status("ACTIVE")
                .build());

        profileRepository.save(MerchantPaymentProfile.builder()
                .merchantId(merchant.getId())
                .provider("SANDBOX_PSP")
                .externalMerchantId("EXT-123")
                .status("ACTIVE")
                .isPreferred(true)
                .build());

        baseIntent = intentRepository.save(PaymentIntent.builder()
                .intentId("INTENT-" + UUID.randomUUID())
                .merchantId(merchant.getId())
                .amount(new BigDecimal("500.00"))
                .currency("PHP")
                .feeAmount(BigDecimal.ZERO)
                .status(PaymentIntentStatus.PENDING)
                .build());
    }

    @Test
    @DisplayName("Genuinely Concurrent Requests: Latch holds Thread A in PSP network call so Thread B prepare fails")
    void testRealSimultaneousRequests() throws InterruptedException {
        CountDownLatch inPspCallLatch = new CountDownLatch(1);
        CountDownLatch releasePspCallLatch = new CountDownLatch(1);

        when(qrPaymentProvider.createDynamicQr(any(QrPaymentRequest.class))).thenAnswer(invocation -> {
            inPspCallLatch.countDown(); // Signal that Thread A is inside the PSP network call (holding QR_GENERATING state)
            assertTrue(releasePspCallLatch.await(5, TimeUnit.SECONDS), "Thread A released from PSP call");
            return QrPaymentResult.builder()
                    .provider("SANDBOX_PSP")
                    .providerQrReference("EXT-REF-CONC")
                    .qrType(QrType.DYNAMIC)
                    .payload("PAYLOAD")
                    .build();
        });

        int threads = 2;
        ExecutorService executor = Executors.newFixedThreadPool(threads);
        CountDownLatch doneLatch = new CountDownLatch(threads);
        
        AtomicInteger successCount = new AtomicInteger(0);
        AtomicInteger conflictCount = new AtomicInteger(0);

        // Submit Thread A
        executor.submit(() -> {
            try {
                orchestrator.generateDynamicQrForIntent(testCustomer.getId(), baseIntent.getIntentId());
                successCount.incrementAndGet();
            } catch (Exception e) {
                e.printStackTrace();
            } finally {
                doneLatch.countDown();
            }
        });

        // Wait until Thread A has committed prepareQrGeneration (state = QR_GENERATING) and entered PSP call
        assertTrue(inPspCallLatch.await(5, TimeUnit.SECONDS), "Thread A reached PSP network call");

        // Submit Thread B while Thread A is STILL inside the PSP call
        executor.submit(() -> {
            try {
                orchestrator.generateDynamicQrForIntent(testCustomer.getId(), baseIntent.getIntentId());
                successCount.incrementAndGet();
            } catch (ConflictException e) {
                conflictCount.incrementAndGet();
            } catch (Exception e) {
                e.printStackTrace();
            } finally {
                doneLatch.countDown();
            }
        });

        // Small delay to allow Thread B to execute prepareQrGeneration and hit ConflictException
        Thread.sleep(200);

        // Release Thread A to finish finalization
        releasePspCallLatch.countDown();

        assertTrue(doneLatch.await(10, TimeUnit.SECONDS));
        executor.shutdown();

        // Assertions: Thread A succeeded, Thread B was blocked by row-state lock
        assertEquals(1, successCount.get());
        assertEquals(1, conflictCount.get());

        // Prove provider was called exactly ONCE
        verify(qrPaymentProvider, times(1)).createDynamicQr(any());
        assertEquals(1, qrRepository.count());
    }

    @Test
    @DisplayName("Provider Success + DB Finalization Failure -> Stale Recovery verifies Idempotency Key matching")
    void testProviderSuccessAndDatabaseFailureRecovery() {
        String expectedProviderRef = "EXT-REF-" + UUID.randomUUID();
        String expectedIdempotencyKey = "QR-GEN-" + baseIntent.getIntentId();

        when(qrPaymentProvider.createDynamicQr(any(QrPaymentRequest.class)))
            .thenReturn(QrPaymentResult.builder()
                    .provider("SANDBOX_PSP")
                    .qrType(QrType.DYNAMIC)
                    .providerQrReference(expectedProviderRef)
                    .payload("PAYLOAD")
                    .build());

        // 1. Simulate Attempt 1: Preparation succeeded, state transitioned to QR_GENERATING, 
        // provider succeeded externally, but local DB finalization failed (leaving state as QR_GENERATING with old timestamp)
        baseIntent.transitionTo(PaymentIntentStatus.QR_GENERATING);
        baseIntent.setQrGenerationStartedAt(LocalDateTime.now().minusMinutes(5)); // Aged past recovery threshold
        intentRepository.save(baseIntent);

        assertEquals(0, qrRepository.count(), "Local DB finalization failure left 0 QRs locally");

        // 2. Attempt 2: Stale Recovery attempt
        QrPaymentResult result = orchestrator.generateDynamicQrForIntent(testCustomer.getId(), baseIntent.getIntentId());

        assertNotNull(result);
        assertEquals(expectedProviderRef, result.getProviderQrReference());

        // 3. Verify Idempotency Key match across calls
        ArgumentCaptor<QrPaymentRequest> requestCaptor = ArgumentCaptor.forClass(QrPaymentRequest.class);
        verify(qrPaymentProvider).createDynamicQr(requestCaptor.capture());
        
        QrPaymentRequest capturedRequest = requestCaptor.getValue();
        assertEquals(expectedIdempotencyKey, capturedRequest.getIdempotencyKey(), "Idempotency Key strictly preserved during recovery");

        // 4. Verify Final State
        PaymentIntent recoveredIntent = intentRepository.findById(baseIntent.getId()).orElseThrow();
        assertEquals(PaymentIntentStatus.AWAITING_PAYMENT, recoveredIntent.getStatus(), "Recovered successfully to AWAITING_PAYMENT");
        assertEquals(1, qrRepository.count(), "Exactly one QR persisted after recovery");
    }
}
