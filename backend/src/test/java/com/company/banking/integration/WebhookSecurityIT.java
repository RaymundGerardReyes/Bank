package com.company.banking.integration;

import com.company.banking.payment.application.PaymentStateMachineService;
import com.company.banking.payment.infrastructure.InboundWebhookEventJpaRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import javax.sql.DataSource;
import java.nio.charset.StandardCharsets;
import java.sql.Connection;
import java.sql.ResultSet;
import java.util.HexFormat;
import java.util.UUID;
import java.util.concurrent.CountDownLatch;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.atomic.AtomicInteger;

import static org.junit.jupiter.api.Assertions.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
public class WebhookSecurityIT {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private DataSource dataSource;

    @Autowired
    private InboundWebhookEventJpaRepository webhookEventRepository;

    @Autowired
    private com.company.banking.payment.application.PaymentWebhookService paymentWebhookService;

    // CRITICAL FIX: Isolate the test to Webhook Concurrency ONLY.
    // Mocking the state machine prevents "Payment Intent Not Found" errors 
    // when the winning thread attempts to process the mock event.
    @MockitoBean
    private PaymentStateMachineService stateMachineService;

    @BeforeEach
    void setUp() {
        webhookEventRepository.deleteAll();
    }

    @Test
    @DisplayName("Security Gate: Webhook Concurrency & Replay Protection")
    public void testConcurrentWebhookDeliveries() throws Exception {
        String eventId = "evt_" + UUID.randomUUID().toString();

        String payload = """
            {
                "id": "%s",
                "type": "payment.paid",
                "data": {
                    "attributes": {
                        "amount": 10000,
                        "currency": "PHP",
                        "status": "paid"
                    }
                }
            }
            """.formatted(eventId);

        // Compute valid PayMongo HMAC-SHA256 signature
        String webhookSecret = "whsec_test_secret_123456789";
        String timestamp = "1700000000";
        String signedPayload = timestamp + "." + payload;
        Mac mac = Mac.getInstance("HmacSHA256");
        SecretKeySpec keySpec = new SecretKeySpec(webhookSecret.getBytes(StandardCharsets.UTF_8), "HmacSHA256");
        mac.init(keySpec);
        String hmacHex = HexFormat.of().formatHex(mac.doFinal(signedPayload.getBytes(StandardCharsets.UTF_8)));

        String validSignatureHeader = "t=" + timestamp + ",te=" + hmacHex;

        int concurrentRequests = 3;
        ExecutorService executor = Executors.newFixedThreadPool(concurrentRequests);
        CountDownLatch startPistol = new CountDownLatch(1);
        CountDownLatch finishLine = new CountDownLatch(concurrentRequests);
        
        AtomicInteger successfulResponses = new AtomicInteger(0);

        for (int i = 0; i < concurrentRequests; i++) {
            executor.submit(() -> {
                try {
                    startPistol.await();
                    
                    mockMvc.perform(post("/api/v1/webhooks/payment/paymongo")
                            .with(csrf()) // Bypass CSRF protection for this test request
                            .header("Paymongo-Signature", validSignatureHeader)
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(payload))
                            .andDo(result -> {
                                int status = result.getResponse().getStatus();
                                if (status == 200) {
                                    successfulResponses.incrementAndGet();
                                } else {
                                    System.err.println("WEBHOOK FAILED WITH STATUS: " + status);
                                    try {
                                        System.err.println("ERROR BODY: " + result.getResponse().getContentAsString());
                                    } catch (Exception ignored) {}
                                }
                            });
                } catch (Exception e) {
                    e.printStackTrace();
                } finally {
                    finishLine.countDown();
                }
            });
        }

        startPistol.countDown();
        finishLine.await();
        executor.shutdown();

        int savedRecords = 0;
        try (Connection conn = dataSource.getConnection();
             var stmt = conn.prepareStatement("SELECT COUNT(*) FROM inbound_webhook_events WHERE external_event_id = ?")) {
            stmt.setString(1, eventId);
            ResultSet rs = stmt.executeQuery();
            if (rs.next()) {
                savedRecords = rs.getInt(1);
            }
        }

        assertEquals(1, savedRecords, "Exactly 1 webhook record should be saved");
        assertEquals(concurrentRequests, successfulResponses.get(), "All requests should return 200 OK");
    }

    @Test
    public void concurrentWebhookDelivery_ShouldProcessExactlyOnceAndReturnGracefully() throws InterruptedException {
        int threads = 10;
        ExecutorService executor = Executors.newFixedThreadPool(threads);
        CountDownLatch startPistol = new CountDownLatch(1);
        CountDownLatch finishLine = new CountDownLatch(threads);
        
        AtomicInteger successfulExecutions = new AtomicInteger(0);
        String sharedEventId = "evt_" + UUID.randomUUID().toString();

        for (int i = 0; i < threads; i++) {
            executor.submit(() -> {
                try {
                    startPistol.await(); // Hold threads until all are ready
                    
                    // All threads hit the service at the exact same time
                    paymentWebhookService.processWebhook(sharedEventId, "PAYMONGO", "{\"status\":\"paid\"}");
                    
                    // If no exception bubbled up (i.e., gracefully caught), count as success
                    successfulExecutions.incrementAndGet();
                } catch (Exception e) {
                    // Print any unexpected exceptions for debugging
                    e.printStackTrace();
                } finally {
                    finishLine.countDown();
                }
            });
        }

        startPistol.countDown(); // Fire!
        finishLine.await(5, TimeUnit.SECONDS);
        executor.shutdown();

        // 1. Verify exactly one record was saved to the database
        assertEquals(1, webhookEventRepository.count(),
             "Database constraint must guarantee exactly 1 canonical webhook record exists.");

        // 2. Verify all threads returned smoothly without throwing 500 errors
        assertEquals(10, successfulExecutions.get(),
             "All concurrent requests must return gracefully (200 OK) to prevent provider retries.");
    }
}
