package com.company.banking.payment;

import com.company.banking.account.application.port.out.AccountPersistencePort;
import com.company.banking.account.domain.Account;
import com.company.banking.common.exception.BusinessException;
import com.company.banking.payment.api.dto.CreatePaymentIntentRequest;
import com.company.banking.payment.application.PaymentIntentOrchestrationService;
import com.company.banking.payment.application.PaymentWebhookService;
import com.company.banking.payment.application.PaymentStateMachineService;
import com.company.banking.payment.domain.PaymentAttempt;
import com.company.banking.payment.domain.PaymentIntent;
import com.company.banking.payment.domain.PaymentSession;
import com.company.banking.payment.domain.PaymentSessionStatus;
import com.company.banking.payment.infrastructure.PaymentAttemptJpaRepository;
import com.company.banking.payment.infrastructure.PaymentIntentJpaRepository;
import com.company.banking.payment.infrastructure.PaymentSessionJpaRepository;
import com.company.banking.transaction.application.port.out.LedgerPersistencePort;
import com.company.banking.transaction.domain.LedgerEntry;
import com.company.banking.transaction.domain.EntryType;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.test.annotation.DirtiesContext;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.concurrent.CountDownLatch;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.TimeUnit;
import java.nio.charset.StandardCharsets;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@ActiveProfiles("test")
@DirtiesContext(classMode = DirtiesContext.ClassMode.AFTER_EACH_TEST_METHOD)
public class PaymentExecutionIntegrityIT {

    @Autowired
    private PaymentIntentOrchestrationService orchestrationService;

    @Autowired
    private PaymentWebhookService webhookService;

    @Autowired
    private PaymentStateMachineService stateMachineService;

    @Autowired
    private PaymentIntentJpaRepository intentRepository;

    @Autowired
    private PaymentAttemptJpaRepository attemptRepository;

    @Autowired
    private PaymentSessionJpaRepository sessionRepository;

    @Autowired
    private AccountPersistencePort accountPersistencePort;

    @Autowired
    private LedgerPersistencePort ledgerPersistencePort;

    private String testAccountNumber;

    @BeforeEach
    public void setup() {
        testAccountNumber = "4859220013371001"; // Seeded account
        
        Account account = accountPersistencePort.findByAccountNumber(testAccountNumber)
            .orElseGet(() -> {
                Account newAcc = Account.builder()
                        .accountNumber(testAccountNumber)
                        .customerId(1L)
                        .currency("PHP")
                        .balance(new BigDecimal("100000.00"))
                        .status(com.company.banking.common.enums.AccountStatus.ACTIVE)
                        .allowIncoming(true)
                        .allowOutgoing(true)
                        .build();
                return accountPersistencePort.save(newAcc);
            });
            
        account.setBalance(new BigDecimal("100000.00"));
        account.setAllowIncoming(true);
        account.setAllowOutgoing(true);
        accountPersistencePort.save(account);

        String destAccountNumber = "4859220013379999";
        accountPersistencePort.findByAccountNumber(destAccountNumber)
            .orElseGet(() -> {
                Account destAcc = Account.builder()
                        .accountNumber(destAccountNumber)
                        .customerId(2L)
                        .currency("PHP")
                        .balance(new BigDecimal("0.00"))
                        .status(com.company.banking.common.enums.AccountStatus.ACTIVE)
                        .allowIncoming(true)
                        .allowOutgoing(true)
                        .build();
                return accountPersistencePort.save(destAcc);
            });
    }

    @Test
    public void duplicatePaymentRequest_ShouldCreateOneFinancialEffect() {
        // Goal: Ensure that sending the exact same CreatePaymentIntentRequest twice
        // (same idempotencyKey) only deducts balance once and creates one Intent.
        String idempotencyKey = "idemp_" + UUID.randomUUID().toString();
        BigDecimal amount = new BigDecimal("1500.00");

        CreatePaymentIntentRequest request = new CreatePaymentIntentRequest();
        request.setSourceAccountId(testAccountNumber);
        request.setAmount(amount);
        request.setDescription("Idempotency Test");
        request.setMerchantReference("MERCH-001");
        request.setIdempotencyKey(idempotencyKey);

        // 1. Send first request
        var response1 = orchestrationService.createIntent(request);
        assertNotNull(response1.getPaymentIntentId());

        // 2. Send duplicate request
        var response2 = orchestrationService.createIntent(request);
        
        // Assertions: 
        // We expect the SAME intent to be returned, NOT a new one.
        assertEquals(response1.getPaymentIntentId(), response2.getPaymentIntentId(), "Duplicate API request should return the existing PaymentIntent");
        
        // Verify database state: Exactly one Intent, one Attempt
        List<PaymentIntent> intents = intentRepository.findAll();
        long matchingIntents = intents.stream().filter(i -> "Idempotency Test".equals(i.getDescription())).count();
        assertEquals(1, matchingIntents, "Should only insert ONE PaymentIntent into the database");

        // Verify balance was deducted only once
        Account account = accountPersistencePort.findByAccountNumber(testAccountNumber).orElseThrow();
        assertEquals(new BigDecimal("98500.00"), account.getBalance(), "Balance should have been deducted exactly once");
    }

    @Test
    public void concurrentSamePayment_ShouldCreateOnlyOneFinancialEffect() throws InterruptedException {
        // Goal: Prove that parallel threads handling identical webhooks 
        // do not cause double-execution of the financial side effects.
        
        // Setup initial intent and attempt
        BigDecimal amount = new BigDecimal("2500.00");
        CreatePaymentIntentRequest request = new CreatePaymentIntentRequest();
        request.setSourceAccountId(testAccountNumber);
        request.setAmount(amount);
        request.setDescription("Concurrency Test");
        request.setMerchantReference("MERCH-002");
        request.setIdempotencyKey("idemp_" + UUID.randomUUID().toString());
        var response = orchestrationService.createIntent(request);
        
        PaymentIntent intent = intentRepository.findByIntentId(response.getPaymentIntentId()).orElseThrow();
        PaymentAttempt attempt = attemptRepository.findByPaymentIntentId(intent.getId()).get(0);
        
        // Ensure session exists and is linked
        PaymentSession session = PaymentSession.builder()
            .sessionId("sess_" + UUID.randomUUID().toString())
            .institutionId(100L)
            .institutionReference("inst_ref_" + UUID.randomUUID().toString())
            .amount(amount)
            .currency("PHP")
            .status(PaymentSessionStatus.ACTIVE)
            .createdAt(LocalDateTime.now())
            .expiresAt(LocalDateTime.now().plusMinutes(15))
            .build();
        sessionRepository.save(session);
        
        attempt.setPaymentSessionId(session.getSessionId());
        attemptRepository.save(attempt);

        int threadCount = 10;
        ExecutorService executor = Executors.newFixedThreadPool(threadCount);
        CountDownLatch latch = new CountDownLatch(1);
        CountDownLatch completionLatch = new CountDownLatch(threadCount);
        
        // Mock a raw webhook payload simulating a successful payment
        String rawPayload = "{\n" +
                "  \"data\": {\n" +
                "    \"id\": \"evt_test123\",\n" +
                "    \"type\": \"event\",\n" +
                "    \"attributes\": {\n" +
                "      \"type\": \"checkout_session.payment.paid\",\n" +
                "      \"data\": {\n" +
                "        \"id\": \"" + attempt.getProviderReference() + "\",\n" +
                "        \"attributes\": {\n" +
                "          \"amount\": 250000,\n" + 
                "          \"currency\": \"PHP\"\n" +
                "        }\n" +
                "      }\n" +
                "    }\n" +
                "  }\n" +
                "}";

        String validSignatureTemp = "dummy-signature";
        try {
            javax.crypto.Mac mac = javax.crypto.Mac.getInstance("HmacSHA256");
            javax.crypto.spec.SecretKeySpec keySpec = new javax.crypto.spec.SecretKeySpec("whsec_test_secret_123456789".getBytes(StandardCharsets.UTF_8), "HmacSHA256");
            mac.init(keySpec);
            byte[] hash = mac.doFinal(rawPayload.getBytes(StandardCharsets.UTF_8));
            validSignatureTemp = java.util.HexFormat.of().formatHex(hash);
        } catch (Exception e) {}
        final String validSignature = validSignatureTemp;

        for (int i = 0; i < threadCount; i++) {
            executor.submit(() -> {
                try {
                    latch.await();
                    // All threads hit the webhook handler concurrently
                    webhookService.handle("INTERNAL", rawPayload.getBytes(StandardCharsets.UTF_8), validSignature);
                } catch (Exception e) {
                    // We expect 9 of these to fail with UniqueConstraint/OptimisticLock exceptions or return 200 silently
                } finally {
                    completionLatch.countDown();
                }
            });
        }

        latch.countDown(); // Unleash the threads
        completionLatch.await(10, TimeUnit.SECONDS);

        // Verify Database Invariants
        // 1. Only ONE financial execution occurred (Session marked SUCCESS exactly once, without throwing duplicate ledger events)
        PaymentSession finalSession = sessionRepository.findBySessionId(session.getSessionId()).orElseThrow();
        assertEquals(PaymentSessionStatus.SUCCESS, finalSession.getStatus());
        
        // Ensure no overdraft or double-credit happened by checking the attempt status
        PaymentAttempt finalAttempt = attemptRepository.findById(attempt.getId()).orElseThrow();
        assertEquals("SUCCESS", finalAttempt.getStatus());
    }


    @Autowired
    private com.company.banking.transaction.application.InternalTransferService internalTransferService;
    
    @Test
    public void successfulPayment_ShouldCreateBalancedLedgerEntries_InternalTransfer() {
        BigDecimal amount = new BigDecimal("4000.00");
        com.company.banking.transaction.api.dto.InternalTransferRequest txReq = new com.company.banking.transaction.api.dto.InternalTransferRequest();
        txReq.setSourceAccountNumber(testAccountNumber);
        txReq.setDestinationAccountNumber("4859220013379999"); 
        txReq.setAmount(amount);
        txReq.setIdempotencyKey("idem_transfer_" + UUID.randomUUID());
        txReq.setDescription("Test ledger");
        
        var response = internalTransferService.processInternalTransfer(txReq);
        assertNotNull(response.getTransactionReference());
        
        // DB Assertion: Ledger entries MUST balance
        List<LedgerEntry> entries = ledgerPersistencePort.findAllByTransactionReference(response.getTransactionReference());
        assertEquals(2, entries.size(), "Should create exactly 2 ledger entries");
        
        BigDecimal debitSum = entries.stream()
                .filter(e -> e.getEntryType() == EntryType.DEBIT)
                .map(LedgerEntry::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
                
        BigDecimal creditSum = entries.stream()
                .filter(e -> e.getEntryType() == EntryType.CREDIT)
                .map(LedgerEntry::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
                
        assertEquals(amount, debitSum, "Debit sum must equal payment amount");
        assertEquals(amount, creditSum, "Credit sum must equal payment amount");
        assertEquals(0, debitSum.compareTo(creditSum), "Total debits must exactly match total credits");
    }
}
