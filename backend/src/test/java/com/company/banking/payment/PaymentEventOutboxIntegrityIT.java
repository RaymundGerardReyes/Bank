package com.company.banking.payment;

import com.company.banking.account.application.port.out.AccountPersistencePort;
import com.company.banking.account.domain.Account;
import com.company.banking.common.enums.AccountStatus;
import com.company.banking.payment.application.InternalPaymentExecutionService;
import com.company.banking.payment.domain.PaymentEventType;
import com.company.banking.payment.domain.PaymentIntent;
import com.company.banking.payment.domain.PaymentIntentStatus;
import com.company.banking.payment.infrastructure.PaymentEventOutboxJpaRepository;
import com.company.banking.payment.infrastructure.PaymentIntentJpaRepository;
import com.company.banking.transaction.application.port.out.LedgerPersistencePort;
import com.company.banking.transaction.infrastructure.TransactionJpaRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.bean.override.mockito.MockitoSpyBean;

import java.math.BigDecimal;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.doThrow;

@SpringBootTest
@ActiveProfiles("test")
public class PaymentEventOutboxIntegrityIT {
    @Autowired private com.company.banking.account.infrastructure.AccountJpaRepository accountJpaRepository;

    @Autowired
    private InternalPaymentExecutionService executionService;

    @Autowired
    private PaymentEventOutboxJpaRepository outboxRepository;

    @Autowired
    private PaymentIntentJpaRepository intentRepository;

    @Autowired
    private TransactionJpaRepository transactionRepository;

    @Autowired
    private AccountPersistencePort accountPersistencePort;

    @MockitoSpyBean
    private LedgerPersistencePort ledgerPersistencePort; // Used to simulate failures

    private Account customerAccount;
    private Account merchantAccount;
    private PaymentIntent testIntent;

    @BeforeEach
    public void setup() {
        outboxRepository.deleteAll();
        transactionRepository.deleteAll();
        intentRepository.deleteAll();
        accountJpaRepository.deleteAll();

        customerAccount = accountPersistencePort.save(Account.builder()
                .accountNumber("INT-OB-1001-" + UUID.randomUUID().toString().substring(0, 5))
                .customerId(10L)
                .balance(new BigDecimal("10000.00"))
                .currency("PHP")
                .status(AccountStatus.ACTIVE)
                .build());

        merchantAccount = accountPersistencePort.save(Account.builder()
                .accountNumber("MERCHANT-SETTLEMENT-99")
                .customerId(99L)
                .balance(new BigDecimal("0.00"))
                .currency("PHP")
                .status(AccountStatus.ACTIVE)
                .build());

        testIntent = intentRepository.save(PaymentIntent.builder()
                .intentId("pi_" + UUID.randomUUID())
                .merchantId(99L)
                .customerAccountNumber(customerAccount.getAccountNumber())
                .amount(new BigDecimal("1500.00"))
                .currency("PHP")
                .status(PaymentIntentStatus.AUTHORIZED)
                .build());
    }

    @Test
    public void capture_ShouldCreateExactlyOneOutboxEvent() {
        // Act
        executionService.capturePayment(testIntent.getIntentId(), 99L, "cap_" + UUID.randomUUID());

        // Assert
        assertEquals(1, transactionRepository.count(), "Transaction created");
        assertEquals(1, outboxRepository.count(), "Exactly 1 outbox event created");
        
        var event = outboxRepository.findAll().get(0);
        assertEquals(PaymentEventType.CHECKOUT_PAYMENT_SUCCEEDED, event.getEventType());
        assertEquals("PENDING", event.getStatus().name());
    }

    @Test
    public void captureRollback_ShouldRemoveOutboxEvent() {
        // Arrange: Sabotage the ledger saving to simulate a mid-flight database crash
        doThrow(new RuntimeException("Simulated Database Crash"))
                .when(ledgerPersistencePort).saveLedgerEntries(any());

        // Act
        assertThrows(RuntimeException.class, () -> {
            executionService.capturePayment(testIntent.getIntentId(), 99L, "cap_" + UUID.randomUUID());
        });

        // Assert: Everything must roll back
        assertEquals("AUTHORIZED", intentRepository.findByIntentId(testIntent.getIntentId()).get().getStatus().name());
        assertEquals(0, transactionRepository.count(), "Transactions must be rolled back");
        assertEquals(0, outboxRepository.count(), "CRITICAL: Outbox events MUST be rolled back");
    }
}
