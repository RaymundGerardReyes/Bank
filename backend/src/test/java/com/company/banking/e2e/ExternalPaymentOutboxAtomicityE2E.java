package com.company.banking.e2e;

import com.company.banking.account.domain.Account;
import com.company.banking.account.infrastructure.AccountJpaRepository;
import com.company.banking.common.enums.AccountStatus;
import com.company.banking.payment.domain.PaymentEventOutbox;
import com.company.banking.payment.infrastructure.PaymentEventOutboxJpaRepository;
import com.company.banking.transaction.api.dto.ExternalPaymentRequest;
import com.company.banking.transaction.infrastructure.TransactionJpaRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.bean.override.mockito.MockitoSpyBean;

import java.math.BigDecimal;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.doThrow;

import org.springframework.context.annotation.Import;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@ActiveProfiles("test")
@Import(E2ESecurityBypassConfig.class)
public class ExternalPaymentOutboxAtomicityE2E {

    @Autowired
    private TestRestTemplate http;

    @Autowired
    private AccountJpaRepository accountRepository;

    @Autowired
    private TransactionJpaRepository transactionRepository;

    @Autowired
    private com.company.banking.orchestration.infrastructure.PaymentRailConfigurationJpaRepository railRepository;

    // We inject a spy to intentionally crash the database save specifically for the Outbox
    @MockitoSpyBean
    private PaymentEventOutboxJpaRepository outboxRepository;

    private String sourceAccount;

    @BeforeEach
    public void setup() {
        sourceAccount = "ACC-6001";
        
        Account source = accountRepository.findByAccountNumber(sourceAccount).orElseGet(() -> Account.builder()
                .accountNumber(sourceAccount)
                .customerId(105L)
                .currency("PHP")
                .allowOutgoing(true)
                .allowIncoming(true)
                .build());
        source.setBalance(new BigDecimal("10000.00"));
        source.setStatus(AccountStatus.ACTIVE);
        accountRepository.save(source);
        
        railRepository.findByRailName("SWIFT").orElseGet(() ->
            railRepository.save(com.company.banking.orchestration.domain.PaymentRailConfiguration.builder()
                .railName("SWIFT")
                .processingType("BATCH")
                .active(true)
                .maxAmountPerTx(new BigDecimal("100000.00"))
                .build())
        );
    }

    @Test
    public void shouldRollbackTransactionIfOutboxSaveFails() {
        // 1. Arrange: Force a catastrophic failure ONLY when persisting the outbox event
        doThrow(new RuntimeException("Simulated Outbox Persistence Failure"))
                .when(outboxRepository).save(any(PaymentEventOutbox.class));

        String idempotencyKey = UUID.randomUUID().toString();
        ExternalPaymentRequest request = ExternalPaymentRequest.builder()
                .sourceAccountNumber(sourceAccount)
                .destinationAccountNumber("EXT-NOVA-888")
                .amount(new BigDecimal("500.00"))
                .idempotencyKey(idempotencyKey)
                .railName("SWIFT")
                .recipientName("NovaBank Corp")
                .routingNumber("NOVA-1234")
                .build();

        // 2. Act
        ResponseEntity<String> response = http.postForEntity(
                "/api/v1/transactions/external-payment",
                request,
                String.class
        );

        // 3. Assert HTTP Failure
        // The transaction rolls back natively to a 500
        assertEquals(HttpStatus.INTERNAL_SERVER_ERROR, response.getStatusCode(), "HTTP response must indicate failure due to outbox crash");

        // 4. Assert Absolute Atomicity
        // Since the Outbox failed to save, the entire transaction (including the Payment anchor) MUST roll back.
        long transactionCount = transactionRepository.findAll().stream()
                .filter(tx -> tx.getIdempotencyKey().equals(idempotencyKey))
                .count();
        
        assertEquals(0, transactionCount, "Transaction MUST be rolled back if the outbox event fails to persist. " +
                "They must be a single atomic unit.");
    }
}
