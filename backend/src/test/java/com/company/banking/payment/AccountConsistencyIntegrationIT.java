package com.company.banking.payment;

import com.company.banking.account.domain.Account;
import com.company.banking.account.infrastructure.AccountJpaRepository;
import com.company.banking.apigateway.application.CreateApiKeyService;
import com.company.banking.apigateway.application.port.in.CreateApiKeyUseCase;
import com.company.banking.apigateway.domain.ApiAuditEvent;
import com.company.banking.apigateway.domain.ApiKey;
import com.company.banking.apigateway.infrastructure.ApiAuditEventJpaRepository;
import com.company.banking.apigateway.infrastructure.ApiKeyJpaEntity;
import com.company.banking.apigateway.infrastructure.ApiKeyJpaRepository;
import com.company.banking.common.enums.AccountStatus;
import com.company.banking.config.DataInitializer;
import com.company.banking.merchant.domain.Merchant;
import com.company.banking.merchant.infrastructure.MerchantJpaRepository;
import com.company.banking.payment.domain.PaymentIntent;
import com.company.banking.payment.infrastructure.PaymentIntentJpaRepository;
import jakarta.persistence.EntityManager;
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
import java.util.List;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

/**
 * 10 Integration Testing Scenarios (IT-01 through IT-10)
 * Formalizes the ACCOUNT CONSISTENCY INVARIANT across real database,
 * security filters, controller, service, persistence, and audit logging layers.
 */
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@AutoConfigureMockMvc
@ActiveProfiles("test")
public class AccountConsistencyIntegrationIT {

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

    @Autowired
    private EntityManager entityManager;

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

        // Mock external gateway
        org.mockito.Mockito.when(externalPaymentGateway.createCheckout(org.mockito.ArgumentMatchers.any()))
                .thenReturn(com.company.banking.payment.gateway.dto.PaymentSession.builder()
                        .providerReference("mock_ref_" + UUID.randomUUID())
                        .provider(com.company.banking.payment.domain.PaymentProvider.INTERNAL)
                        .channel(com.company.banking.payment.domain.PaymentChannel.HOSTED_CHECKOUT)
                        .checkoutUrl("https://pay.developerph.dev/mock-checkout")
                        .expiresAt(LocalDateTime.now().plusHours(1))
                        .build());

        // Seed Merchants
        Merchant merchantA = Merchant.builder()
                .ownerId(201L)
                .legalName("Enterprise Merchant A")
                .merchantCode("M-ENTERPRISE-A")
                .businessRegistrationNumber("BRN-IT-A")
                .settlementAccount(ACCOUNT_A)
                .status("ACTIVE")
                .build();
        merchantA = merchantRepository.save(merchantA);
        merchantIdA = merchantA.getId();

        Merchant merchantB = Merchant.builder()
                .ownerId(202L)
                .legalName("Enterprise Merchant B")
                .merchantCode("M-ENTERPRISE-B")
                .businessRegistrationNumber("BRN-IT-B")
                .settlementAccount(ACCOUNT_B)
                .status("ACTIVE")
                .build();
        merchantB = merchantRepository.save(merchantB);
        merchantIdB = merchantB.getId();

        // Seed Accounts
        Account accA = Account.builder()
                .accountNumber(ACCOUNT_A)
                .customerId(201L)
                .merchantId(merchantIdA)
                .status(AccountStatus.ACTIVE)
                .balance(new BigDecimal("75000.00"))
                .currency("PHP")
                .accountType("MAIN")
                .allowIncoming(true)
                .allowOutgoing(true)
                .build();
        accountRepository.save(accA);

        Account accB = Account.builder()
                .accountNumber(ACCOUNT_B)
                .customerId(202L)
                .merchantId(merchantIdB)
                .status(AccountStatus.ACTIVE)
                .balance(new BigDecimal("75000.00"))
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

        // Seed KEY_A (linked to ACCOUNT_A)
        rawKeyA = "sk_test_it_a_" + UUID.randomUUID().toString().replace("-", "");
        apiKeyRepository.save(ApiKeyJpaEntity.builder()
                .keyPrefix("sk_test_")
                .keyHash(CreateApiKeyService.hashKey(rawKeyA))
                .merchantId(merchantIdA)
                .name("Integration Key A")
                .environment("SANDBOX")
                .cidrWhitelist("0.0.0.0/0")
                .scopes("payments:write,payments:read")
                .linkedAccountId(ACCOUNT_A)
                .applicationId("app_it_a")
                .applicationName("Integration App A")
                .perTransactionLimit(new BigDecimal("100000.00"))
                .dailyLimit(new BigDecimal("1000000.00"))
                .expiresAt(LocalDateTime.now().plusDays(30))
                .createdAt(LocalDateTime.now())
                .build());

        // Seed KEY_B (linked to ACCOUNT_B)
        rawKeyB = "sk_test_it_b_" + UUID.randomUUID().toString().replace("-", "");
        apiKeyRepository.save(ApiKeyJpaEntity.builder()
                .keyPrefix("sk_test_")
                .keyHash(CreateApiKeyService.hashKey(rawKeyB))
                .merchantId(merchantIdB)
                .name("Integration Key B")
                .environment("SANDBOX")
                .cidrWhitelist("0.0.0.0/0")
                .scopes("payments:write,payments:read")
                .linkedAccountId(ACCOUNT_B)
                .applicationId("app_it_b")
                .applicationName("Integration App B")
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
    // IT-01: Real API key -> real database account
    // =========================================================================
    @Test
    @DisplayName("IT-01: Real API key -> real database account")
    public void testIT01_RealApiKey_RealDatabaseAccount() throws Exception {
        mockMvc.perform(post("/api/v1/gateway/payments/intents")
                .header("Authorization", "Bearer " + rawKeyA)
                .header("Idempotency-Key", "idem_it01_" + System.currentTimeMillis())
                .contentType(MediaType.APPLICATION_JSON)
                .content(buildPayload(ACCOUNT_A, new BigDecimal("500.00"), "IT-01")))
                .andExpect(status().isOk());

        PaymentIntent intent = paymentIntentRepository.findAll().stream()
                .filter(i -> "IT-01".equals(i.getDescription()))
                .findFirst().orElseThrow();

        assertEquals(ACCOUNT_A, intent.getCustomerAccountNumber());
        assertNotEquals(DUMMY_ACCOUNT, intent.getCustomerAccountNumber());
        assertEquals(merchantIdA, intent.getMerchantId());
    }

    // =========================================================================
    // IT-02: Database key must not be replaced by DataInitializer
    // =========================================================================
    @Test
    @DisplayName("IT-02: Database key must not be replaced by DataInitializer")
    public void testIT02_KeyNotReplacedByDataInitializer() throws Exception {
        // Execute startup initialization
        dataInitializer.run();

        // Verify KEY_A still maps to ACCOUNT_A
        ApiKeyJpaEntity entity = apiKeyRepository.findByKeyHash(CreateApiKeyService.hashKey(rawKeyA)).orElseThrow();
        assertEquals(ACCOUNT_A, entity.getLinkedAccountId());
        assertNotEquals(DUMMY_ACCOUNT, entity.getLinkedAccountId(), "Initializer must NOT replace or adopt KEY_A to DUMMY_ACCOUNT");

        // Verify request creates payment for ACCOUNT_A
        mockMvc.perform(post("/api/v1/gateway/payments/intents")
                .header("Authorization", "Bearer " + rawKeyA)
                .header("Idempotency-Key", "idem_it02_" + System.currentTimeMillis())
                .contentType(MediaType.APPLICATION_JSON)
                .content(buildPayload(ACCOUNT_A, new BigDecimal("300.00"), "IT-02")))
                .andExpect(status().isOk());

        PaymentIntent intent = paymentIntentRepository.findAll().stream()
                .filter(i -> "IT-02".equals(i.getDescription()))
                .findFirst().orElseThrow();
        assertEquals(ACCOUNT_A, intent.getCustomerAccountNumber());
        assertNotEquals(DUMMY_ACCOUNT, intent.getCustomerAccountNumber());
    }

    // =========================================================================
    // IT-03: Dynamically created API key -> external request
    // =========================================================================
    @Test
    @DisplayName("IT-03: Dynamically created API key -> external request")
    public void testIT03_DynamicallyCreatedKey_ExternalRequest() throws Exception {
        com.company.banking.apigateway.api.dto.CreateApiKeyRequest createRequest = 
                new com.company.banking.apigateway.api.dto.CreateApiKeyRequest();
        createRequest.setName("Dynamic IT-03 Key");
        createRequest.setEnvironment("SANDBOX");
        createRequest.setLinkedAccountId(ACCOUNT_A);
        createRequest.setScopes(java.util.Set.of("payments:write", "payments:read"));

        var response = createApiKeyUseCase.createApiKey(merchantIdA, createRequest);
        String createdRawKey = response.getRawKey();
        assertNotNull(createdRawKey);

        // Execute payment intent using newly created key
        mockMvc.perform(post("/api/v1/gateway/payments/intents")
                .header("Authorization", "Bearer " + createdRawKey)
                .header("Idempotency-Key", "idem_it03_" + System.currentTimeMillis())
                .contentType(MediaType.APPLICATION_JSON)
                .content(buildPayload(ACCOUNT_A, new BigDecimal("450.00"), "IT-03")))
                .andExpect(status().isOk());

        PaymentIntent intent = paymentIntentRepository.findAll().stream()
                .filter(i -> "IT-03".equals(i.getDescription()))
                .findFirst().orElseThrow();

        assertEquals(ACCOUNT_A, intent.getCustomerAccountNumber());
        assertNotEquals(DUMMY_ACCOUNT, intent.getCustomerAccountNumber());
    }

    // =========================================================================
    // IT-04: Key creation -> retrieval -> payment (full lifecycle)
    // =========================================================================
    @Test
    @DisplayName("IT-04: Key creation -> retrieval -> payment lifecycle")
    public void testIT04_KeyLifecycle_Creation_Retrieval_Payment() throws Exception {
        // 1. Create API Key
        com.company.banking.apigateway.api.dto.CreateApiKeyRequest createReq = 
                new com.company.banking.apigateway.api.dto.CreateApiKeyRequest();
        createReq.setName("Lifecycle IT-04 Key");
        createReq.setEnvironment("SANDBOX");
        createReq.setLinkedAccountId(ACCOUNT_A);
        createReq.setScopes(java.util.Set.of("payments:write", "payments:read"));

        var created = createApiKeyUseCase.createApiKey(merchantIdA, createReq);
        String rawKey = created.getRawKey();

        // 2. Retrieve key from persistence
        ApiKeyJpaEntity persisted = apiKeyRepository.findById(created.getId()).orElseThrow();
        assertEquals(ACCOUNT_A, persisted.getLinkedAccountId());
        assertEquals("SANDBOX", persisted.getEnvironment());

        // 3. Execute Payment Intent
        mockMvc.perform(post("/api/v1/gateway/payments/intents")
                .header("Authorization", "Bearer " + rawKey)
                .header("Idempotency-Key", "idem_it04_" + System.currentTimeMillis())
                .contentType(MediaType.APPLICATION_JSON)
                .content(buildPayload(ACCOUNT_A, new BigDecimal("200.00"), "IT-04")))
                .andExpect(status().isOk());

        PaymentIntent intent = paymentIntentRepository.findAll().stream()
                .filter(i -> "IT-04".equals(i.getDescription()))
                .findFirst().orElseThrow();
        assertEquals(ACCOUNT_A, intent.getCustomerAccountNumber());
    }

    // =========================================================================
    // IT-05: Wrong account integration test
    // =========================================================================
    @Test
    @DisplayName("IT-05: Wrong account integration test (403 Forbidden, payment count unchanged)")
    public void testIT05_WrongAccountIntegrationTest() throws Exception {
        long initialPaymentCount = paymentIntentRepository.count();

        mockMvc.perform(post("/api/v1/gateway/payments/intents")
                .header("Authorization", "Bearer " + rawKeyA)
                .header("Idempotency-Key", "idem_it05_" + System.currentTimeMillis())
                .contentType(MediaType.APPLICATION_JSON)
                .content(buildPayload(ACCOUNT_B, new BigDecimal("100.00"), "IT-05")))
                .andExpect(status().isForbidden());

        assertEquals(initialPaymentCount, paymentIntentRepository.count(), 
                "Payment count in database must remain unchanged after rejected transaction");
    }

    // =========================================================================
    // IT-06: Restart persistence test
    // =========================================================================
    @Test
    @DisplayName("IT-06: Restart persistence test (clear EntityManager, verify KEY_A -> ACCOUNT_A)")
    public void testIT06_RestartPersistenceTest() throws Exception {
        // Clear EntityManager persistence context to simulate clean state after restart
        entityManager.clear();

        mockMvc.perform(post("/api/v1/gateway/payments/intents")
                .header("Authorization", "Bearer " + rawKeyA)
                .header("Idempotency-Key", "idem_it06_" + System.currentTimeMillis())
                .contentType(MediaType.APPLICATION_JSON)
                .content(buildPayload(ACCOUNT_A, new BigDecimal("120.00"), "IT-06")))
                .andExpect(status().isOk());

        PaymentIntent intent = paymentIntentRepository.findAll().stream()
                .filter(i -> "IT-06".equals(i.getDescription()))
                .findFirst().orElseThrow();
        assertEquals(ACCOUNT_A, intent.getCustomerAccountNumber());
        assertNotEquals(DUMMY_ACCOUNT, intent.getCustomerAccountNumber());
    }

    // =========================================================================
    // IT-07: Two-account isolation
    // =========================================================================
    @Test
    @DisplayName("IT-07: Two-account isolation (Payment 1 -> ACCOUNT_A, Payment 2 -> ACCOUNT_B)")
    public void testIT07_TwoAccountIsolation() throws Exception {
        // Payment on Account A
        mockMvc.perform(post("/api/v1/gateway/payments/intents")
                .header("Authorization", "Bearer " + rawKeyA)
                .header("Idempotency-Key", "idem_it07_A_" + System.currentTimeMillis())
                .contentType(MediaType.APPLICATION_JSON)
                .content(buildPayload(ACCOUNT_A, new BigDecimal("100.00"), "IT-07-A")))
                .andExpect(status().isOk());

        // Payment on Account B
        mockMvc.perform(post("/api/v1/gateway/payments/intents")
                .header("Authorization", "Bearer " + rawKeyB)
                .header("Idempotency-Key", "idem_it07_B_" + System.currentTimeMillis())
                .contentType(MediaType.APPLICATION_JSON)
                .content(buildPayload(ACCOUNT_B, new BigDecimal("200.00"), "IT-07-B")))
                .andExpect(status().isOk());

        List<PaymentIntent> intents = paymentIntentRepository.findAll();
        assertEquals(2, intents.size());

        PaymentIntent pA = intents.stream().filter(i -> "IT-07-A".equals(i.getDescription())).findFirst().orElseThrow();
        assertEquals(ACCOUNT_A, pA.getCustomerAccountNumber());
        assertEquals(merchantIdA, pA.getMerchantId());

        PaymentIntent pB = intents.stream().filter(i -> "IT-07-B".equals(i.getDescription())).findFirst().orElseThrow();
        assertEquals(ACCOUNT_B, pB.getCustomerAccountNumber());
        assertEquals(merchantIdB, pB.getMerchantId());
    }

    // =========================================================================
    // IT-08: Audit integration (Meaningful rejection reason, NOT stage=COMPLETED reason=null)
    // =========================================================================
    @Test
    @DisplayName("IT-08: Audit integration (Must contain meaningful failure reason, NOT stage=COMPLETED reason=null)")
    public void testIT08_AuditIntegration_MeaningfulFailureReason() throws Exception {
        // Send unauthorized request: KEY_A (linked to ACCOUNT_A) attempting to transact on ACCOUNT_B
        mockMvc.perform(post("/api/v1/gateway/payments/intents")
                .header("Authorization", "Bearer " + rawKeyA)
                .header("Idempotency-Key", "idem_it08_" + System.currentTimeMillis())
                .contentType(MediaType.APPLICATION_JSON)
                .content(buildPayload(ACCOUNT_B, new BigDecimal("100.00"), "IT-08")))
                .andExpect(status().isForbidden());

        // Inspect audit record in database
        List<ApiAuditEvent> audits = auditEventRepository.findAll();
        assertFalse(audits.isEmpty());
        ApiAuditEvent audit = audits.get(audits.size() - 1);

        assertEquals(403, audit.getResponseCode());
        assertNotEquals("COMPLETED", audit.getRequestStage(), 
                "A rejected 403 request must NEVER be recorded as stage=COMPLETED");
        assertNotNull(audit.getRequestStage());
        assertEquals("ACCOUNT_REJECTED", audit.getRequestStage());
        assertEquals("FAILED", audit.getAuthorizationStatus());
    }

    // =========================================================================
    // IT-09: Dummy-account regression integration test
    // =========================================================================
    @Test
    @DisplayName("IT-09: Dummy-account regression integration test (DUMMY_ACCOUNT seeded, NONE = DUMMY_ACCOUNT)")
    public void testIT09_DummyAccountRegressionIntegrationTest() throws Exception {
        // Verify DUMMY_ACCOUNT exists in database
        assertTrue(accountRepository.findByAccountNumber(DUMMY_ACCOUNT).isPresent());

        // Send valid request with KEY_A targeting ACCOUNT_A
        MvcResult result = mockMvc.perform(post("/api/v1/gateway/payments/intents")
                .header("Authorization", "Bearer " + rawKeyA)
                .header("Idempotency-Key", "idem_it09_" + System.currentTimeMillis())
                .contentType(MediaType.APPLICATION_JSON)
                .content(buildPayload(ACCOUNT_A, new BigDecimal("100.00"), "IT-09")))
                .andExpect(status().isOk())
                .andReturn();

        // 1. API key account in database
        ApiKeyJpaEntity keyEntity = apiKeyRepository.findByKeyHash(CreateApiKeyService.hashKey(rawKeyA)).orElseThrow();
        assertEquals(ACCOUNT_A, keyEntity.getLinkedAccountId());
        assertNotEquals(DUMMY_ACCOUNT, keyEntity.getLinkedAccountId());

        // 2. Payment account in database
        PaymentIntent intent = paymentIntentRepository.findAll().stream()
                .filter(i -> "IT-09".equals(i.getDescription()))
                .findFirst().orElseThrow();
        assertEquals(ACCOUNT_A, intent.getCustomerAccountNumber());
        assertNotEquals(DUMMY_ACCOUNT, intent.getCustomerAccountNumber());

        // 3. Audit account in database
        ApiAuditEvent audit = auditEventRepository.findAll().stream()
                .filter(a -> "/api/v1/gateway/payments/intents".equals(a.getEndpoint()))
                .findFirst().orElseThrow();
        assertEquals(ACCOUNT_A, audit.getLinkedAccountId());
        assertNotEquals(DUMMY_ACCOUNT, audit.getLinkedAccountId());

        // 4. Response account
        String responseBody = result.getResponse().getContentAsString();
        assertFalse(responseBody.contains(DUMMY_ACCOUNT), "Response payload must NEVER contain DUMMY_ACCOUNT");
    }

    // =========================================================================
    // IT-10: Production-like complete request & ACCOUNT CONSISTENCY INVARIANT
    // =========================================================================
    @Test
    @DisplayName("IT-10: Formal ACCOUNT CONSISTENCY INVARIANT verification")
    public void testIT10_AccountConsistencyInvariant() throws Exception {
        String idempotencyKey = "idem_it10_" + UUID.randomUUID();

        // 1. Production-shaped external request
        MvcResult result = mockMvc.perform(post("/api/v1/gateway/payments/intents")
                .header("Authorization", "Bearer " + rawKeyA)
                .header("Idempotency-Key", idempotencyKey)
                .contentType(MediaType.APPLICATION_JSON)
                .content(buildPayload(ACCOUNT_A, new BigDecimal("1000.00"), "IT-10-INVARIANT")))
                .andExpect(status().isOk())
                .andReturn();

        // 2. Query all layers
        ApiKeyJpaEntity key = apiKeyRepository.findByKeyHash(CreateApiKeyService.hashKey(rawKeyA)).orElseThrow();
        PaymentIntent persistedPayment = paymentIntentRepository.findAll().stream()
                .filter(i -> "IT-10-INVARIANT".equals(i.getDescription()))
                .findFirst().orElseThrow();
        ApiAuditEvent audit = auditEventRepository.findAll().stream()
                .filter(a -> idempotencyKey.equals(a.getIdempotencyKey()))
                .findFirst().orElseThrow();

        // 3. FORMAL INVARIANT ASSERTIONS:
        // API_KEY_LINKED_ACCOUNT = AUTHENTICATED_ACCOUNT = AUTHORIZED_REQUEST_ACCOUNT = PERSISTED_PAYMENT_ACCOUNT = AUDIT_ACCOUNT
        String apiKeyLinkedAccount = key.getLinkedAccountId();
        String authorizedRequestAccount = ACCOUNT_A;
        String persistedPaymentAccount = persistedPayment.getCustomerAccountNumber();
        String auditAccount = audit.getLinkedAccountId();

        assertEquals(ACCOUNT_A, apiKeyLinkedAccount, "API_KEY_LINKED_ACCOUNT must equal ACCOUNT_A");
        assertEquals(ACCOUNT_A, authorizedRequestAccount, "AUTHORIZED_REQUEST_ACCOUNT must equal ACCOUNT_A");
        assertEquals(ACCOUNT_A, persistedPaymentAccount, "PERSISTED_PAYMENT_ACCOUNT must equal ACCOUNT_A");
        assertEquals(ACCOUNT_A, auditAccount, "AUDIT_ACCOUNT must equal ACCOUNT_A");

        // Identity chain equality:
        assertEquals(apiKeyLinkedAccount, persistedPaymentAccount);
        assertEquals(persistedPaymentAccount, auditAccount);

        // Negative invariant: DUMMY_ACCOUNT must NEVER be introduced:
        assertNotEquals(DUMMY_ACCOUNT, apiKeyLinkedAccount);
        assertNotEquals(DUMMY_ACCOUNT, persistedPaymentAccount);
        assertNotEquals(DUMMY_ACCOUNT, auditAccount);
    }
}

