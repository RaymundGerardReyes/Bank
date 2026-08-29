package com.company.banking.apigateway.security;

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

    @Test
    public void testLegacyCreate_IsDisabled_Returns405() throws Exception {
        mockMvc.perform(post("/api/v1/gateway/payments")
                .header("X-API-Key", "sk_test_mock_12345")
                .header("X-Client-Id", "client_123")
                .header("X-Signature", "valid_mock_signature")
                .header("X-Timestamp", String.valueOf(Instant.now().toEpochMilli()))
                .header("X-Nonce", UUID.randomUUID().toString())
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"amount\": 100.00, \"currency\": \"PHP\"}"))
                .andExpect(status().isMethodNotAllowed());
    }

    @Test
    public void testLegacyCapture_IsDisabled_Returns405() throws Exception {
        mockMvc.perform(post("/api/v1/gateway/payments/pi_123/capture")
                .header("X-API-Key", "sk_test_mock_12345")
                .header("X-Client-Id", "client_999") 
                .header("X-Signature", "valid_mock_signature")
                .header("X-Timestamp", String.valueOf(Instant.now().toEpochMilli()))
                .header("X-Nonce", UUID.randomUUID().toString())
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isMethodNotAllowed());
    }
}