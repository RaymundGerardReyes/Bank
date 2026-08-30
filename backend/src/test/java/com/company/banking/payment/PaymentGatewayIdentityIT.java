package com.company.banking.payment;

import com.company.banking.apigateway.infrastructure.ApiKeyJpaEntity;
import com.company.banking.apigateway.infrastructure.ApiKeyJpaRepository;
import com.company.banking.payment.domain.PaymentIntent;
import com.company.banking.payment.infrastructure.PaymentIntentJpaRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDateTime;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@AutoConfigureMockMvc
@ActiveProfiles("test")
public class PaymentGatewayIdentityIT {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ApiKeyJpaRepository apiKeyRepository;

    @Autowired
    private PaymentIntentJpaRepository paymentIntentRepository;

    @Autowired
    private com.company.banking.account.infrastructure.AccountJpaRepository accountRepository;

    @org.springframework.test.context.bean.override.mockito.MockitoBean
    private com.company.banking.payment.gateway.ExternalPaymentGateway externalPaymentGateway;

    private String validApiKeyRaw = "test_merchant_key_" + UUID.randomUUID().toString();
    private ApiKeyJpaEntity validApiKey;
    private Long correctMerchantId = 555L;

    @BeforeEach
    public void setup() {
        paymentIntentRepository.deleteAll();
        apiKeyRepository.deleteAll();
        accountRepository.deleteAll();

        // Create the Account so AccountPersistencePort finds it
        com.company.banking.account.domain.Account merchantAccount = com.company.banking.account.domain.Account.builder()
                .accountNumber("MERCHANT-SETTLEMENT-555")
                .customerId(999L)
                .status(com.company.banking.common.enums.AccountStatus.ACTIVE)
                .balance(new java.math.BigDecimal("10000.00"))
                .currency("PHP")
                .accountType("MAIN")
                .allowIncoming(true)
                .allowOutgoing(true)
                .build();
        accountRepository.save(merchantAccount);

        // Mock ExternalPaymentGateway to not throw 500 when orchestrating intent
        org.mockito.Mockito.when(externalPaymentGateway.createCheckout(org.mockito.ArgumentMatchers.any()))
                .thenReturn(com.company.banking.payment.gateway.dto.PaymentSession.builder()
                        .providerReference("mock_ref")
                        .provider(com.company.banking.payment.domain.PaymentProvider.INTERNAL)
                        .channel(com.company.banking.payment.domain.PaymentChannel.HOSTED_CHECKOUT)
                        .checkoutUrl("https://pay.developerph.dev/mock")
                        .expiresAt(LocalDateTime.now().plusHours(1))
                        .build());
        apiKeyRepository.deleteAll();

        String keyHash = com.company.banking.apigateway.application.CreateApiKeyService.hashKey(validApiKeyRaw);

        validApiKey = ApiKeyJpaEntity.builder()
                .keyPrefix(validApiKeyRaw.substring(0, 4))
                .keyHash(keyHash)
                .merchantId(correctMerchantId)
                .name("Test Identity Key")
                .environment("TEST")
                .cidrWhitelist("0.0.0.0/0")
                .scopes("payments:write")
                .linkedAccountId("MERCHANT-SETTLEMENT-555")
                .expiresAt(LocalDateTime.now().plusDays(30))
                .build();

        validApiKey = apiKeyRepository.save(validApiKey);
    }

    @Test
    public void testA_ValidApiKey_ShouldUseAuthenticatedMerchantId() throws Exception {
        mockMvc.perform(post("/api/v1/gateway/payments/intents")
                .header("X-API-Key", validApiKeyRaw)
                .header("Idempotency-Key", UUID.randomUUID().toString())
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"amount\": 100, \"currency\": \"PHP\", \"sourceAccountId\": \"MERCHANT-SETTLEMENT-555\", \"description\": \"Test A\"}"))
                .andExpect(status().isOk());

        PaymentIntent intent = paymentIntentRepository.findAll().stream()
                .filter(i -> "Test A".equals(i.getDescription()))
                .findFirst().orElseThrow();
                
        assertEquals(correctMerchantId, intent.getMerchantId(), "Merchant ID must come from the API Key, not default extraction");
    }

    @Test
    public void testB_SpoofedClientHeader_ShouldIgnoreHeaderAndUseTokenMerchantId() throws Exception {
        mockMvc.perform(post("/api/v1/gateway/payments/intents")
                .header("X-API-Key", validApiKeyRaw)
                .header("X-Client-Id", "client_999") // Spoofed to merchant 999
                .header("Idempotency-Key", UUID.randomUUID().toString())
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"amount\": 200, \"currency\": \"PHP\", \"sourceAccountId\": \"MERCHANT-SETTLEMENT-555\", \"description\": \"Test B\"}"))
                .andExpect(status().isOk());

        PaymentIntent intent = paymentIntentRepository.findAll().stream()
                .filter(i -> "Test B".equals(i.getDescription()))
                .findFirst().orElseThrow();

        assertEquals(correctMerchantId, intent.getMerchantId(), "Spoofed X-Client-Id must be ignored in favor of API Key identity");
    }

    @Test
    public void testC_CrossAccountBola_AttemptToRouteToOtherOwnedAccount_ShouldDeny() throws Exception {
        // 1. Merchant owns BOTH Account A (MERCHANT-SETTLEMENT-555) and Account B (MERCHANT-PAYROLL-555)
        com.company.banking.account.domain.Account accountB = com.company.banking.account.domain.Account.builder()
                .accountNumber("MERCHANT-PAYROLL-555")
                .customerId(999L)
                .status(com.company.banking.common.enums.AccountStatus.ACTIVE)
                .balance(new java.math.BigDecimal("5000.00"))
                .currency("PHP")
                .accountType("PAYROLL")
                .allowIncoming(true)
                .allowOutgoing(true)
                .build();
        accountRepository.save(accountB);

        // 2. The validApiKey is bound exclusively to Account A (MERCHANT-SETTLEMENT-555)
        // 3. Attempt to use this credential against Account B
        mockMvc.perform(post("/api/v1/gateway/payments/intents")
                .header("X-API-Key", validApiKeyRaw)
                .header("Idempotency-Key", UUID.randomUUID().toString())
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"amount\": 300, \"currency\": \"PHP\", \"sourceAccountId\": \"MERCHANT-PAYROLL-555\", \"description\": \"BOLA Test\"}"))
                .andExpect(status().isForbidden());
    }
    @Test
    public void testD_MissingSourceAccountId_ShouldFailValidation() throws Exception {
        mockMvc.perform(post("/api/v1/gateway/payments/intents")
                .header("X-API-Key", validApiKeyRaw)
                .header("Idempotency-Key", UUID.randomUUID().toString())
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"amount\": 300, \"currency\": \"PHP\", \"description\": \"Test D\"}"))
                .andExpect(status().isBadRequest());
    }

    @Test
    public void testE_NullSourceAccountId_ShouldFailValidation() throws Exception {
        mockMvc.perform(post("/api/v1/gateway/payments/intents")
                .header("X-API-Key", validApiKeyRaw)
                .header("Idempotency-Key", UUID.randomUUID().toString())
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"amount\": 300, \"currency\": \"PHP\", \"sourceAccountId\": null, \"description\": \"Test E\"}"))
                .andExpect(status().isBadRequest());
    }

    @Test
    public void testF_EmptySourceAccountId_ShouldFailValidation() throws Exception {
        mockMvc.perform(post("/api/v1/gateway/payments/intents")
                .header("X-API-Key", validApiKeyRaw)
                .header("Idempotency-Key", UUID.randomUUID().toString())
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"amount\": 300, \"currency\": \"PHP\", \"sourceAccountId\": \"\", \"description\": \"Test F\"}"))
                .andExpect(status().isBadRequest());
    }

    @Test
    public void testG_WhitespaceSourceAccountId_ShouldFailValidation() throws Exception {
        mockMvc.perform(post("/api/v1/gateway/payments/intents")
                .header("X-API-Key", validApiKeyRaw)
                .header("Idempotency-Key", UUID.randomUUID().toString())
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"amount\": 300, \"currency\": \"PHP\", \"sourceAccountId\": \"   \", \"description\": \"Test G\"}"))
                .andExpect(status().isBadRequest());
    }
}
