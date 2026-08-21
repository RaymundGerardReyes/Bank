package com.company.banking.integration;

import com.company.banking.payment.domain.PaymentAttempt;
import com.company.banking.payment.infrastructure.PaymentAttemptJpaRepository;
import com.company.banking.payment.infrastructure.InboundWebhookEventJpaRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
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
import java.util.concurrent.atomic.AtomicInteger;

import static org.junit.jupiter.api.Assertions.assertEquals;
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
    private PaymentAttemptJpaRepository attemptRepository;

    @Autowired
    private InboundWebhookEventJpaRepository webhookEventRepository;

    @BeforeEach
    void setUp() {
        webhookEventRepository.deleteAll();
        attemptRepository.deleteAll();
    }

    @Test
    @DisplayName("Security Gate: Webhook Concurrency & Replay Protection")
    public void testConcurrentWebhookDeliveries() throws Exception {
        String eventId = "evt_" + UUID.randomUUID().toString();
        
        // Seed matching PaymentAttempt so stateMachineService.processAttemptOutcome succeeds
        attemptRepository.save(PaymentAttempt.builder()
                .attemptId("att_" + UUID.randomUUID().toString())
                .paymentIntentId(1L)
                .provider("PAYMONGO")
                .providerReference(eventId)
                .status("PROCESSING")
                .build());

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

        System.out.println("==================================================");
        System.out.println("SUCCESSFUL RESPONSES: " + successfulResponses.get());
        System.out.println("SAVED RECORDS IN DB: " + savedRecords);
        System.out.println("==================================================");

        assertEquals(concurrentRequests, successfulResponses.get(), "All webhooks should return 200 OK to prevent provider retries.");
        assertEquals(1, savedRecords, "Idempotency failed: Duplicate webhook events were saved to the database.");
    }
}
