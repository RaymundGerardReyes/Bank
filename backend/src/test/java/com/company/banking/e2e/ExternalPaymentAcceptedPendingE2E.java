package com.company.banking.e2e;

import com.company.banking.account.domain.Account;
import com.company.banking.account.infrastructure.AccountJpaRepository;
import com.company.banking.common.enums.AccountStatus;
import com.company.banking.payment.infrastructure.PaymentEventOutboxJpaRepository;
import com.company.banking.transaction.api.dto.ExternalPaymentRequest;
import com.company.banking.transaction.domain.Transaction;
import com.company.banking.transaction.domain.TransactionStatus;
import com.company.banking.transaction.infrastructure.LedgerEntryJpaRepository;
import com.company.banking.transaction.infrastructure.TransactionJpaRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.test.context.ActiveProfiles;

import java.math.BigDecimal;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertTrue;

import org.springframework.context.annotation.Import;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@ActiveProfiles("test")
@Import(E2ESecurityBypassConfig.class)
public class ExternalPaymentAcceptedPendingE2E {

    @Autowired
    private TestRestTemplate http;

    @Autowired
    private AccountJpaRepository accountRepository;

    @Autowired
    private TransactionJpaRepository transactionRepository;

    @Autowired
    private LedgerEntryJpaRepository ledgerEntryRepository;
    @Autowired
    private PaymentEventOutboxJpaRepository outboxRepository;

    @Autowired
    private com.company.banking.orchestration.infrastructure.PaymentRailConfigurationJpaRepository railRepository;

    private String sourceAccount;

    @BeforeEach
    public void setup() {
        sourceAccount = "ACC-4001";
        
        Account source = accountRepository.findByAccountNumber(sourceAccount).orElseGet(() -> Account.builder()
                .accountNumber(sourceAccount)
                .customerId(104L)
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
    public void shouldAcceptExternalPaymentAsPendingAndWriteOutbox() {
        // 1. Arrange
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

        // 2. Act (Immediate Synchronous Response)
        ResponseEntity<com.fasterxml.jackson.databind.JsonNode> response = http.postForEntity(
                "/api/v1/transactions/external-payment",
                request,
                com.fasterxml.jackson.databind.JsonNode.class
        );

        // 3. Assert HTTP is Accepted (Request accepted is not the same as settlement!)
        assertEquals(HttpStatus.OK, response.getStatusCode(), "Must accept the external payment request");
        assertNotNull(response.getBody());
        
        String txRef = response.getBody().get("data").get("transactionReference").asText();
        assertNotNull(txRef);

        // 4. Assert Transaction is strictly PENDING
        Transaction transaction = transactionRepository.findByIdempotencyKey(idempotencyKey).orElseThrow();
        assertEquals(TransactionStatus.PENDING, transaction.getStatus(), 
                "Transaction MUST be in PENDING state because external settlement has not occurred yet.");

        // 5. Assert Outbox Event exists (Atomically persisted alongside PENDING transaction)
        int outboxEventCount = outboxRepository.countByAggregateTypeAndAggregateId("TRANSACTION", txRef);
        assertTrue(outboxEventCount > 0, "An Outbox event must exist to queue the external HTTP transmission.");

        // 6. Assert NO Ledger Settlement has occurred (Double-Entry happens later)
        long ledgerEntries = ledgerEntryRepository.findByTransactionReference(txRef).size();
        assertEquals(0, ledgerEntries, "No ledger entries should exist during the PENDING state.");
    }
}
