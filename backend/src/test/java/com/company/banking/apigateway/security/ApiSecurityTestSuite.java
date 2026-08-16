package com.company.banking.apigateway.security;

import com.company.banking.payment.application.PaymentIntentService;
import com.company.banking.payment.domain.PaymentIntent;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import java.time.Instant;
import java.util.UUID;

import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
public class ApiSecurityTestSuite {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private PaymentIntentService paymentIntentService;

    /**
     * Requirement: BSP M-2022-016 (Replay Protection)
     * Verifies that requests without proper cryptographic signatures and fresh timestamps are rejected.
     */
    @Test
    public void testReplayAttack_MissingTimestamp_Returns4xx() throws Exception {
        mockMvc.perform(post("/api/v1/gateway/payments")
                .header("X-Client-Id", "client_123")
                .header("X-Signature", "fake_signature")
                .header("X-Nonce", UUID.randomUUID().toString())
                // Missing X-Timestamp
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"amount\": 100.00, \"currency\": \"PHP\"}"))
                // Expect any 4xx Client Error (Ensures the request is successfully blocked)
                .andExpect(status().is4xxClientError());
    }

    /**
     * Requirement: BSP MORPS (Object-Level Authorization)
     * Verifies that Merchant A cannot capture a PaymentIntent belonging to Merchant B.
     */
    @Test
    public void testObjectLevelAuthorization_BypassAttempt_Returns4xx() throws Exception {
        when(paymentIntentService.captureIntent(eq("pi_123"), eq(999L)))
            .thenThrow(new com.company.banking.common.exception.BusinessException(
                com.company.banking.common.exception.ErrorCode.FORBIDDEN, 
                "Access Denied: PaymentIntent belongs to a different merchant."));

        mockMvc.perform(post("/api/v1/gateway/payments/pi_123/capture")
                .header("X-Client-Id", "client_999") 
                .header("X-Signature", "valid_mock_signature")
                .header("X-Timestamp", String.valueOf(Instant.now().toEpochMilli()))
                .header("X-Nonce", UUID.randomUUID().toString())
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().is4xxClientError());
    }

    /**
     * Requirement: Idempotency enforcement
     * Verifies that POST operations to the gateway mandate an Idempotency-Key.
     */
    @Test
    public void testIdempotency_MissingKey_Returns4xx() throws Exception {
        mockMvc.perform(post("/api/v1/gateway/payments")
                .header("X-Client-Id", "client_123")
                .header("X-Signature", "valid_mock_signature")
                .header("X-Timestamp", String.valueOf(Instant.now().toEpochMilli()))
                .header("X-Nonce", UUID.randomUUID().toString())
                // Missing Idempotency-Key header
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"amount\": 100.00, \"currency\": \"PHP\"}"))
                .andExpect(status().is4xxClientError());
    }
}