package com.company.banking.payment;

import com.company.banking.apigateway.domain.WebhookEndpoint;
import com.company.banking.apigateway.infrastructure.WebhookEndpointJpaRepository;
import com.company.banking.payment.application.MerchantWebhookDeliveryService;
import com.company.banking.payment.application.PaymentEventOutboxRelay;
import com.company.banking.payment.domain.PaymentEventOutbox;
import com.company.banking.payment.domain.PaymentEventOutboxStatus;
import com.company.banking.payment.domain.PaymentEventType;
import com.company.banking.payment.infrastructure.PaymentEventOutboxJpaRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.server.LocalServerPort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.web.bind.annotation.*;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.time.LocalDateTime;
import java.util.HexFormat;
import java.util.List;
import java.util.UUID;
import java.util.concurrent.CountDownLatch;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.atomic.AtomicInteger;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@ActiveProfiles("test")
public class MerchantWebhookDeliveryIntegrityIT {
    @Autowired private com.company.banking.apigateway.infrastructure.WebhookDeliveryJpaRepository deliveryRepository;

    @LocalServerPort
    private int port;

    @Autowired
    private PaymentEventOutboxJpaRepository outboxRepository;

    @Autowired
    private WebhookEndpointJpaRepository endpointRepository;

    @Autowired
    private MerchantWebhookDeliveryService deliveryService;

    @Autowired
    private PaymentEventOutboxRelay outboxRelay;

    private static final String SECRET = "whsec_super_secret_for_tests";
    private static AtomicInteger simulatedMerchantResponseCode = new AtomicInteger(200);

    // Simulated Merchant Server embedded in the test
    @RestController
    @RequestMapping("/test-merchant-webhook")
    static class DummyMerchantController {
        @PostMapping
        public ResponseEntity<String> receiveWebhook(
                @RequestHeader("X-Bank-Timestamp") String timestamp,
                @RequestHeader("X-Bank-Signature") String signature,
                @RequestBody String payload) throws Exception {

            // Test 5 - HMAC Signature correctness verification on the merchant side
            String signedContent = timestamp + "." + payload;
            Mac mac = Mac.getInstance("HmacSHA256");
            mac.init(new SecretKeySpec(SECRET.getBytes(StandardCharsets.UTF_8), "HmacSHA256"));
            String expectedSignature = "v1=" + HexFormat.of().formatHex(mac.doFinal(signedContent.getBytes(StandardCharsets.UTF_8)));

            if (!expectedSignature.equals(signature)) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid Signature");
            }
            return ResponseEntity.status(simulatedMerchantResponseCode.get()).body("Processed");
        }
    }

    private PaymentEventOutbox seedEvent;

    @BeforeEach
    public void setup() {
        outboxRepository.deleteAll();
        endpointRepository.deleteAll();
        deliveryRepository.deleteAll();
        simulatedMerchantResponseCode.set(200);

        // Seed Webhook Endpoint
        WebhookEndpoint endpoint = new WebhookEndpoint();
        endpoint.setMerchantId(99L);
        endpoint.setUrl("http://localhost:" + port + "/test-merchant-webhook");
        endpoint.setSecretHash(SECRET);
        endpoint.setEnvironment("LIVE");
        endpoint.setStatus("ACTIVE");
        endpoint.setEvents("*");
        endpointRepository.save(endpoint);

        // Seed Outbox Event
        seedEvent = outboxRepository.save(PaymentEventOutbox.builder()
                .eventId("evt_" + UUID.randomUUID())
                .merchantId(99L)
                .aggregateType("PAYMENT_INTENT")
                .aggregateId("pi_123")
                .idempotencyKey("idem_" + UUID.randomUUID())
                .eventType(PaymentEventType.CHECKOUT_PAYMENT_SUCCEEDED)
                .payload("{\"status\":\"PAID\", \"amount\": 500}")
                .status(PaymentEventOutboxStatus.PENDING)
                .attemptCount(0)
                .createdAt(LocalDateTime.now())
                .build());
    }

    @Test
    public void test1_successfulDelivery_ShouldMarkAsDelivered() {
        deliveryService.deliverEvent(seedEvent);

        PaymentEventOutbox result = outboxRepository.findById(seedEvent.getId()).get();
        assertEquals(PaymentEventOutboxStatus.DELIVERED, result.getStatus());
        assertEquals(200, result.getLastHttpStatus());
        assertNull(result.getLockedAt(), "Locks must be cleared after execution");
    }

    @Test
    public void test2_failedDelivery_ShouldExponentialBackoffAndRetry() {
        simulatedMerchantResponseCode.set(500); // Simulate Merchant Outage

        deliveryService.deliverEvent(seedEvent);

        PaymentEventOutbox result = outboxRepository.findById(seedEvent.getId()).get();
        assertEquals(PaymentEventOutboxStatus.RETRY, result.getStatus());
        assertEquals(500, result.getLastHttpStatus());
        assertEquals(1, result.getAttemptCount());
        assertNotNull(result.getNextAttemptAt(), "Next attempt must be scheduled");
        assertTrue(result.getNextAttemptAt().isAfter(LocalDateTime.now()), "Backoff must be in the future");
    }

    @Test
    public void test3_deadLetter_ShouldExhaustRetriesSafely() {
        simulatedMerchantResponseCode.set(503); 
        seedEvent.setAttemptCount(5); // Simulate event that has already failed 5 times
        outboxRepository.save(seedEvent);

        deliveryService.deliverEvent(seedEvent);

        PaymentEventOutbox result = outboxRepository.findById(seedEvent.getId()).get();
        assertEquals(PaymentEventOutboxStatus.DEAD_LETTER, result.getStatus(), "After 6 attempts, must dead-letter");
        assertEquals(6, result.getAttemptCount());
    }

    @Test
    public void test7_concurrentWorkers_ShouldOnlyClaimEventOnce() throws InterruptedException {
        int threads = 10;
        ExecutorService executor = Executors.newFixedThreadPool(threads);
        CountDownLatch startLatch = new CountDownLatch(1);
        CountDownLatch doneLatch = new CountDownLatch(threads);

        AtomicInteger claimSuccess = new AtomicInteger(0);

        for (int i = 0; i < threads; i++) {
            executor.submit(() -> {
                try {
                    startLatch.await();
                    List<PaymentEventOutbox> claimed = outboxRelay.claimEvents(5);
                    claimSuccess.addAndGet(claimed.size());
                } catch (Exception ignored) {
                } finally {
                    doneLatch.countDown();
                }
            });
        }

        startLatch.countDown();
        doneLatch.await(5, TimeUnit.SECONDS);

        // Prove SKIP LOCKED prevents double processing
        assertEquals(1, claimSuccess.get(), "Only ONE worker thread should have successfully claimed the single PENDING event");
    }

    @Test
    public void test8_workerCrashRecovery_ShouldReclaimStuckLeases() {
        // Simulate an event that was locked 10 minutes ago but the worker crashed
        seedEvent.setStatus(PaymentEventOutboxStatus.DELIVERING);
        seedEvent.setLockedAt(LocalDateTime.now().minusMinutes(10));
        seedEvent.setLockedBy("crashed-worker-node-1");
        outboxRepository.save(seedEvent);

        outboxRelay.recoverStuckLeases();

        PaymentEventOutbox recovered = outboxRepository.findById(seedEvent.getId()).get();
        assertEquals(PaymentEventOutboxStatus.RETRY, recovered.getStatus(), "Stuck lease must be reclaimed to RETRY");
        assertNull(recovered.getLockedAt());
        assertNull(recovered.getLockedBy());
    }

    @Test
    public void test8_merchantIsolation_MustNotReceiveOtherMerchantEvents() {
        // Change event to belong to Merchant 100, but only Merchant 99 is configured
        seedEvent.setMerchantId(100L);
        outboxRepository.save(seedEvent);

        deliveryService.deliverEvent(seedEvent);

        PaymentEventOutbox result = outboxRepository.findById(seedEvent.getId()).get();
        assertEquals("No active webhook endpoint found", result.getLastError());
        assertEquals(PaymentEventOutboxStatus.RETRY, result.getStatus(), "Must not deliver to Merchant 99's endpoint");
    }
}
