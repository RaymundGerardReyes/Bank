package com.company.banking.payment;

import com.company.banking.account.application.port.out.AccountPersistencePort;
import com.company.banking.account.domain.Account;
import com.company.banking.apigateway.infrastructure.ApiKeyJpaEntity;
import com.company.banking.apigateway.infrastructure.ApiKeyJpaRepository;
import com.company.banking.common.enums.AccountStatus;
import com.company.banking.payment.api.dto.merchant.MerchantCheckoutRequest;
import com.company.banking.payment.api.dto.merchant.MerchantRefundRequest;
import com.company.banking.payment.domain.PaymentIntent;
import com.company.banking.payment.domain.PaymentIntentStatus;
import com.company.banking.payment.infrastructure.CheckoutSessionJpaRepository;
import com.company.banking.payment.infrastructure.PaymentIntentJpaRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;


import org.springframework.test.web.servlet.MockMvc;

import java.math.BigDecimal;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.time.LocalDateTime;
import java.util.HexFormat;
import java.util.List;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")

public class MerchantGatewayAPIIntegrityIT {
    @Autowired private com.company.banking.account.infrastructure.AccountJpaRepository accountJpaRepository;

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private ApiKeyJpaRepository apiKeyRepository;

    @Autowired
    private PaymentIntentJpaRepository intentRepository;

    @Autowired
    private CheckoutSessionJpaRepository sessionRepository;

    @Autowired
    private AccountPersistencePort accountPersistencePort;

    private static final String MERCHANT_A_KEY = "sk_live_merchant_A_123";
    private static final String MERCHANT_B_KEY = "sk_live_merchant_B_999";
    
    private Long merchantAId = 100L;
    private Long merchantBId = 200L;
    private PaymentIntent intentMerchantA;

    @BeforeEach
    public void setup() throws Exception {
        apiKeyRepository.deleteAll();
        sessionRepository.deleteAll();
        intentRepository.deleteAll();
        accountJpaRepository.deleteAll();

        // 1. Seed API Keys
        seedApiKey(MERCHANT_A_KEY, merchantAId, "LIVE");
        seedApiKey(MERCHANT_B_KEY, merchantBId, "LIVE");

        // 2. Seed Customer Account (to prevent Insufficient Funds during refund tests)
        Account customerAccount = accountPersistencePort.save(Account.builder()
                .accountNumber("CUST-API-101")
                .customerId(10L)
                .balance(new BigDecimal("10000.00"))
                .currency("PHP")
                .status(AccountStatus.ACTIVE)
                .build());

        // 3. Seed an existing CAPTURED PaymentIntent belonging ONLY to Merchant A
        intentMerchantA = intentRepository.save(PaymentIntent.builder()
                .intentId("pi_" + UUID.randomUUID())
                .merchantId(merchantAId)
                .customerAccountNumber(customerAccount.getAccountNumber())
                .amount(new BigDecimal("1000.00"))
                .currency("PHP")
                .status(PaymentIntentStatus.CAPTURED)
                .build());
    }

    private void seedApiKey(String rawKey, Long merchantId, String env) throws Exception {
        MessageDigest digest = MessageDigest.getInstance("SHA-256");
        byte[] hash = digest.digest(rawKey.getBytes(StandardCharsets.UTF_8));
        String hashedKey = HexFormat.of().formatHex(hash);

        ApiKeyJpaEntity keyEntity = new ApiKeyJpaEntity();
        keyEntity.setKeyHash(hashedKey);
        keyEntity.setKeyPrefix(rawKey.substring(0, 8));
        keyEntity.setName("Test API Key");
        keyEntity.setMerchantId(merchantId);
        keyEntity.setEnvironment(env);
        keyEntity.setScopes("payments:write,payments:read");
        keyEntity.setExpiresAt(LocalDateTime.now().plusDays(30)); // Indicates the key is active
        keyEntity.setCreatedAt(LocalDateTime.now());
        apiKeyRepository.save(keyEntity);
    }

    // -------------------------------------------------------------------------
    // AUTHENTICATION & VALIDATION TESTS
    // -------------------------------------------------------------------------

    @Test
    public void createSession_WithoutApiKey_ShouldReturnForbidden() throws Exception {
        MerchantCheckoutRequest req = new MerchantCheckoutRequest();
        
        mockMvc.perform(post("/api/v1/gateway/checkout/sessions")
                .header("Idempotency-Key", "idem_123")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isUnauthorized());
    }

    @Test
    public void createSession_WithInvalidApiKey_ShouldReturnForbidden() throws Exception {
        MerchantCheckoutRequest req = new MerchantCheckoutRequest();

        mockMvc.perform(post("/api/v1/gateway/checkout/sessions")
                .header("Authorization", "Bearer sk_live_fake_key")
                .header("Idempotency-Key", "idem_123")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isUnauthorized());
    }

    @Test
    public void createSession_WithMissingFields_ShouldReturnBadRequest() throws Exception {
        // Missing required fields like currency, reference, and lineItems
        MerchantCheckoutRequest req = new MerchantCheckoutRequest();
        
        mockMvc.perform(post("/api/v1/gateway/checkout/sessions")
                .header("Authorization", "Bearer " + MERCHANT_A_KEY)
                .header("Idempotency-Key", "idem_123")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isBadRequest()); // Proves DTO validation works
    }

    // -------------------------------------------------------------------------
    // DATA ISOLATION (BOLA) TESTS
    // -------------------------------------------------------------------------

    @Test
    public void getPaymentIntent_WithCorrectMerchant_ShouldReturn200() throws Exception {
        mockMvc.perform(get("/api/v1/gateway/payments/" + intentMerchantA.getIntentId())
                .header("Authorization", "Bearer " + MERCHANT_A_KEY)
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.id").value(intentMerchantA.getIntentId()))
                .andExpect(jsonPath("$.data.amount").value(1000.00));
    }

    @Test
    public void getPaymentIntent_WithWrongMerchant_ShouldReturnForbidden() throws Exception {
        // Merchant B tries to fetch Merchant A's payment intent
        mockMvc.perform(get("/api/v1/gateway/payments/" + intentMerchantA.getIntentId())
                .header("Authorization", "Bearer " + MERCHANT_B_KEY)
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isForbidden());
    }

    @Test
    public void refundPayment_WithWrongMerchant_ShouldReturnForbidden() throws Exception {
        MerchantRefundRequest refundReq = new MerchantRefundRequest();
        refundReq.setAmount(new BigDecimal("500.00"));
        refundReq.setReason("Customer requested");

        // Merchant B tries to refund Merchant A's payment intent
        mockMvc.perform(post("/api/v1/gateway/payments/" + intentMerchantA.getIntentId() + "/refund")
                .header("Authorization", "Bearer " + MERCHANT_B_KEY)
                .header("Idempotency-Key", "idem_refund_999")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(refundReq)))
                .andExpect(status().isForbidden());
    }

    // -------------------------------------------------------------------------
    // IDEMPOTENCY TESTS
    // -------------------------------------------------------------------------

    @Test
    public void refundPayment_WithSameIdempotencyKey_ShouldReturnSameResultWithoutDoubleProcessing() throws Exception {
        MerchantRefundRequest refundReq = new MerchantRefundRequest();
        refundReq.setAmount(new BigDecimal("500.00"));
        refundReq.setReason("Customer requested");

        String idempotencyKey = "idem_refund_123";

        // 1. First Request - Should Succeed
        String response1 = mockMvc.perform(post("/api/v1/gateway/payments/" + intentMerchantA.getIntentId() + "/refund")
                .header("Authorization", "Bearer " + MERCHANT_A_KEY)
                .header("Idempotency-Key", idempotencyKey)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(refundReq)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.status").value("PARTIALLY_REFUNDED"))
                .andReturn().getResponse().getContentAsString();

        // 2. Second Request (Duplicate) - Should Return Same Result
        String response2 = mockMvc.perform(post("/api/v1/gateway/payments/" + intentMerchantA.getIntentId() + "/refund")
                .header("Authorization", "Bearer " + MERCHANT_A_KEY)
                .header("Idempotency-Key", idempotencyKey)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(refundReq)))
                .andExpect(status().isOk())
                .andReturn().getResponse().getContentAsString();

        // 3. Verify exactly matched responses by ignoring dynamic timestamps
        var data1 = objectMapper.readTree(response1).get("data");
        var data2 = objectMapper.readTree(response2).get("data");

        assertEquals(data1.get("status").asText(), data2.get("status").asText(), "Idempotent requests must return the same status");
        assertEquals(data1.get("amount").asDouble(), data2.get("amount").asDouble(), "Idempotent requests must return the same amount");

        // 4. Verify no double refunds hit the database (Intent amount remains partially refunded correctly)
        PaymentIntent updatedIntent = intentRepository.findByIntentId(intentMerchantA.getIntentId()).get();
        assertEquals(PaymentIntentStatus.PARTIALLY_REFUNDED, updatedIntent.getStatus());
    }
}
