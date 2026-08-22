package com.company.banking.apigateway.security;

import com.company.banking.account.application.port.out.AccountPersistencePort;
import com.company.banking.account.domain.Account;
import com.company.banking.common.enums.AccountStatus;
import com.company.banking.payment.application.InternalPaymentExecutionService;
import com.company.banking.payment.domain.PaymentIntent;
import com.company.banking.payment.domain.PaymentIntentStatus;
import com.company.banking.payment.infrastructure.PaymentEventOutboxJpaRepository;
import com.company.banking.payment.infrastructure.PaymentIntentJpaRepository;
import com.company.banking.transaction.infrastructure.LedgerEntryJpaRepository;
import com.company.banking.transaction.infrastructure.TransactionJpaRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.test.context.ActiveProfiles;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.assertEquals;

@SpringBootTest
@ActiveProfiles("test")
public class SandboxEnvironmentIT {

    @Autowired private InternalPaymentExecutionService executionService;
    @Autowired private PaymentIntentJpaRepository intentRepository;
    @Autowired private AccountPersistencePort accountPersistencePort;
    @Autowired private TransactionJpaRepository transactionRepository;
    @Autowired private LedgerEntryJpaRepository ledgerEntryRepository;
    @Autowired private PaymentEventOutboxJpaRepository outboxRepository;

    private Account customerAccount;
    private PaymentIntent testIntent;

    @BeforeEach
    public void setup() {
        ledgerEntryRepository.deleteAll();
        transactionRepository.deleteAll();
        outboxRepository.deleteAll();
        intentRepository.deleteAll();

        // Seed Real Customer Account with $10,000
        customerAccount = accountPersistencePort.save(Account.builder()
                .accountNumber("CUST-SANDBOX-101")
                .customerId(10L)
                .balance(new BigDecimal("10000.00"))
                .currency("PHP")
                .status(AccountStatus.ACTIVE)
                .build());

        // Seed Intent for $1,000
        testIntent = intentRepository.save(PaymentIntent.builder()
                .intentId("pi_" + UUID.randomUUID())
                .merchantId(99L)
                .customerAccountNumber(customerAccount.getAccountNumber())
                .amount(new BigDecimal("1000.00"))
                .currency("PHP")
                .status(PaymentIntentStatus.AUTHORIZED)
                .build());
    }

    @Test
    public void captureInTestMode_ShouldTriggerWebhook_ButNeverMutateLedger() {
        // 1. Arrange: Inject a "TEST" environment API token into the SecurityContext
        ApiKeyAuthenticationToken testToken = new ApiKeyAuthenticationToken(
                "sk_test_mock", 
                99L, 
                "TEST", 
                List.of(new SimpleGrantedAuthority("SCOPE_PAYMENTS"))
        );
        SecurityContextHolder.getContext().setAuthentication(testToken);

        // 2. Act: Attempt to capture the payment
        executionService.capturePayment(testIntent.getIntentId(), 99L, "idem_" + UUID.randomUUID());

        // 3. Assert: The Intent is successfully updated to CAPTURED
        PaymentIntent capturedIntent = intentRepository.findByIntentId(testIntent.getIntentId()).get();
        assertEquals(PaymentIntentStatus.CAPTURED, capturedIntent.getStatus());

        // 4. Assert: The Webhook outbox event was generated successfully for the merchant to test
        assertEquals(1, outboxRepository.count(), "Sandbox must still generate webhooks");

        // 5. CRITICAL FINANCIAL ASSERTION: Zero Ledger entries and ZERO balance changes
        Account unchangedAccount = accountPersistencePort.findByAccountNumber(customerAccount.getAccountNumber()).orElseThrow();
        assertEquals(0, new BigDecimal("10000.00").compareTo(unchangedAccount.getBalance()), 
                "Sandbox capture MUST NOT deduct real customer balances!");
        assertEquals(0, transactionRepository.count(), "Sandbox capture MUST NOT generate real transactions!");
        assertEquals(0, ledgerEntryRepository.count(), "Sandbox capture MUST NOT generate double-entry ledger records!");
    }
}
