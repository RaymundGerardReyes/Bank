package com.company.banking.payment;

import com.company.banking.account.application.port.out.AccountPersistencePort;
import com.company.banking.account.domain.Account;
import com.company.banking.common.enums.AccountStatus;
import com.company.banking.payment.domain.CheckoutSession;
import com.company.banking.payment.domain.CheckoutSessionStatus;
import com.company.banking.payment.domain.DynamicQrPayment;
import com.company.banking.payment.domain.PaymentIntent;
import com.company.banking.payment.domain.PaymentIntentStatus;
import com.company.banking.payment.infrastructure.CheckoutSessionJpaRepository;
import com.company.banking.payment.infrastructure.DynamicQrPaymentJpaRepository;
import com.company.banking.payment.infrastructure.PaymentIntentJpaRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
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

import static org.hamcrest.Matchers.hasItem;
import static org.junit.jupiter.api.Assertions.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
public class CheckoutQrPaymentPathIT {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private CheckoutSessionJpaRepository sessionRepository;

    @Autowired
    private PaymentIntentJpaRepository intentRepository;

    @Autowired
    private DynamicQrPaymentJpaRepository qrRepository;

    @Autowired
    private AccountPersistencePort accountPersistencePort;

    @Autowired
    private ObjectMapper objectMapper;

    private final Long MERCHANT_ID = 101L;
    private CheckoutSession activeSession;
    private PaymentIntent activeIntent;
    private Account merchantSettlementAccount;

    @BeforeEach
    public void setup() {
        qrRepository.deleteAll();
        sessionRepository.deleteAll();

        String intentId = "pi_qr_test_" + UUID.randomUUID().toString().substring(0, 8);
        activeIntent = intentRepository.save(PaymentIntent.builder()
                .intentId(intentId)
                .merchantId(MERCHANT_ID)
                .customerAccountNumber("PENDING_CHECKOUT")
                .amount(new BigDecimal("1250.00"))
                .currency("PHP")
                .status(PaymentIntentStatus.CREATED)
                .description("Checkout for QR Ph Order")
                .idempotencyKey("idem_" + UUID.randomUUID())
                .build());

        String sessionId = "cs_qr_test_" + UUID.randomUUID().toString().substring(0, 8);
        activeSession = sessionRepository.save(CheckoutSession.builder()
                .sessionId(sessionId)
                .merchantId(MERCHANT_ID)
                .idempotencyKey("idem_session_" + UUID.randomUUID())
                .paymentIntentId(intentId)
                .amount(new BigDecimal("1250.00"))
                .currency("PHP")
                .description("Checkout for QR Ph Order")
                .status(CheckoutSessionStatus.ACTIVE)
                .successUrl("https://merchant.example.com/success")
                .cancelUrl("https://merchant.example.com/cancel")
                .createdAt(LocalDateTime.now())
                .expiresAt(LocalDateTime.now().plusHours(1))
                .build());

        String settlementAccNum = "MERCHANT-SETTLEMENT-" + MERCHANT_ID;
        merchantSettlementAccount = accountPersistencePort.findByAccountNumber(settlementAccNum)
                .orElseGet(() -> accountPersistencePort.save(Account.builder()
                        .accountNumber(settlementAccNum)
                        .balance(BigDecimal.ZERO)
                        .currency("PHP")
                        .status(AccountStatus.ACTIVE)
                        .build()));
    }

    @Test
    @DisplayName("Path 1: Select QR_PH transitions session to PAYMENT_PENDING and generates Dynamic QR")
    public void path1_SelectQrPhAndVerifyStateAndDynamicGeneration() throws Exception {
        String payload = "{\"paymentMethod\": \"QR_PH\"}";

        mockMvc.perform(post("/api/v1/checkout/sessions/" + activeSession.getSessionId() + "/payment-method")
                .contentType(MediaType.APPLICATION_JSON)
                .content(payload))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.status").value("PAYMENT_PENDING"));

        CheckoutSession updatedSession = sessionRepository.findBySessionId(activeSession.getSessionId()).orElseThrow();
        assertEquals(CheckoutSessionStatus.PAYMENT_PENDING, updatedSession.getStatus());
        assertEquals("QR_PH", updatedSession.getSelectedPaymentMethod());

        DynamicQrPayment qrPayment = qrRepository.findByPaymentIntentId(activeIntent.getId()).orElse(null);
        assertNotNull(qrPayment, "Dynamic QR payment record must be created");
        assertEquals("ACTIVE", qrPayment.getStatus());
        assertTrue(qrPayment.getQrReference().startsWith("QR-"));
    }

    @Test
    @DisplayName("Path 2: Public session read exposes QR_PH in paymentMethods and includes QR reference and payload")
    public void path2_PublicSessionReadExposesQrPhAndSafePayload() throws Exception {
        // First select QR_PH
        mockMvc.perform(post("/api/v1/checkout/sessions/" + activeSession.getSessionId() + "/payment-method")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"paymentMethod\": \"QR_PH\"}"))
                .andExpect(status().isOk());

        DynamicQrPayment qr = qrRepository.findByPaymentIntentId(activeIntent.getId()).orElseThrow();

        // Now read public session
        mockMvc.perform(get("/api/v1/checkout/sessions/" + activeSession.getSessionId())
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.status").value("PAYMENT_PENDING"))
                .andExpect(jsonPath("$.data.selectedPaymentMethod").value("QR_PH"))
                .andExpect(jsonPath("$.data.paymentMethods", hasItem("QR_PH")))
                .andExpect(jsonPath("$.data.paymentMethods", hasItem("INTERNAL_ACCOUNT")))
                .andExpect(jsonPath("$.data.qrReference").value(qr.getQrReference()))
                .andExpect(jsonPath("$.data.qrPayload").value(qr.getQrPayload()))
                // Assert zero-trust: no internal IDs exposed
                .andExpect(jsonPath("$.data.merchantId").doesNotExist())
                .andExpect(jsonPath("$.data.paymentIntentId").doesNotExist());
    }

    @Test
    @DisplayName("Path 3: Customer scans dynamic QR code via banking app")
    public void path3_CustomerScansQrCode() throws Exception {
        // Select QR_PH
        mockMvc.perform(post("/api/v1/checkout/sessions/" + activeSession.getSessionId() + "/payment-method")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"paymentMethod\": \"QR_PH\"}"))
                .andExpect(status().isOk());

        DynamicQrPayment qr = qrRepository.findByPaymentIntentId(activeIntent.getId()).orElseThrow();

        // Mock customer scanning the QR code via banking app switch
        mockMvc.perform(post("/api/v1/gateway/payment-intents/qr/" + qr.getQrReference() + "/scan")
                .header("X-API-Key", "sk_test_2026_university_erp_sandbox_key")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("PENDING"));

        DynamicQrPayment scannedQr = qrRepository.findById(qr.getId()).orElseThrow();
        assertEquals("SCANNED", scannedQr.getStatus());
        assertNotNull(scannedQr.getScannedAt());
    }

    @Test
    @DisplayName("Path 4: Full QR payment confirmation and double-entry settlement")
    public void path4_ConfirmQrPaymentWithDoubleEntryLedgerParity() throws Exception {
        BigDecimal initialBalance = accountPersistencePort.findByAccountNumber(merchantSettlementAccount.getAccountNumber())
                .map(Account::getBalance).orElse(BigDecimal.ZERO);

        // 1. Select QR_PH
        mockMvc.perform(post("/api/v1/checkout/sessions/" + activeSession.getSessionId() + "/payment-method")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"paymentMethod\": \"QR_PH\"}"))
                .andExpect(status().isOk());

        // 2. Confirm and Capture
        mockMvc.perform(post("/api/v1/checkout/sessions/" + activeSession.getSessionId() + "/confirm")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.status").value("PAID"));

        // 3. Verify session and intent are terminal PAID / SUCCESS
        CheckoutSession paidSession = sessionRepository.findBySessionId(activeSession.getSessionId()).orElseThrow();
        assertEquals(CheckoutSessionStatus.PAID, paidSession.getStatus());

        PaymentIntent paidIntent = intentRepository.findByIntentId(activeIntent.getIntentId()).orElseThrow();
        assertEquals(PaymentIntentStatus.SUCCESS, paidIntent.getStatus());

        DynamicQrPayment paidQr = qrRepository.findByPaymentIntentId(activeIntent.getId()).orElseThrow();
        assertEquals("PAID", paidQr.getStatus());

        // 4. Verify Merchant Settlement Account credited with exactly 1250.00
        Account updatedSettlement = accountPersistencePort.findByAccountNumber(merchantSettlementAccount.getAccountNumber()).orElseThrow();
        assertEquals(0, updatedSettlement.getBalance().compareTo(initialBalance.add(new BigDecimal("1250.00"))));
    }

    @Test
    @DisplayName("Path 5: Expired session strictly rejects QR selection")
    public void path5_ExpiredSessionRejection() throws Exception {
        activeSession.setExpiresAt(LocalDateTime.now().minusMinutes(10));
        sessionRepository.save(activeSession);

        mockMvc.perform(post("/api/v1/checkout/sessions/" + activeSession.getSessionId() + "/payment-method")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"paymentMethod\": \"QR_PH\"}"))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message").value("This checkout session has expired."));

        // Public session endpoint strictly surfaces the expired state and locked flag
        mockMvc.perform(get("/api/v1/checkout/sessions/" + activeSession.getSessionId())
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.status").value("EXPIRED"))
                .andExpect(jsonPath("$.data.locked").value(true));
    }

    @Test
    @DisplayName("Path 6: Simulate QR payment endpoint captures payment successfully")
    public void path6_SimulateQrPaymentEndpoint() throws Exception {
        // 1. Select QR_PH
        mockMvc.perform(post("/api/v1/checkout/sessions/" + activeSession.getSessionId() + "/payment-method")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"paymentMethod\": \"QR_PH\"}"))
                .andExpect(status().isOk());

        // 2. Call simulation endpoint
        mockMvc.perform(post("/api/v1/checkout/sessions/" + activeSession.getSessionId() + "/qr/simulate-pay")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.status").value("PAID"));
    }
}

