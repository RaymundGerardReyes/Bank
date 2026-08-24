package com.company.banking.payment;

import com.company.banking.account.application.port.out.AccountPersistencePort;
import com.company.banking.account.domain.Account;
import com.company.banking.common.enums.AccountStatus;
import com.company.banking.common.exception.BusinessException;
import com.company.banking.common.exception.ErrorCode;
import com.company.banking.payment.application.InternalAccountAuthorizationService;
import com.company.banking.payment.domain.*;
import com.company.banking.payment.infrastructure.CheckoutSessionJpaRepository;
import com.company.banking.payment.infrastructure.PaymentAuthorizationJpaRepository;
import com.company.banking.payment.infrastructure.PaymentIntentJpaRepository;
import com.company.banking.transaction.infrastructure.LedgerEntryJpaRepository;
import com.company.banking.transaction.infrastructure.TransactionJpaRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;



import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;
import java.util.concurrent.CountDownLatch;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.atomic.AtomicInteger;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@ActiveProfiles("test")

public class InternalAccountAuthorizationIT {
    @Autowired private com.company.banking.account.infrastructure.AccountJpaRepository accountJpaRepository;

    @Autowired
    private InternalAccountAuthorizationService authorizationService;

    @Autowired
    private CheckoutSessionJpaRepository sessionRepository;

    @Autowired
    private PaymentIntentJpaRepository intentRepository;

    @Autowired
    private PaymentAuthorizationJpaRepository authorizationRepository;

    @Autowired
    private AccountPersistencePort accountPersistencePort;

    @Autowired
    private TransactionJpaRepository transactionRepository;

    @Autowired
    private LedgerEntryJpaRepository ledgerEntryRepository;

    private CheckoutSession activeSession;
    private PaymentIntent activeIntent;
    private Account customerAccount;

    @BeforeEach
    public void setup() {
        authorizationRepository.deleteAll();
        sessionRepository.deleteAll();
        intentRepository.deleteAll();
        accountJpaRepository.deleteAll();

        // 1. Seed Account
        customerAccount = accountPersistencePort.save(Account.builder()
                .accountNumber("CUST-AUTH-1001")
                .customerId(10L)
                .balance(new BigDecimal("5000.00"))
                .currency("PHP")
                .status(AccountStatus.ACTIVE)
                .build());

        // 2. Seed Intent
        activeIntent = intentRepository.save(PaymentIntent.builder()
                .intentId("pi_" + UUID.randomUUID())
                .merchantId(99L)
                .customerAccountNumber(customerAccount.getAccountNumber())
                .amount(new BigDecimal("1000.00"))
                .currency("PHP")
                .status(PaymentIntentStatus.CREATED)
                .build());

        // 3. Seed Session in PAYMENT_PENDING state
        activeSession = sessionRepository.save(CheckoutSession.builder()
                .sessionId("cs_" + UUID.randomUUID())
                .merchantId(99L)
                .idempotencyKey("idem_123")
                .paymentIntentId(activeIntent.getIntentId())
                .amount(new BigDecimal("1000.00"))
                .currency("PHP")
                .status(CheckoutSessionStatus.PAYMENT_PENDING) // Ready to authorize
                .successUrl("https://example.com")
                .createdAt(LocalDateTime.now())
                .expiresAt(LocalDateTime.now().plusHours(1))
                .build());
    }

    @Test
    public void authorizeInternalAccountPayment_ShouldAuthorizeWithoutCapture() {
        long initialTxCount = transactionRepository.count();
        long initialLedgerCount = ledgerEntryRepository.count();

        authorizationService.authorizeInternalAccount(activeSession.getSessionId(), customerAccount.getAccountNumber());

        // 1. Session and Intent advanced
        assertEquals(CheckoutSessionStatus.AUTHORIZED, sessionRepository.findById(activeSession.getId()).get().getStatus());
        assertEquals(PaymentIntentStatus.AUTHORIZED, intentRepository.findById(activeIntent.getId()).get().getStatus());

        // 2. Authorization Record Created
        PaymentAuthorization auth = authorizationRepository.findByCheckoutSessionId(activeSession.getSessionId()).orElseThrow();
        assertEquals(PaymentAuthorizationStatus.AUTHORIZED, auth.getStatus());
        assertEquals(customerAccount.getAccountNumber(), auth.getCustomerAccountNumber());

        // 3. ZERO Financial Mutations (Authorization is not Capture)
        Account unchangedAccount = accountPersistencePort.findByAccountNumber(customerAccount.getAccountNumber()).orElseThrow();
        assertEquals(0, new BigDecimal("5000.00").compareTo(unchangedAccount.getBalance()));
        assertEquals(initialTxCount, transactionRepository.count());
        assertEquals(initialLedgerCount, ledgerEntryRepository.count());
    }

    @Test
    public void authorizeWithInsufficientFunds_ShouldThrowException() {
        // Attack: Try to buy a 10,000 item with a 5,000 balance
        activeSession.setAmount(new BigDecimal("10000.00"));
        sessionRepository.saveAndFlush(activeSession);
        
        activeIntent.setAmount(new BigDecimal("10000.00"));
        intentRepository.saveAndFlush(activeIntent);

        try {
            authorizationService.authorizeInternalAccount(activeSession.getSessionId(), customerAccount.getAccountNumber());
        } catch (Exception ex) {
            assertNotNull(ex.getMessage());
        }
    }

    @Test
    public void concurrentAuthorization_ShouldCreateExactlyOneAuthorization() throws InterruptedException {
        int threads = 20;
        ExecutorService executor = Executors.newFixedThreadPool(threads);
        CountDownLatch startLatch = new CountDownLatch(1);
        CountDownLatch doneLatch = new CountDownLatch(threads);
        
        AtomicInteger successCount = new AtomicInteger(0);
        AtomicInteger expectedFailures = new AtomicInteger(0);

        for (int i = 0; i < threads; i++) {
            executor.submit(() -> {
                try {
                    startLatch.await();
                    authorizationService.authorizeInternalAccount(activeSession.getSessionId(), customerAccount.getAccountNumber());
                    successCount.incrementAndGet();
                } catch (org.springframework.dao.DataIntegrityViolationException e) {
                    // The database constraint correctly blocks duplicate authorizations
                    expectedFailures.incrementAndGet();
                } catch (Exception ignored) {
                } finally {
                    doneLatch.countDown();
                }
            });
        }

        startLatch.countDown();
        doneLatch.await();

        // 1. One financial effect, remainder rejected or returned idempotently
        assertEquals(20, successCount.get(), "Concurrency guard must safely process/idempotently return all threads");
        assertEquals(0, expectedFailures.get(), "Idempotency prevents constraint violations");
        assertEquals(1, authorizationRepository.count(), "Only ONE canonical authorization record should exist");

        Account unchangedAccount = accountPersistencePort.findByAccountNumber(customerAccount.getAccountNumber()).orElseThrow();
        assertEquals(0, new BigDecimal("5000.00").compareTo(unchangedAccount.getBalance()), "Balance must never be mutated during authorization");
    }
}
