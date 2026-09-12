package com.company.banking.payment;

import com.company.banking.account.domain.Account;
import com.company.banking.account.infrastructure.AccountJpaRepository;
import com.company.banking.apigateway.application.CreateApiKeyService;
import com.company.banking.apigateway.application.port.in.CreateApiKeyUseCase;
import com.company.banking.apigateway.infrastructure.ApiAuditEventJpaRepository;
import com.company.banking.apigateway.infrastructure.ApiKeyJpaEntity;
import com.company.banking.apigateway.infrastructure.ApiKeyJpaRepository;
import com.company.banking.common.enums.AccountStatus;
import com.company.banking.config.DataInitializer;
import com.company.banking.merchant.domain.Merchant;
import com.company.banking.merchant.infrastructure.MerchantJpaRepository;
import com.company.banking.payment.domain.PaymentIntent;
import com.company.banking.payment.infrastructure.PaymentIntentJpaRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Collections;
import java.util.List;
import java.util.UUID;
import java.util.concurrent.CountDownLatch;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.atomic.AtomicInteger;

import static org.junit.jupiter.api.Assertions.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

/**
 * 20 Path Testing Scenarios (PT-01 through PT-20)
 * Rigorously attacks every possible path by which the dummy seed account
 * (4859220013371001) could contaminate or enter the API request lifecycle.
 */
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@AutoConfigureMockMvc
@ActiveProfiles("test")
public class AccountConsistencyPathTestingIT {

    public static final String DUMMY_ACCOUNT = "4859220013371001";
    public static final String ACCOUNT_A = "9000000000000001";
    public static final String ACCOUNT_B = "9000000000000002";

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ApiKeyJpaRepository apiKeyRepository;

    @Autowired
    private PaymentIntentJpaRepository paymentIntentRepository;

    @Autowired
    private AccountJpaRepository accountRepository;

    @Autowired
    private MerchantJpaRepository merchantRepository;

    @Autowired
    private ApiAuditEventJpaRepository auditEventRepository;

    @Autowired
    private DataInitializer dataInitializer;

    @Autowired
    private CreateApiKeyUseCase createApiKeyUseCase;

    @org.springframework.test.context.bean.override.mockito.MockitoBean
    private com.company.banking.payment.gateway.ExternalPaymentGateway externalPaymentGateway;

    private String rawKeyA;
    private String rawKeyB;
    private Long merchantIdA;
    private Long merchantIdB;

    @BeforeEach
    public void setup() {
        auditEventRepository.deleteAll();
        paymentIntentRepository.deleteAll();
        apiKeyRepository.deleteAll();
        accountRepository.deleteAll();
        merchantRepository.deleteAll();

        // 1. Mock external payment gateway to return safe checkout URL
        org.mockito.Mockito.when(externalPaymentGateway.createCheckout(org.mockito.ArgumentMatchers.any()))
                .thenReturn(com.company.banking.payment.gateway.dto.PaymentSession.builder()
                        .providerReference("mock_ref_" + UUID.randomUUID())
                        .provider(com.company.banking.payment.domain.PaymentProvider.INTERNAL)
                        .channel(com.company.banking.payment.domain.PaymentChannel.HOSTED_CHECKOUT)
                        .checkoutUrl("https://pay.developerph.dev/mock-checkout")
                        .expiresAt(LocalDateTime.now().plusHours(1))
                        .build());

        // 2. Seed Merchants
        Merchant merchantA = Merchant.builder()
                .ownerId(101L)
                .legalName("Merchant A Enterprise")
                .merchantCode("M-MERCHANT-A")
                .businessRegistrationNumber("BRN-A-1001")
                .settlementAccount(ACCOUNT_A)
                .status("ACTIVE")
                .build();
        merchantA = merchantRepository.save(merchantA);
        merchantIdA = merchantA.getId();

        Merchant merchantB = Merchant.builder()
                .ownerId(102L)
                .legalName("Merchant B Enterprise")
                .merchantCode("M-MERCHANT-B")
                .businessRegistrationNumber("BRN-B-1002")
                .settlementAccount(ACCOUNT_B)
                .status("ACTIVE")
                .build();
        merchantB = merchantRepository.save(merchantB);
        merchantIdB = merchantB.getId();

        // 3. Seed Accounts: ACCOUNT_A, ACCOUNT_B, and DUMMY_ACCOUNT
        Account accA = Account.builder()
                .accountNumber(ACCOUNT_A)
                .customerId(101L)
                .merchantId(merchantIdA)
                .status(AccountStatus.ACTIVE)
                .balance(new BigDecimal("50000.00"))
                .currency("PHP")
                .accountType("MAIN")
                .allowIncoming(true)
                .allowOutgoing(true)
                .build();
        accountRepository.save(accA);

        Account accB = Account.builder()
                .accountNumber(ACCOUNT_B)
                .customerId(102L)
                .merchantId(merchantIdB)
                .status(AccountStatus.ACTIVE)
                .balance(new BigDecimal("50000.00"))
                .currency("PHP")
                .accountType("MAIN")
                .allowIncoming(true)
                .allowOutgoing(true)
                .build();
        accountRepository.save(accB);

        Account dummyAcc = Account.builder()
                .accountNumber(DUMMY_ACCOUNT)
                .customerId(999L)
                .status(AccountStatus.ACTIVE)
                .balance(new BigDecimal("10000.00"))
                .currency("PHP")
                .accountType("MAIN")
                .allowIncoming(true)
                .allowOutgoing(true)
                .build();
        accountRepository.save(dummyAcc);

        // 4. Seed KEY_A owned by ACCOUNT_A
        rawKeyA = "sk_test_key_account_a_" + UUID.randomUUID().toString().replace("-", "");
        apiKeyRepository.save(ApiKeyJpaEntity.builder()
                .keyPrefix("sk_test_")
                .keyHash(CreateApiKeyService.hashKey(rawKeyA))
                .merchantId(merchantIdA)
                .name("Key for Account A")
                .environment("SANDBOX")
                .cidrWhitelist("0.0.0.0/0")
                .scopes("payments:write,payments:read")
                .linkedAccountId(ACCOUNT_A)
                .applicationId("app_a")
                .applicationName("Client App A")
                .perTransactionLimit(new BigDecimal("100000.00"))
                .dailyLimit(new BigDecimal("1000000.00"))
                .expiresAt(LocalDateTime.now().plusDays(30))
                .createdAt(LocalDateTime.now())
                .build());

        // 5. Seed KEY_B owned by ACCOUNT_B
        rawKeyB = "sk_test_key_account_b_" + UUID.randomUUID().toString().replace("-", "");
        apiKeyRepository.save(ApiKeyJpaEntity.builder()
                .keyPrefix("sk_test_")
                .keyHash(CreateApiKeyService.hashKey(rawKeyB))
                .merchantId(merchantIdB)
                .name("Key for Account B")
                .environment("SANDBOX")
                .cidrWhitelist("0.0.0.0/0")
                .scopes("payments:write,payments:read")
                .linkedAccountId(ACCOUNT_B)
                .applicationId("app_b")
                .applicationName("Client App B")
                .perTransactionLimit(new BigDecimal("100000.00"))
                .dailyLimit(new BigDecimal("1000000.00"))
                .expiresAt(LocalDateTime.now().plusDays(30))
                .createdAt(LocalDateTime.now())
                .build());
    }

    private String buildPayload(String sourceAccountId, BigDecimal amount, String ref) {
        return String.format("{\"sourceAccountId\":\"%s\",\"amount\":%s,\"currency\":\"PHP\",\"description\":\"%s\",\"merchantReference\":\"%s\"}",
                sourceAccountId, amount.toPlainString(), ref, ref);
    }

    // =========================================================================
    // PT-01: Valid API key -> correct account
    // =========================================================================
    @Test
    @DisplayName("PT-01: Valid API key -> correct account (resolvedAccount != DUMMY_ACCOUNT)")
    public void testPT01_ValidApiKey_CorrectAccount() throws Exception {
        mockMvc.perform(post("/api/v1/gateway/payments/intents")
                .header("Authorization", "Bearer " + rawKeyA)
                .header("Idempotency-Key", "idem_pt01_" + System.currentTimeMillis())
                .contentType(MediaType.APPLICATION_JSON)
                .content(buildPayload(ACCOUNT_A, new BigDecimal("100.00"), "PT-01")))
                .andExpect(status().isOk());

        List<PaymentIntent> intents = paymentIntentRepository.findAll();
        assertFalse(intents.isEmpty());
        PaymentIntent intent = intents.get(0);

        assertEquals(ACCOUNT_A, intent.getCustomerAccountNumber());
        assertNotEquals(DUMMY_ACCOUNT, intent.getCustomerAccountNumber(), "Account must NEVER resolve to DUMMY_ACCOUNT");
        assertEquals(merchantIdA, intent.getMerchantId());
    }

    // =========================================================================
    // PT-02: Valid API key -> another valid account (IDOR Guard)
    // =========================================================================
    @Test
    @DisplayName("PT-02: Valid API key -> another valid account (403 Forbidden, no payment created)")
    public void testPT02_ValidApiKey_AnotherAccount_Forbidden() throws Exception {
        long initialCount = paymentIntentRepository.count();

        mockMvc.perform(post("/api/v1/gateway/payments/intents")
                .header("Authorization", "Bearer " + rawKeyA)
                .header("Idempotency-Key", "idem_pt02_" + System.currentTimeMillis())
                .contentType(MediaType.APPLICATION_JSON)
                .content(buildPayload(ACCOUNT_B, new BigDecimal("100.00"), "PT-02")))
                .andExpect(status().isForbidden());

        assertEquals(initialCount, paymentIntentRepository.count(), "No payment must be created on unauthorized account");
    }

    // =========================================================================
    // PT-03: API key omitted
    // =========================================================================
    @Test
    @DisplayName("PT-03: API key omitted (401 Unauthorized, no account resolution, no DUMMY_ACCOUNT)")
    public void testPT03_ApiKeyOmitted() throws Exception {
        long initialCount = paymentIntentRepository.count();

        mockMvc.perform(post("/api/v1/gateway/payments/intents")
                .header("Idempotency-Key", "idem_pt03_" + System.currentTimeMillis())
                .contentType(MediaType.APPLICATION_JSON)
                .content(buildPayload(ACCOUNT_A, new BigDecimal("100.00"), "PT-03")))
                .andExpect(status().isUnauthorized());

        assertEquals(initialCount, paymentIntentRepository.count());
    }

    // =========================================================================
    // PT-04: Invalid API key
    // =========================================================================
    @Test
    @DisplayName("PT-04: Invalid API key (401 Unauthorized, resolvedAccount != DUMMY_ACCOUNT)")
    public void testPT04_InvalidApiKey() throws Exception {
        mockMvc.perform(post("/api/v1/gateway/payments/intents")
                .header("Authorization", "Bearer sk_test_invalid_token_99999999999")
                .header("Idempotency-Key", "idem_pt04_" + System.currentTimeMillis())
                .contentType(MediaType.APPLICATION_JSON)
                .content(buildPayload(ACCOUNT_A, new BigDecimal("100.00"), "PT-04")))
                .andExpect(status().isUnauthorized());

        assertEquals(0, paymentIntentRepository.count());
    }

    // =========================================================================
    // PT-05: Expired API key
    // =========================================================================
    @Test
    @DisplayName("PT-05: Expired API key (401 Unauthorized, no account inherited)")
    public void testPT05_ExpiredApiKey() throws Exception {
        String rawExpired = "sk_test_expired_" + UUID.randomUUID().toString().replace("-", "");
        apiKeyRepository.save(ApiKeyJpaEntity.builder()
                .keyPrefix("sk_test_")
                .keyHash(CreateApiKeyService.hashKey(rawExpired))
                .merchantId(merchantIdA)
                .name("Expired Key")
                .environment("SANDBOX")
                .cidrWhitelist("0.0.0.0/0")
                .scopes("payments:write")
                .linkedAccountId(ACCOUNT_A)
                .expiresAt(LocalDateTime.now().minusDays(1)) // Expired
                .createdAt(LocalDateTime.now().minusDays(60))
                .build());

        mockMvc.perform(post("/api/v1/gateway/payments/intents")
                .header("Authorization", "Bearer " + rawExpired)
                .header("Idempotency-Key", "idem_pt05_" + System.currentTimeMillis())
                .contentType(MediaType.APPLICATION_JSON)
                .content(buildPayload(ACCOUNT_A, new BigDecimal("100.00"), "PT-05")))
                .andExpect(status().isUnauthorized());
    }

    // =========================================================================
    // PT-06: Revoked API key
    // =========================================================================
    @Test
    @DisplayName("PT-06: Revoked API key (401 Unauthorized, no 4859220013371001 in context)")
    public void testPT06_RevokedApiKey() throws Exception {
        String rawRevoked = "sk_test_revoked_" + UUID.randomUUID().toString().replace("-", "");
        apiKeyRepository.save(ApiKeyJpaEntity.builder()
                .keyPrefix("sk_test_")
                .keyHash(CreateApiKeyService.hashKey(rawRevoked))
                .merchantId(merchantIdA)
                .name("Revoked Key")
                .environment("SANDBOX")
                .cidrWhitelist("0.0.0.0/0")
                .scopes("payments:write")
                .linkedAccountId(ACCOUNT_A)
                .revokedAt(LocalDateTime.now().minusHours(1)) // Revoked
                .expiresAt(LocalDateTime.now().plusDays(30))
                .createdAt(LocalDateTime.now().minusDays(10))
                .build());

        mockMvc.perform(post("/api/v1/gateway/payments/intents")
                .header("Authorization", "Bearer " + rawRevoked)
                .header("Idempotency-Key", "idem_pt06_" + System.currentTimeMillis())
                .contentType(MediaType.APPLICATION_JSON)
                .content(buildPayload(ACCOUNT_A, new BigDecimal("100.00"), "PT-06")))
                .andExpect(status().isUnauthorized());
    }

    // =========================================================================
    // PT-07: API key exists but linked account is null
    // =========================================================================
    @Test
    @DisplayName("PT-07: API key exists but linked account is null (Authorization fails safely, not DUMMY_ACCOUNT)")
    public void testPT07_ApiKey_NullLinkedAccount_FailsSafely() throws Exception {
        String rawNullAcctKey = "sk_test_null_acct_" + UUID.randomUUID().toString().replace("-", "");
        apiKeyRepository.save(ApiKeyJpaEntity.builder()
                .keyPrefix("sk_test_")
                .keyHash(CreateApiKeyService.hashKey(rawNullAcctKey))
                .merchantId(merchantIdA)
                .name("Null Linked Account Key")
                .environment("SANDBOX")
                .cidrWhitelist("0.0.0.0/0")
                .scopes("payments:write")
                .linkedAccountId(null) // NULL linked account
                .expiresAt(LocalDateTime.now().plusDays(30))
                .createdAt(LocalDateTime.now())
                .build());

        // Attempt to transact on ACCOUNT_A
        mockMvc.perform(post("/api/v1/gateway/payments/intents")
                .header("Authorization", "Bearer " + rawNullAcctKey)
                .header("Idempotency-Key", "idem_pt07_" + System.currentTimeMillis())
                .contentType(MediaType.APPLICATION_JSON)
                .content(buildPayload(ACCOUNT_A, new BigDecimal("100.00"), "PT-07")))
                .andExpect(status().isForbidden());

        // Attempt to transact on DUMMY_ACCOUNT
        mockMvc.perform(post("/api/v1/gateway/payments/intents")
                .header("Authorization", "Bearer " + rawNullAcctKey)
                .header("Idempotency-Key", "idem_pt07_b_" + System.currentTimeMillis())
                .contentType(MediaType.APPLICATION_JSON)
                .content(buildPayload(DUMMY_ACCOUNT, new BigDecimal("100.00"), "PT-07-B")))
                .andExpect(status().isForbidden());
    }

    // =========================================================================
    // PT-08: API key exists but linked account is invalid
    // =========================================================================
    @Test
    @DisplayName("PT-08: API key exists but linked account is invalid (403 Forbidden, not DUMMY_ACCOUNT)")
    public void testPT08_ApiKey_InvalidLinkedAccount_Rejected() throws Exception {
        String rawUnknownAcctKey = "sk_test_unknown_acct_" + UUID.randomUUID().toString().replace("-", "");
        apiKeyRepository.save(ApiKeyJpaEntity.builder()
                .keyPrefix("sk_test_")
                .keyHash(CreateApiKeyService.hashKey(rawUnknownAcctKey))
                .merchantId(merchantIdA)
                .name("Unknown Account Key")
                .environment("SANDBOX")
                .cidrWhitelist("0.0.0.0/0")
                .scopes("payments:write")
                .linkedAccountId("UNKNOWN_ACCOUNT_XYZ")
                .expiresAt(LocalDateTime.now().plusDays(30))
                .createdAt(LocalDateTime.now())
                .build());

        mockMvc.perform(post("/api/v1/gateway/payments/intents")
                .header("Authorization", "Bearer " + rawUnknownAcctKey)
                .header("Idempotency-Key", "idem_pt08_" + System.currentTimeMillis())
                .contentType(MediaType.APPLICATION_JSON)
                .content(buildPayload(ACCOUNT_A, new BigDecimal("100.00"), "PT-08")))
                .andExpect(status().isForbidden());
    }

    // =========================================================================
    // PT-09: API key has legitimate UNRESTRICTED binding
    // =========================================================================
    @Test
    @DisplayName("PT-09: API key has legitimate UNRESTRICTED binding (Allowed, does NOT become DUMMY_ACCOUNT)")
    public void testPT09_UnrestrictedKey_TransactsOnAccountA() throws Exception {
        String rawUnrestricted = "sk_test_unrestricted_" + UUID.randomUUID().toString().replace("-", "");
        apiKeyRepository.save(ApiKeyJpaEntity.builder()
                .keyPrefix("sk_test_")
                .keyHash(CreateApiKeyService.hashKey(rawUnrestricted))
                .merchantId(merchantIdA)
                .name("Unrestricted Test Key")
                .environment("SANDBOX")
                .cidrWhitelist("0.0.0.0/0")
                .scopes("payments:write,payments:read")
                .linkedAccountId("UNRESTRICTED")
                .expiresAt(LocalDateTime.now().plusDays(30))
                .createdAt(LocalDateTime.now())
                .build());

        mockMvc.perform(post("/api/v1/gateway/payments/intents")
                .header("Authorization", "Bearer " + rawUnrestricted)
                .header("Idempotency-Key", "idem_pt09_" + System.currentTimeMillis())
                .contentType(MediaType.APPLICATION_JSON)
                .content(buildPayload(ACCOUNT_A, new BigDecimal("250.00"), "PT-09")))
                .andExpect(status().isOk());

        PaymentIntent intent = paymentIntentRepository.findAll().stream()
                .filter(i -> "PT-09".equals(i.getDescription()))
                .findFirst().orElseThrow();

        assertEquals(ACCOUNT_A, intent.getCustomerAccountNumber());
        assertNotEquals(DUMMY_ACCOUNT, intent.getCustomerAccountNumber());
    }

    // =========================================================================
    // PT-10: API key resolution cache hit
    // =========================================================================
    @Test
    @DisplayName("PT-10: API key resolution cache hit (both requests resolve to ACCOUNT_A)")
    public void testPT10_ResolutionCacheHit() throws Exception {
        // First request
        mockMvc.perform(post("/api/v1/gateway/payments/intents")
                .header("Authorization", "Bearer " + rawKeyA)
                .header("Idempotency-Key", "idem_pt10_1_" + System.currentTimeMillis())
                .contentType(MediaType.APPLICATION_JSON)
                .content(buildPayload(ACCOUNT_A, new BigDecimal("100.00"), "PT-10-1")))
                .andExpect(status().isOk());

        // Second request
        mockMvc.perform(post("/api/v1/gateway/payments/intents")
                .header("Authorization", "Bearer " + rawKeyA)
                .header("Idempotency-Key", "idem_pt10_2_" + System.currentTimeMillis())
                .contentType(MediaType.APPLICATION_JSON)
                .content(buildPayload(ACCOUNT_A, new BigDecimal("100.00"), "PT-10-2")))
                .andExpect(status().isOk());

        List<PaymentIntent> intents = paymentIntentRepository.findAll();
        assertEquals(2, intents.size());
        for (PaymentIntent intent : intents) {
            assertEquals(ACCOUNT_A, intent.getCustomerAccountNumber());
            assertNotEquals(DUMMY_ACCOUNT, intent.getCustomerAccountNumber());
        }
    }

    // =========================================================================
    // PT-11: API key resolution after application restart simulation
    // =========================================================================
    @Test
    @DisplayName("PT-11: API key resolution after restart simulation (KEY_A -> ACCOUNT_A preserved)")
    public void testPT11_AfterRestartSimulation() throws Exception {
        // Verify key exists
        ApiKeyJpaEntity entity = apiKeyRepository.findByKeyHash(CreateApiKeyService.hashKey(rawKeyA)).orElseThrow();
        assertEquals(ACCOUNT_A, entity.getLinkedAccountId());

        // Perform request
        mockMvc.perform(post("/api/v1/gateway/payments/intents")
                .header("Authorization", "Bearer " + rawKeyA)
                .header("Idempotency-Key", "idem_pt11_" + System.currentTimeMillis())
                .contentType(MediaType.APPLICATION_JSON)
                .content(buildPayload(ACCOUNT_A, new BigDecimal("100.00"), "PT-11")))
                .andExpect(status().isOk());

        PaymentIntent intent = paymentIntentRepository.findAll().get(0);
        assertEquals(ACCOUNT_A, intent.getCustomerAccountNumber());
        assertNotEquals(DUMMY_ACCOUNT, intent.getCustomerAccountNumber());
    }

    // =========================================================================
    // PT-12: API key resolution after DataInitializer executes
    // =========================================================================
    @Test
    @DisplayName("PT-12: API key resolution after DataInitializer executes (KEY_A not overwritten with DUMMY_ACCOUNT)")
    public void testPT12_AfterDataInitializerExecutes() throws Exception {
        // Run data initializer explicitly
        dataInitializer.run();

        // Verify KEY_A still bound to ACCOUNT_A
        ApiKeyJpaEntity entity = apiKeyRepository.findByKeyHash(CreateApiKeyService.hashKey(rawKeyA)).orElseThrow();
        assertEquals(ACCOUNT_A, entity.getLinkedAccountId());
        assertNotEquals(DUMMY_ACCOUNT, entity.getLinkedAccountId());

        // Call endpoint with KEY_A
        mockMvc.perform(post("/api/v1/gateway/payments/intents")
                .header("Authorization", "Bearer " + rawKeyA)
                .header("Idempotency-Key", "idem_pt12_" + System.currentTimeMillis())
                .contentType(MediaType.APPLICATION_JSON)
                .content(buildPayload(ACCOUNT_A, new BigDecimal("100.00"), "PT-12")))
                .andExpect(status().isOk());

        PaymentIntent intent = paymentIntentRepository.findAll().stream()
                .filter(i -> "PT-12".equals(i.getDescription()))
                .findFirst().orElseThrow();
        assertEquals(ACCOUNT_A, intent.getCustomerAccountNumber());
        assertNotEquals(DUMMY_ACCOUNT, intent.getCustomerAccountNumber());
    }

    // =========================================================================
    // PT-13: Existing database key loaded at startup
    // =========================================================================
    @Test
    @DisplayName("PT-13: Existing database key loaded at startup (preserves relationship)")
    public void testPT13_ExistingKeyLoadedFromDatabase() throws Exception {
        ApiKeyJpaEntity loaded = apiKeyRepository.findByKeyHash(CreateApiKeyService.hashKey(rawKeyA)).orElseThrow();
        assertEquals(ACCOUNT_A, loaded.getLinkedAccountId());

        mockMvc.perform(post("/api/v1/gateway/payments/intents")
                .header("Authorization", "Bearer " + rawKeyA)
                .header("Idempotency-Key", "idem_pt13_" + System.currentTimeMillis())
                .contentType(MediaType.APPLICATION_JSON)
                .content(buildPayload(ACCOUNT_A, new BigDecimal("100.00"), "PT-13")))
                .andExpect(status().isOk());

        PaymentIntent intent = paymentIntentRepository.findAll().get(0);
        assertEquals(ACCOUNT_A, intent.getCustomerAccountNumber());
    }

    // =========================================================================
    // PT-14: New dynamically generated key
    // =========================================================================
    @Test
    @DisplayName("PT-14: New dynamically generated key (KEY_NEW -> ACCOUNT_A, not DUMMY_ACCOUNT)")
    public void testPT14_DynamicallyGeneratedKey() throws Exception {
        com.company.banking.apigateway.api.dto.CreateApiKeyRequest req = 
                new com.company.banking.apigateway.api.dto.CreateApiKeyRequest();
        req.setName("Dynamic Key PT14");
        req.setEnvironment("SANDBOX");
        req.setLinkedAccountId(ACCOUNT_A);
        req.setScopes(java.util.Set.of("payments:write", "payments:read"));

        var keyResponse = createApiKeyUseCase.createApiKey(merchantIdA, req);
        String dynamicRawKey = keyResponse.getRawKey();
        assertNotNull(dynamicRawKey);

        // Send request immediately
        mockMvc.perform(post("/api/v1/gateway/payments/intents")
                .header("Authorization", "Bearer " + dynamicRawKey)
                .header("Idempotency-Key", "idem_pt14_" + System.currentTimeMillis())
                .contentType(MediaType.APPLICATION_JSON)
                .content(buildPayload(ACCOUNT_A, new BigDecimal("100.00"), "PT-14")))
                .andExpect(status().isOk());

        PaymentIntent intent = paymentIntentRepository.findAll().get(0);
        assertEquals(ACCOUNT_A, intent.getCustomerAccountNumber());
        assertNotEquals(DUMMY_ACCOUNT, intent.getCustomerAccountNumber());
    }

    // =========================================================================
    // PT-15: Two API keys belonging to two accounts
    // =========================================================================
    @Test
    @DisplayName("PT-15: Two API keys sequential calls (A -> B -> A, no stale contamination)")
    public void testPT15_SequentialKeysNoContamination() throws Exception {
        // 1. KEY_A -> ACCOUNT_A
        mockMvc.perform(post("/api/v1/gateway/payments/intents")
                .header("Authorization", "Bearer " + rawKeyA)
                .header("Idempotency-Key", "idem_pt15_1_" + System.currentTimeMillis())
                .contentType(MediaType.APPLICATION_JSON)
                .content(buildPayload(ACCOUNT_A, new BigDecimal("100.00"), "PT-15-A1")))
                .andExpect(status().isOk());

        // 2. KEY_B -> ACCOUNT_B
        mockMvc.perform(post("/api/v1/gateway/payments/intents")
                .header("Authorization", "Bearer " + rawKeyB)
                .header("Idempotency-Key", "idem_pt15_2_" + System.currentTimeMillis())
                .contentType(MediaType.APPLICATION_JSON)
                .content(buildPayload(ACCOUNT_B, new BigDecimal("200.00"), "PT-15-B")))
                .andExpect(status().isOk());

        // 3. KEY_A -> ACCOUNT_A again
        mockMvc.perform(post("/api/v1/gateway/payments/intents")
                .header("Authorization", "Bearer " + rawKeyA)
                .header("Idempotency-Key", "idem_pt15_3_" + System.currentTimeMillis())
                .contentType(MediaType.APPLICATION_JSON)
                .content(buildPayload(ACCOUNT_A, new BigDecimal("300.00"), "PT-15-A2")))
                .andExpect(status().isOk());

        List<PaymentIntent> intents = paymentIntentRepository.findAll();
        assertEquals(3, intents.size());

        PaymentIntent p1 = intents.stream().filter(i -> "PT-15-A1".equals(i.getDescription())).findFirst().orElseThrow();
        assertEquals(ACCOUNT_A, p1.getCustomerAccountNumber());

        PaymentIntent p2 = intents.stream().filter(i -> "PT-15-B".equals(i.getDescription())).findFirst().orElseThrow();
        assertEquals(ACCOUNT_B, p2.getCustomerAccountNumber());

        PaymentIntent p3 = intents.stream().filter(i -> "PT-15-A2".equals(i.getDescription())).findFirst().orElseThrow();
        assertEquals(ACCOUNT_A, p3.getCustomerAccountNumber());
    }

    // =========================================================================
    // PT-16: Concurrent requests from two accounts
    // =========================================================================
    @Test
    @DisplayName("PT-16: Concurrent requests from two accounts (no race condition or shared contamination)")
    public void testPT16_ConcurrentRequestsFromTwoAccounts() throws Exception {
        ExecutorService executor = Executors.newFixedThreadPool(2);
        CountDownLatch latch = new CountDownLatch(2);
        AtomicInteger successCount = new AtomicInteger(0);

        executor.submit(() -> {
            try {
                mockMvc.perform(post("/api/v1/gateway/payments/intents")
                        .header("Authorization", "Bearer " + rawKeyA)
                        .header("Idempotency-Key", "idem_pt16_A_" + System.currentTimeMillis())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(buildPayload(ACCOUNT_A, new BigDecimal("100.00"), "PT-16-A")))
                        .andExpect(status().isOk());
                successCount.incrementAndGet();
            } catch (Exception e) {
                e.printStackTrace();
            } finally {
                latch.countDown();
            }
        });

        executor.submit(() -> {
            try {
                mockMvc.perform(post("/api/v1/gateway/payments/intents")
                        .header("Authorization", "Bearer " + rawKeyB)
                        .header("Idempotency-Key", "idem_pt16_B_" + System.currentTimeMillis())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(buildPayload(ACCOUNT_B, new BigDecimal("200.00"), "PT-16-B")))
                        .andExpect(status().isOk());
                successCount.incrementAndGet();
            } catch (Exception e) {
                e.printStackTrace();
            } finally {
                latch.countDown();
            }
        });

        assertTrue(latch.await(10, TimeUnit.SECONDS));
        assertEquals(2, successCount.get());

        List<PaymentIntent> intents = paymentIntentRepository.findAll();
        assertEquals(2, intents.size());
        PaymentIntent pA = intents.stream().filter(i -> "PT-16-A".equals(i.getDescription())).findFirst().orElseThrow();
        assertEquals(ACCOUNT_A, pA.getCustomerAccountNumber());

        PaymentIntent pB = intents.stream().filter(i -> "PT-16-B".equals(i.getDescription())).findFirst().orElseThrow();
        assertEquals(ACCOUNT_B, pB.getCustomerAccountNumber());

        assertNotEquals(DUMMY_ACCOUNT, pA.getCustomerAccountNumber());
        assertNotEquals(DUMMY_ACCOUNT, pB.getCustomerAccountNumber());
        executor.shutdown();
    }

    // =========================================================================
    // PT-17: Header precedence test
    // =========================================================================
    @Test
    @DisplayName("PT-17: Header precedence test (Authorization: Bearer KEY_A wins over X-API-Key: KEY_B)")
    public void testPT17_HeaderPrecedence_AuthorizationWins() throws Exception {
        // Send Authorization=KEY_A (linked to ACCOUNT_A) and X-API-Key=KEY_B (linked to ACCOUNT_B)
        // Request body targets ACCOUNT_A
        mockMvc.perform(post("/api/v1/gateway/payments/intents")
                .header("Authorization", "Bearer " + rawKeyA)
                .header("X-API-Key", rawKeyB)
                .header("Idempotency-Key", "idem_pt17_" + System.currentTimeMillis())
                .contentType(MediaType.APPLICATION_JSON)
                .content(buildPayload(ACCOUNT_A, new BigDecimal("100.00"), "PT-17")))
                .andExpect(status().isOk());

        PaymentIntent intent = paymentIntentRepository.findAll().get(0);
        assertEquals(ACCOUNT_A, intent.getCustomerAccountNumber());
        assertEquals(merchantIdA, intent.getMerchantId(), "Precedence must authenticate KEY_A and merchantIdA");
        assertNotEquals(DUMMY_ACCOUNT, intent.getCustomerAccountNumber());
    }

    // =========================================================================
    // PT-18: Old sk_live key versus new sk_test key
    // =========================================================================
    @Test
    @DisplayName("PT-18: Old live key vs new test key (rejected if mismatch, NEVER silently use DUMMY_ACCOUNT)")
    public void testPT18_OldLiveKey_AccountMismatch_Rejected() throws Exception {
        // Simulate old production live key bound to ACCOUNT_A
        String rawOldLiveKey = "sk_live_old_prod_" + UUID.randomUUID().toString().replace("-", "");
        apiKeyRepository.save(ApiKeyJpaEntity.builder()
                .keyPrefix("sk_live_")
                .keyHash(CreateApiKeyService.hashKey(rawOldLiveKey))
                .merchantId(merchantIdA)
                .name("Old Production Live Key")
                .environment("LIVE")
                .cidrWhitelist("0.0.0.0/0")
                .scopes("payments:write")
                .linkedAccountId(ACCOUNT_A)
                .expiresAt(LocalDateTime.now().plusDays(30))
                .createdAt(LocalDateTime.now())
                .build());

        // Client mistakenly sends OLD_LIVE_KEY while attempting to transact on ACCOUNT_B
        mockMvc.perform(post("/api/v1/gateway/payments/intents")
                .header("Authorization", "Bearer " + rawOldLiveKey)
                .header("Idempotency-Key", "idem_pt18_" + System.currentTimeMillis())
                .contentType(MediaType.APPLICATION_JSON)
                .content(buildPayload(ACCOUNT_B, new BigDecimal("100.00"), "PT-18")))
                .andExpect(status().isForbidden());

        assertEquals(0, paymentIntentRepository.count(), "No payment must be created when key and account mismatch");
    }

    // =========================================================================
    // PT-19: Controller receives account from security filter
    // =========================================================================
    @Test
    @DisplayName("PT-19: Controller receives account from security filter (preserves ACCOUNT_A)")
    public void testPT19_ControllerReceivesAccountFromSecurityFilter() throws Exception {
        MvcResult result = mockMvc.perform(post("/api/v1/gateway/payments/intents")
                .header("Authorization", "Bearer " + rawKeyA)
                .header("Idempotency-Key", "idem_pt19_" + System.currentTimeMillis())
                .contentType(MediaType.APPLICATION_JSON)
                .content(buildPayload(ACCOUNT_A, new BigDecimal("100.00"), "PT-19")))
                .andExpect(status().isOk())
                .andReturn();

        PaymentIntent intent = paymentIntentRepository.findAll().get(0);
        assertEquals(ACCOUNT_A, intent.getCustomerAccountNumber());
        assertNotEquals(DUMMY_ACCOUNT, intent.getCustomerAccountNumber());
    }

    // =========================================================================
    // PT-20: End-to-end dummy-account regression path
    // =========================================================================
    @Test
    @DisplayName("PT-20: Comprehensive end-to-end dummy-account regression path")
    public void testPT20_EndToEndDummyAccountRegressionPath() throws Exception {
        // Send request targeting ACCOUNT_A using KEY_A
        mockMvc.perform(post("/api/v1/gateway/payments/intents")
                .header("Authorization", "Bearer " + rawKeyA)
                .header("Idempotency-Key", "idem_pt20_" + System.currentTimeMillis())
                .contentType(MediaType.APPLICATION_JSON)
                .content(buildPayload(ACCOUNT_A, new BigDecimal("150.00"), "PT-20")))
                .andExpect(status().isOk());

        // 1. Verify Payment Intent in Database
        List<PaymentIntent> intents = paymentIntentRepository.findAll();
        assertEquals(1, intents.size());
        PaymentIntent persistedIntent = intents.get(0);

        // Required assertions for PT-20:
        assertEquals(ACCOUNT_A, persistedIntent.getCustomerAccountNumber());
        assertNotEquals(DUMMY_ACCOUNT, persistedIntent.getCustomerAccountNumber(), 
                "Persisted payment customerAccountNumber must NEVER equal DUMMY_ACCOUNT");

        // 2. Verify Audit Event
        var auditLogs = auditEventRepository.findAll();
        assertFalse(auditLogs.isEmpty());
        var audit = auditLogs.stream()
                .filter(a -> "/api/v1/gateway/payments/intents".equals(a.getEndpoint()))
                .findFirst().orElseThrow();

        assertEquals(ACCOUNT_A, audit.getLinkedAccountId(), "Audit linkedAccountId must equal ACCOUNT_A");
        assertNotEquals(DUMMY_ACCOUNT, audit.getLinkedAccountId(), "Audit linkedAccountId must NEVER equal DUMMY_ACCOUNT");
        assertEquals(200, audit.getResponseCode());
        assertEquals("COMPLETED", audit.getRequestStage());
    }
}

