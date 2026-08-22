package com.company.banking.payment;

import com.company.banking.payment.domain.CheckoutSession;
import com.company.banking.payment.domain.CheckoutSessionStatus;
import com.company.banking.payment.infrastructure.CheckoutSessionJpaRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
public class PublicCheckoutSessionSecurityIT {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private CheckoutSessionJpaRepository sessionRepository;

    private CheckoutSession safeSession;

    @BeforeEach
    public void setup() {
        sessionRepository.deleteAll();

        safeSession = sessionRepository.save(CheckoutSession.builder()
                .sessionId("cs_" + UUID.randomUUID().toString().replace("-", "").substring(0, 24))
                .merchantId(99L)
                .paymentIntentId("pi_secret_123")
                .idempotencyKey("idem_123")
                .amount(new BigDecimal("1500.00"))
                .currency("PHP")
                .description("Premium Coffee")
                .status(CheckoutSessionStatus.ACTIVE)
                .successUrl("https://example.com")
                .createdAt(LocalDateTime.now())
                .expiresAt(LocalDateTime.now().plusHours(1))
                .build());
    }

    @Test
    public void publicSessionRead_ShouldExposeOnlySafeFields() throws Exception {
        mockMvc.perform(get("/api/v1/checkout/sessions/" + safeSession.getSessionId())
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.id").value(safeSession.getSessionId()))
                .andExpect(jsonPath("$.data.status").value("ACTIVE"))
                .andExpect(jsonPath("$.data.amount").value(1500.00))
                .andExpect(jsonPath("$.data.currency").value("PHP"))
                // SECURITY ASSERTIONS: Ensure internal IDs are completely stripped
                .andExpect(jsonPath("$.data.merchantId").doesNotExist())
                .andExpect(jsonPath("$.data.paymentIntentId").doesNotExist())
                .andExpect(jsonPath("$.data.idempotencyKey").doesNotExist());
    }

    @Test
    public void randomToken_ShouldReturn404NotFound() throws Exception {
        mockMvc.perform(get("/api/v1/checkout/sessions/cs_invalid_token_999")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isNotFound());
    }

    @Test
    public void expiredSession_ShouldReturnSafePublicState() throws Exception {
        safeSession.setStatus(CheckoutSessionStatus.EXPIRED);
        sessionRepository.save(safeSession);

        mockMvc.perform(get("/api/v1/checkout/sessions/" + safeSession.getSessionId())
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.status").value("EXPIRED"));
    }
}
