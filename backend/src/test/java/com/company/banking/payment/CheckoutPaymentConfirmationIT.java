package com.company.banking.payment;

import com.company.banking.account.application.port.out.AccountPersistencePort;
import com.company.banking.account.domain.Account;
import com.company.banking.common.enums.AccountStatus;
import com.company.banking.common.exception.BusinessException;
import com.company.banking.payment.application.CheckoutPaymentConfirmationService;
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
import org.springframework.test.context.bean.override.mockito.MockitoSpyBean;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;
import java.util.concurrent.CountDownLatch;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.atomic.AtomicInteger;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.doThrow;

@SpringBootTest
@ActiveProfiles("test")
public class CheckoutPaymentConfirmationIT {
    @Autowired private com.company.banking.account.infrastructure.AccountJpaRepository accountJpaRepository;
    @Autowired private com.company.banking.settlement.infrastructure.MerchantBalanceJpaRepository merchantBalanceRepository;

    @Autowired
    private CheckoutPaymentConfirmationService confirmationService;

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

    @MockitoSpyBean
    private LedgerEntryJpaRepository ledgerEntryRepository; // Spied to simulate DB failures

    private CheckoutSession activeSession;
    private PaymentIntent activeIntent;
    private PaymentAuthorization activeAuth;
    private Account customerAccount;
    private Account merchantAccount;

    @BeforeEach
    public void setup() {
        authorizationRepository.deleteAll();
        sessionRepository.deleteAll();
        intentRepository.deleteAll();
        transactionRepository.deleteAll();
        ledgerEntryRepository.deleteAll();
        merchantBalanceRepository.deleteAll();
        accountJpaRepository.deleteAll();

        // Seed Customer Account
        customerAccount = accountPersistencePort.save(Account.builder()
                .accountNumber("CUST-CONF-1001")
                .customerId(10L)
                .balance(new BigDecimal("10000.00"))
                .currency("PHP")
                .status(AccountStatus.ACTIVE)
                .build());

        // Seed Merchant Settlement Account
        merchantAccount = accountPersistencePort.save(Account.builder()
                .accountNumber("MERCHANT-SETTLEMENT-99")
                .customerId(99L)
                .balance(new BigDecimal("0.00"))
                .currency("PHP")
                .status(AccountStatus.ACTIVE)
                .build());

        // Seed AUTHORIZED Intent
        activeIntent = intentRepository.save(PaymentIntent.builder()
                .intentId("pi_" + UUID.randomUUID())
                .merchantId(99L)
                .customerAccountNumber(customerAccount.getAccountNumber())
                .amount(new BigDecimal("1000.00"))
                .currency("PHP")
                .status(PaymentIntentStatus.AUTHORIZED)
                .build());

        // Seed AUTHORIZED Session
        activeSession = sessionRepository.save(CheckoutSession.builder()
                .sessionId("cs_" + UUID.randomUUID())
                .merchantId(99L)
                .idempotencyKey("idem_confirm_123")
                .paymentIntentId(activeIntent.getIntentId())
                .amount(new BigDecimal("1000.00"))
                .currency("PHP")
                .status(CheckoutSessionStatus.AUTHORIZED)
                .successUrl("https://example.com")
                .createdAt(LocalDateTime.now())
                .expiresAt(LocalDateTime.now().plusHours(1))
                .build());

        // Seed Valid Authorization Record
        activeAuth = authorizationRepository.save(PaymentAuthorization.builder()
                .authorizationReference("auth_" + UUID.randomUUID())
                .checkoutSessionId(activeSession.getSessionId())
                .paymentIntentId(activeIntent.getIntentId())
                .customerAccountNumber(customerAccount.getAccountNumber())
                .merchantId(99L)
                .amount(new BigDecimal("1000.00"))
                .currency("PHP")
                .status(PaymentAuthorizationStatus.AUTHORIZED)
                .authorizedAt(LocalDateTime.now())
                .expiresAt(LocalDateTime.now().plusDays(1))
                .build());
    }

    @Test
    public void authorizedCheckout_ShouldCaptureAndBecomePaid() {
        long initialTxCount = transactionRepository.count();
        long initialLedgerCount = ledgerEntryRepository.count();

        confirmationService.confirmCheckout(activeSession.getSessionId());

        // 1. Session and Intent advanced to terminal success state
        assertEquals(CheckoutSessionStatus.PAID, sessionRepository.findById(activeSession.getId()).get().getStatus());
        assertEquals(PaymentIntentStatus.CAPTURED, intentRepository.findById(activeIntent.getId()).get().getStatus());

        // 2. Financial Execution occurred exactly once
        Account updatedCustomer = accountPersistencePort.findByAccountNumber(customerAccount.getAccountNumber()).orElseThrow();
        assertEquals(0, new BigDecimal("9000.00").compareTo(updatedCustomer.getBalance()));
        
        Account updatedMerchant = accountPersistencePort.findByAccountNumber(merchantAccount.getAccountNumber()).orElseThrow();
        assertEquals(0, new BigDecimal("1000.00").compareTo(updatedMerchant.getBalance()));

        // 3. Exactly 1 Tx and 2 Ledger Entries added
        assertEquals(initialTxCount + 1, transactionRepository.count());
        assertEquals(initialLedgerCount + 2, ledgerEntryRepository.count());
    }

    @Test
    public void alreadyCapturedCheckout_ShouldBeIdempotent() {
        // Run once
        confirmationService.confirmCheckout(activeSession.getSessionId());

        // Save Tx count after first run
        long txCountAfterFirst = transactionRepository.count();

        // Run second time (Simulate rapid double click)
        confirmationService.confirmCheckout(activeSession.getSessionId());

        // Ensure no new transactions or deductions occurred
        assertEquals(txCountAfterFirst, transactionRepository.count());
        Account updatedCustomer = accountPersistencePort.findByAccountNumber(customerAccount.getAccountNumber()).orElseThrow();
        assertEquals(0, new BigDecimal("9000.00").compareTo(updatedCustomer.getBalance()));
    }

    @Test
    public void concurrentConfirmation_ShouldCreateExactlyOneFinancialEffect() throws InterruptedException {
        int threads = 20;
        ExecutorService executor = Executors.newFixedThreadPool(threads);
        CountDownLatch startLatch = new CountDownLatch(1);
        CountDownLatch doneLatch = new CountDownLatch(threads);
        AtomicInteger successCount = new AtomicInteger(0);

        for (int i = 0; i < threads; i++) {
            executor.submit(() -> {
                try {
                    startLatch.await();
                    // All threads try to confirm and capture simultaneously
                    confirmationService.confirmCheckout(activeSession.getSessionId());
                    successCount.incrementAndGet();
                } catch (Exception ignored) {
                } finally {
                    doneLatch.countDown();
                }
            });
        }

        startLatch.countDown();
        doneLatch.await();

        // 1. Due to idempotency checks and DB locking, all threads might cleanly return a response
        // but the core financial effect MUST happen exactly once.
        assertEquals(1, transactionRepository.count(), "Only ONE transaction must be recorded.");
        assertEquals(2, ledgerEntryRepository.count(), "Only TWO ledger entries must be recorded.");
        
        Account updatedCustomer = accountPersistencePort.findByAccountNumber(customerAccount.getAccountNumber()).orElseThrow();
        assertEquals(0, new BigDecimal("9000.00").compareTo(updatedCustomer.getBalance()), "Customer balance deducted EXACTLY once.");
    }

    @Test
    public void amountMismatch_ShouldRefuseToExecute() {
        // Attack: DB Tampering. Session = 1000, Intent = 1500
        activeIntent.setAmount(new BigDecimal("1500.00"));
        intentRepository.save(activeIntent);

        BusinessException ex = assertThrows(BusinessException.class, () -> {
            confirmationService.confirmCheckout(activeSession.getSessionId());
        });

        assertTrue(ex.getMessage().contains("Amount mismatch"));
        assertEquals(0, transactionRepository.count(), "Refused capture must not create transactions.");
    }

    @Test
    public void captureFailure_ShouldRollbackAndLeaveSessionAuthorized() {
        // Sabotage the internal engine by making the ledger save fail
        doThrow(new RuntimeException("Simulated Database Crash"))
            .when(ledgerEntryRepository).saveAll(any());

        assertThrows(RuntimeException.class, () -> {
            confirmationService.confirmCheckout(activeSession.getSessionId());
        });

        // 1. Rollback validation
        Account unchangedCustomer = accountPersistencePort.findByAccountNumber(customerAccount.getAccountNumber()).orElseThrow();
        assertEquals(0, new BigDecimal("10000.00").compareTo(unchangedCustomer.getBalance()), "Customer balance MUST NOT drop.");

        // 2. State machine remains authorized so the user can attempt a retry if network dropped
        assertEquals(CheckoutSessionStatus.AUTHORIZED, sessionRepository.findById(activeSession.getId()).get().getStatus());
        assertEquals(PaymentIntentStatus.AUTHORIZED, intentRepository.findById(activeIntent.getId()).get().getStatus());
        
        assertEquals(0, transactionRepository.count(), "Transactions must be rolled back.");
    }
}
