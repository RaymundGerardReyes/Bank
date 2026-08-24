package com.company.banking.payment;

import com.company.banking.account.application.port.out.AccountPersistencePort;
import com.company.banking.account.domain.Account;
import com.company.banking.common.enums.AccountStatus;
import com.company.banking.common.exception.BusinessException;
import com.company.banking.common.exception.ConflictException;
import com.company.banking.payment.application.InternalPaymentExecutionService;
import com.company.banking.payment.domain.PaymentIntent;
import com.company.banking.payment.domain.PaymentIntentStatus;
import com.company.banking.payment.infrastructure.PaymentIntentJpaRepository;
import com.company.banking.transaction.application.port.out.LedgerPersistencePort;
import com.company.banking.transaction.infrastructure.TransactionJpaRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import com.company.banking.config.LedgerSpyIntegrationTest;


import java.math.BigDecimal;
import java.util.UUID;
import java.util.concurrent.CountDownLatch;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.atomic.AtomicInteger;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.doThrow;

public class InternalPaymentGatewayIT extends LedgerSpyIntegrationTest {
    @Autowired private com.company.banking.account.infrastructure.AccountJpaRepository accountJpaRepository;

    @Autowired
    private InternalPaymentExecutionService executionService;

    @Autowired
    private PaymentIntentJpaRepository intentRepository;

    @Autowired
    private AccountPersistencePort accountPersistencePort;

    @Autowired
    private TransactionJpaRepository transactionJpaRepository;
    
    @Autowired
    private com.company.banking.payment.infrastructure.RefundJpaRepository refundRepository;
    

    private Account testAccount;
    private PaymentIntent testIntent;

    @BeforeEach
    public void setup() {
        // Clear state to avoid data contamination between tests (handled by TestDatabaseCleaner)

        accountPersistencePort.findByAccountNumber("MERCHANT-SETTLEMENT-99")
                .map(acc -> {
                    acc.setBalance(new BigDecimal("0.00"));
                    return accountPersistencePort.save(acc);
                })
                .orElseGet(() -> accountPersistencePort.save(Account.builder().accountNumber("MERCHANT-SETTLEMENT-99").customerId(99L).balance(new BigDecimal("0.00")).currency("PHP").status(AccountStatus.ACTIVE).allowOutgoing(true).allowIncoming(true).build()));
        
        // Setup Account
        testAccount = Account.builder()
                .accountNumber("INT-1001-" + UUID.randomUUID().toString().substring(0,5))
                .customerId(1L)
                .balance(new BigDecimal("10000.00"))
                .currency("PHP")
                .status(AccountStatus.ACTIVE)
                .allowOutgoing(true)
                .build();
        testAccount = accountPersistencePort.save(testAccount);

        // Setup Intent
        testIntent = PaymentIntent.builder()
                .intentId("PI-" + UUID.randomUUID())
                .merchantId(99L)
                .customerAccountNumber(testAccount.getAccountNumber())
                .amount(new BigDecimal("1500.00"))
                .currency("PHP")
                .status(PaymentIntentStatus.AUTHORIZED) 
                .build();
        testIntent = intentRepository.save(testIntent);
    }

    @Test
    public void successfulCapture_ShouldHaveBalancedLedgerEntries() {
        String captureKey = "cap_" + UUID.randomUUID();

        executionService.capturePayment(testIntent.getIntentId(), 99L, captureKey);

        Account updated = accountPersistencePort.findByAccountNumber(testAccount.getAccountNumber()).orElseThrow();
        assertEquals(0, new BigDecimal("8500.00").compareTo(updated.getBalance()));

        PaymentIntent intent = intentRepository.findByIntentId(testIntent.getIntentId()).orElseThrow();
        assertEquals(PaymentIntentStatus.CAPTURED, intent.getStatus());
        
        long txCount = transactionJpaRepository.count();
        assertEquals(1, txCount);
    }

    @Test
    public void captureExceedingAvailableBalance_ShouldFailWithoutFinancialEffects() {
        String captureKey = "cap_" + UUID.randomUUID();
        
        // Attempt to capture more than the account has
        testIntent.setAmount(new BigDecimal("20000.00"));
        intentRepository.save(testIntent);

        BusinessException exception = assertThrows(BusinessException.class, () -> {
            executionService.capturePayment(testIntent.getIntentId(), 99L, captureKey);
        });

        assertTrue(exception.getMessage().contains("Insufficient funds"));

        // Verify Rollback / Unchanged state
        Account unchangedAccount = accountPersistencePort.findByAccountNumber(testAccount.getAccountNumber()).orElseThrow();
        assertEquals(0, new BigDecimal("10000.00").compareTo(unchangedAccount.getBalance()));
        
        PaymentIntent unchangedIntent = intentRepository.findByIntentId(testIntent.getIntentId()).orElseThrow();
        assertEquals(PaymentIntentStatus.AUTHORIZED, unchangedIntent.getStatus());
    }

    @Test
    public void captureFailure_ShouldRollbackAllFinancialEffects() {
        String captureKey = "cap_" + UUID.randomUUID();

        // Spy on the ledger port to throw an error exactly during the ledger writing phase
        doThrow(new RuntimeException("Simulated Database Outage"))
            .when(ledgerPersistencePort).saveLedgerEntries(any());

        assertThrows(RuntimeException.class, () -> {
            executionService.capturePayment(testIntent.getIntentId(), 99L, captureKey);
        });

        // Verify everything rolled back
        Account unchangedAccount = accountPersistencePort.findByAccountNumber(testAccount.getAccountNumber()).orElseThrow();
        assertEquals(0, new BigDecimal("10000.00").compareTo(unchangedAccount.getBalance()));

        PaymentIntent unchangedIntent = intentRepository.findByIntentId(testIntent.getIntentId()).orElseThrow();
        assertEquals(PaymentIntentStatus.AUTHORIZED, unchangedIntent.getStatus());
        
        assertEquals(0, transactionJpaRepository.count(), "No transaction should be saved");
    }

    @Test
    public void concurrentCaptureOfSamePayment_ShouldCreateExactlyOneFinancialEffect() throws InterruptedException {
        int threads = 10;
        ExecutorService executor = Executors.newFixedThreadPool(threads);
        CountDownLatch startPistol = new CountDownLatch(1);
        CountDownLatch finishLine = new CountDownLatch(threads);

        AtomicInteger successes = new AtomicInteger(0);
        AtomicInteger expectedFailures = new AtomicInteger(0);
        
        String captureKey = "cap_" + UUID.randomUUID();

        for (int i = 0; i < threads; i++) {
            executor.submit(() -> {
                try {
                    startPistol.await();
                    executionService.capturePayment(testIntent.getIntentId(), 99L, captureKey);
                    successes.incrementAndGet();
                } catch (BusinessException e) {
                    expectedFailures.incrementAndGet();
                } catch (Exception e) {
                    e.printStackTrace();
                } finally {
                    finishLine.countDown();
                }
            });
        }

        startPistol.countDown();
        finishLine.await(10, TimeUnit.SECONDS);
        executor.shutdown();

        // Exactly ONE thread should succeed. The other 9 should be blocked by pessimistic locking
        // and subsequently fail validation (state no longer AUTHORIZED) or idempotency.
        assertEquals(1, successes.get(), "Only one capture should succeed");
        assertEquals(9, expectedFailures.get(), "Nine captures should fail");

        // Verify final state
        Account updatedAccount = accountPersistencePort.findByAccountNumber(testAccount.getAccountNumber()).orElseThrow();
        assertEquals(0, new BigDecimal("8500.00").compareTo(updatedAccount.getBalance()));

        PaymentIntent finalizedIntent = intentRepository.findByIntentId(testIntent.getIntentId()).orElseThrow();
        assertEquals(PaymentIntentStatus.CAPTURED, finalizedIntent.getStatus());
    }

    @Test
    public void concurrentCapturesAgainstSameAccount_ShouldNotOverdraw() throws InterruptedException {
        // Account has 10,000. Create 10 intents of 1,500 each = 15,000 total.
        // We expect exactly 6 to succeed (9,000) and 4 to fail due to insufficient funds.
        int threads = 10;
        ExecutorService executor = Executors.newFixedThreadPool(threads);
        CountDownLatch startPistol = new CountDownLatch(1);
        CountDownLatch finishLine = new CountDownLatch(threads);

        AtomicInteger successes = new AtomicInteger(0);
        AtomicInteger nsfs = new AtomicInteger(0);

        for (int i = 0; i < threads; i++) {
            PaymentIntent intent = PaymentIntent.builder()
                .intentId("PI-" + UUID.randomUUID())
                .merchantId(99L)
                .customerAccountNumber(testAccount.getAccountNumber())
                .amount(new BigDecimal("1500.00"))
                .currency("PHP")
                .status(PaymentIntentStatus.AUTHORIZED) 
                .build();
            intentRepository.save(intent);

            executor.submit(() -> {
                try {
                    startPistol.await();
                    executionService.capturePayment(intent.getIntentId(), 99L, "cap_" + UUID.randomUUID());
                    successes.incrementAndGet();
                } catch (BusinessException e) {
                    if (e.getMessage().contains("Insufficient funds")) {
                        nsfs.incrementAndGet();
                    }
                } catch (Exception e) {
                    e.printStackTrace();
                } finally {
                    finishLine.countDown();
                }
            });
        }

        startPistol.countDown();
        finishLine.await(15, TimeUnit.SECONDS);
        executor.shutdown();

        assertEquals(6, successes.get(), "Exactly 6 captures should succeed before funds run out");
        assertEquals(4, nsfs.get(), "Exactly 4 captures should fail with Insufficient Funds");

        Account updatedAccount = accountPersistencePort.findByAccountNumber(testAccount.getAccountNumber()).orElseThrow();
        assertEquals(0, new BigDecimal("1000.00").compareTo(updatedAccount.getBalance()), "Remaining balance should be 1,000");
    }

    @Test
    public void cancelAuthorizedPayment_ShouldSucceedWithoutFinancialEffects() {
        String cancelKey = "can_" + UUID.randomUUID();

        PaymentIntent cancelled = executionService.cancelPayment(testIntent.getIntentId(), 99L, cancelKey);

        assertEquals(PaymentIntentStatus.CANCELLED, cancelled.getStatus(), "Status must transition to CANCELLED");

        // Verify NO financial effects occurred
        Account account = accountPersistencePort.findByAccountNumber(testAccount.getAccountNumber()).orElseThrow();
        assertEquals(0, new BigDecimal("10000.00").compareTo(account.getBalance()), "Balance must remain unchanged");
        assertEquals(0, transactionJpaRepository.count(), "No transactions should be created");
    }

    @Test
    public void cancelCapturedPayment_ShouldBeRejected() {
        // First, successfully capture it
        executionService.capturePayment(testIntent.getIntentId(), 99L, "cap_" + UUID.randomUUID());

        // Then, attempt to cancel
        String cancelKey = "can_" + UUID.randomUUID();
        BusinessException exception = assertThrows(BusinessException.class, () -> {
            executionService.cancelPayment(testIntent.getIntentId(), 99L, cancelKey);
        });

        assertTrue(exception.getMessage().contains("Financial effects have already been applied"));
    }

    @Test
    public void cancelAlreadyCancelledPayment_ShouldBeIdempotent() {
        String cancelKey1 = "can_" + UUID.randomUUID();
        String cancelKey2 = "can_" + UUID.randomUUID();

        // First cancellation
        executionService.cancelPayment(testIntent.getIntentId(), 99L, cancelKey1);
        
        // Second cancellation (should return smoothly without throwing exceptions)
        PaymentIntent result = executionService.cancelPayment(testIntent.getIntentId(), 99L, cancelKey2);

        assertEquals(PaymentIntentStatus.CANCELLED, result.getStatus());
    }

    @Test
    public void merchantCannotCancelAnotherMerchantsPayment() {
        String cancelKey = "can_" + UUID.randomUUID();
        Long maliciousMerchantId = 100L;

        BusinessException exception = assertThrows(BusinessException.class, () -> {
            executionService.cancelPayment(testIntent.getIntentId(), maliciousMerchantId, cancelKey);
        });

        assertTrue(exception.getMessage().contains("ownership validation failed"));
    }

    @Test
    public void concurrentCancel_ShouldProduceExactlyOneStateTransition() throws InterruptedException {
        int threads = 5;
        ExecutorService executor = Executors.newFixedThreadPool(threads);
        CountDownLatch startPistol = new CountDownLatch(1);
        CountDownLatch finishLine = new CountDownLatch(threads);

        for (int i = 0; i < threads; i++) {
            executor.submit(() -> {
                try {
                    startPistol.await();
                    // All threads try to cancel simultaneously
                    executionService.cancelPayment(testIntent.getIntentId(), 99L, "can_" + UUID.randomUUID());
                } catch (Exception e) {
                    // Safe to ignore, we are testing the final state
                } finally {
                    finishLine.countDown();
                }
            });
        }

        startPistol.countDown();
        finishLine.await(5, TimeUnit.SECONDS);
        executor.shutdown();

        PaymentIntent finalIntent = intentRepository.findByIntentId(testIntent.getIntentId()).orElseThrow();
        assertEquals(PaymentIntentStatus.CANCELLED, finalIntent.getStatus(), "Payment must be in CANCELLED state");
    }

    @Test
    public void authorizedPayment_ShouldExpireAndBeIdempotent() {
        String expireKey = "exp_" + UUID.randomUUID();

        PaymentIntent expired = executionService.expirePayment(testIntent.getIntentId(), expireKey);
        assertEquals(PaymentIntentStatus.EXPIRED, expired.getStatus());

        // Verify NO financial effects occurred
        Account account = accountPersistencePort.findByAccountNumber(testAccount.getAccountNumber()).orElseThrow();
        assertEquals(0, new BigDecimal("10000.00").compareTo(account.getBalance()), "Balance must remain unchanged");
        assertEquals(0, transactionJpaRepository.count(), "No transactions should be created");

        // Idempotency: Running it again should not fail
        PaymentIntent expiredAgain = executionService.expirePayment(testIntent.getIntentId(), "exp_" + UUID.randomUUID());
        assertEquals(PaymentIntentStatus.EXPIRED, expiredAgain.getStatus());
    }

    @Test
    public void capturedPayment_ShouldNotExpire() {
        // First capture the payment
        executionService.capturePayment(testIntent.getIntentId(), 99L, "cap_" + UUID.randomUUID());

        // Attempting to expire it should be rejected
        BusinessException exception = assertThrows(BusinessException.class, () -> {
            executionService.expirePayment(testIntent.getIntentId(), "exp_" + UUID.randomUUID());
        });

        assertTrue(exception.getMessage().contains("Financial effects have already been applied"));
    }

    @Test
    public void cancelledPayment_ShouldNotExpire() {
        executionService.cancelPayment(testIntent.getIntentId(), 99L, "can_" + UUID.randomUUID());

        BusinessException exception = assertThrows(BusinessException.class, () -> {
            executionService.expirePayment(testIntent.getIntentId(), "exp_" + UUID.randomUUID());
        });

        assertTrue(exception.getMessage().contains("already cancelled"));
    }

    @Test
    public void concurrentCaptureAndExpiration_ShouldProduceExactlyOneValidOutcome() throws InterruptedException {
        int threads = 10;
        ExecutorService executor = Executors.newFixedThreadPool(threads);
        CountDownLatch startPistol = new CountDownLatch(1);
        CountDownLatch finishLine = new CountDownLatch(threads);

        AtomicInteger successfulCaptures = new AtomicInteger(0);
        AtomicInteger successfulExpires = new AtomicInteger(0);
        AtomicInteger expectedFailures = new AtomicInteger(0);

        for (int i = 0; i < threads; i++) {
            // Half the threads try to capture, half try to expire
            final boolean isCapture = (i % 2 == 0);
            
            executor.submit(() -> {
                try {
                    startPistol.await();
                    if (isCapture) {
                        executionService.capturePayment(testIntent.getIntentId(), 99L, "cap_" + UUID.randomUUID());
                        successfulCaptures.incrementAndGet();
                    } else {
                        executionService.expirePayment(testIntent.getIntentId(), "exp_" + UUID.randomUUID());
                        successfulExpires.incrementAndGet();
                    }
                } catch (BusinessException e) {
                    expectedFailures.incrementAndGet();
                } catch (Exception e) {
                    e.printStackTrace();
                } finally {
                    finishLine.countDown();
                }
            });
        }

        startPistol.countDown();
        finishLine.await(10, TimeUnit.SECONDS);
        executor.shutdown();

        PaymentIntent finalizedIntent = intentRepository.findByIntentId(testIntent.getIntentId()).orElseThrow();
        Account updatedAccount = accountPersistencePort.findByAccountNumber(testAccount.getAccountNumber()).orElseThrow();
        long txCount = transactionJpaRepository.count();

        // Evaluate the two valid mathematical outcomes based on the winner of the lock
        if (successfulCaptures.get() == 1) {
            // OUTCOME A: CAPTURE won the race.
            assertEquals(PaymentIntentStatus.CAPTURED, finalizedIntent.getStatus(), "Payment must be captured");
            assertEquals(0, new BigDecimal("8500.00").compareTo(updatedAccount.getBalance()), "Balance must be deducted");
            assertEquals(1, txCount, "One transaction must be created");
            
            // 4 captures failed (state changed), 5 expires failed (cannot expire captured payment)
            assertEquals(9, expectedFailures.get(), "9 operations must be rejected");
            assertEquals(0, successfulExpires.get(), "No expirations should succeed");
        } else {
            // OUTCOME B: EXPIRE won the race.
            assertEquals(PaymentIntentStatus.EXPIRED, finalizedIntent.getStatus(), "Payment must be expired");
            assertEquals(0, new BigDecimal("10000.00").compareTo(updatedAccount.getBalance()), "Balance must remain untouched");
            assertEquals(0, txCount, "No transactions should be created");
            
            // 5 captures failed (cannot capture an expired payment). 
            assertEquals(5, expectedFailures.get(), "5 capture operations must be rejected");
            // 5 expires "succeeded" (1 actually transitioned the state, 4 returned idempotently).
            assertEquals(5, successfulExpires.get(), "All 5 expiration requests should resolve smoothly (1 active, 4 idempotent)");
        }
    }

    @Test
    public void refundCapturedPayment_ShouldCreateBalancedLedgerEntries() {
        // 1. Setup: Capture the payment first
        executionService.capturePayment(testIntent.getIntentId(), 99L, "cap_" + UUID.randomUUID());

        // 2. Refund a partial amount
        String refundKey = "ref_" + UUID.randomUUID();
        BigDecimal refundAmount = new BigDecimal("500.00");
        executionService.refundPayment(testIntent.getIntentId(), 99L, refundKey, refundAmount, "Customer request");

        // 3. Verify Account Balances
        Account updatedAccount = accountPersistencePort.findByAccountNumber(testAccount.getAccountNumber()).orElseThrow();
        // Original 10000 - 1500 (Capture) + 500 (Refund) = 9000
        assertEquals(0, new BigDecimal("9000.00").compareTo(updatedAccount.getBalance()));

        // 4. Verify Intent State
        PaymentIntent intent = intentRepository.findByIntentId(testIntent.getIntentId()).orElseThrow();
        assertEquals(PaymentIntentStatus.PARTIALLY_REFUNDED, intent.getStatus());

        // 5. Verify Ledger and Transactions (1 for capture, 1 for refund)
        long txCount = transactionJpaRepository.count();
        assertEquals(2, txCount);
    }

    @Test
    public void refundCannotExceedCapturedAmount() {
        executionService.capturePayment(testIntent.getIntentId(), 99L, "cap_" + UUID.randomUUID());

        String refundKey = "ref_" + UUID.randomUUID();
        BigDecimal oversizedRefund = new BigDecimal("2000.00"); // Captured amount is 1500

        BusinessException exception = assertThrows(BusinessException.class, () -> {
            executionService.refundPayment(testIntent.getIntentId(), 99L, refundKey, oversizedRefund, "Oversized");
        });

        assertTrue(exception.getMessage().contains("exceeds remaining refundable amount"));
    }

    @Test
    public void concurrentRefunds_ShouldNeverOverRefund() throws InterruptedException {
        // Setup: Capture the 1500 payment
        executionService.capturePayment(testIntent.getIntentId(), 99L, "cap_" + UUID.randomUUID());

        // Attack: 10 threads trying to refund 1000 each. 
        // Only ONE should succeed. 1000 + 1000 > 1500.
        int threads = 10;
        ExecutorService executor = Executors.newFixedThreadPool(threads);
        CountDownLatch startPistol = new CountDownLatch(1);
        CountDownLatch finishLine = new CountDownLatch(threads);

        AtomicInteger successfulRefunds = new AtomicInteger(0);
        AtomicInteger overRefundFailures = new AtomicInteger(0);

        for (int i = 0; i < threads; i++) {
            final String uniqueRefundKey = "ref_" + UUID.randomUUID(); // Different keys, same intent
            executor.submit(() -> {
                try {
                    startPistol.await();
                    executionService.refundPayment(testIntent.getIntentId(), 99L, uniqueRefundKey, new BigDecimal("1000.00"), "Concurrency test");
                    successfulRefunds.incrementAndGet();
                } catch (BusinessException e) {
                    if (e.getMessage().contains("exceeds remaining refundable amount")) {
                        overRefundFailures.incrementAndGet();
                    }
                } catch (Exception e) {
                    e.printStackTrace();
                } finally {
                    finishLine.countDown();
                }
            });
        }

        startPistol.countDown();
        finishLine.await(10, TimeUnit.SECONDS);
        executor.shutdown();

        // 1. Exactly ONE refund must succeed.
        assertEquals(1, successfulRefunds.get(), "Only one refund should fit within the captured amount limits");
        assertEquals(9, overRefundFailures.get(), "Nine refunds must be blocked by the mathematical invariant check");

        // 2. Verify Final Mathematical State
        PaymentIntent finalIntent = intentRepository.findByIntentId(testIntent.getIntentId()).orElseThrow();
        assertEquals(PaymentIntentStatus.PARTIALLY_REFUNDED, finalIntent.getStatus());

        BigDecimal totalRefunded = refundRepository.sumCompletedRefundsByPaymentIntentId(finalIntent.getId());
        assertEquals(0, new BigDecimal("1000.00").compareTo(totalRefunded));
        
        Account finalAccount = accountPersistencePort.findByAccountNumber(testAccount.getAccountNumber()).orElseThrow();
        // 10000 - 1500 + 1000 = 9500
        assertEquals(0, new BigDecimal("9500.00").compareTo(finalAccount.getBalance()));
    }
}
