package com.company.banking.e2e;

import com.company.banking.account.domain.Account;
import com.company.banking.account.infrastructure.AccountJpaRepository;
import com.company.banking.common.enums.AccountStatus;
import com.company.banking.transaction.api.dto.InternalTransferRequest;
import com.company.banking.transaction.domain.EntryType;
import com.company.banking.transaction.domain.LedgerEntry;
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
import java.util.List;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;

import org.springframework.context.annotation.Import;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@ActiveProfiles("test")
@Import(E2ESecurityBypassConfig.class)
public class InternalTransferDoubleEntryE2E {

    @Autowired
    private TestRestTemplate http;

    @Autowired
    private AccountJpaRepository accountRepository;

    @Autowired
    private TransactionJpaRepository transactionRepository;

    @Autowired
    private LedgerEntryJpaRepository ledgerEntryRepository;

    private String sourceAccount;
    private String destinationAccount;
    private BigDecimal initialSourceBalance;
    private BigDecimal initialDestBalance;

    @BeforeEach
    public void setup() {
        sourceAccount = "ACC-1001";
        destinationAccount = "ACC-1002";
        Account source = accountRepository.findByAccountNumber(sourceAccount).orElseGet(() -> Account.builder()
                .accountNumber(sourceAccount)
                .customerId(101L)
                .currency("PHP")
                .allowOutgoing(true)
                .allowIncoming(true)
                .build());
        source.setBalance(new BigDecimal("10000.00"));
        source.setStatus(AccountStatus.ACTIVE);
        accountRepository.save(source);

        Account dest = accountRepository.findByAccountNumber(destinationAccount).orElseGet(() -> Account.builder()
                .accountNumber(destinationAccount)
                .customerId(102L)
                .currency("PHP")
                .allowOutgoing(true)
                .allowIncoming(true)
                .build());
        dest.setBalance(new BigDecimal("5000.00"));
        dest.setStatus(AccountStatus.ACTIVE);
        accountRepository.save(dest);

        initialSourceBalance = new BigDecimal("10000.00");
        initialDestBalance = new BigDecimal("5000.00");
    }

    @Test
    public void shouldProcessTransferAndWriteDoubleEntryLedger() {
        // 1. Arrange
        BigDecimal transferAmount = new BigDecimal("500.00");
        String idempotencyKey = UUID.randomUUID().toString();
        InternalTransferRequest request = new InternalTransferRequest();
        request.setSourceAccountNumber(sourceAccount);
        request.setDestinationAccountNumber(destinationAccount);
        request.setAmount(transferAmount);
        request.setIdempotencyKey(idempotencyKey);
        request.setDescription("E2E Double Entry Test");

        // 2. Act
        ResponseEntity<com.fasterxml.jackson.databind.JsonNode> response = http.postForEntity(
                "/api/v1/transfers/internal",
                request,
                com.fasterxml.jackson.databind.JsonNode.class
        );

        // 3. Assert HTTP
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        String txRef = response.getBody().get("data").get("transactionReference").asText();
        assertNotNull(txRef);

        // 4. Assert Balances
        Account source = accountRepository.findByAccountNumber(sourceAccount).orElseThrow();
        Account dest = accountRepository.findByAccountNumber(destinationAccount).orElseThrow();
        
        assertEquals(0, source.getBalance().compareTo(initialSourceBalance.subtract(transferAmount)), "Source balance should be deducted by 500");
        assertEquals(0, dest.getBalance().compareTo(initialDestBalance.add(transferAmount)), "Destination balance should be increased by 500");

        // 5. Assert Transaction Anchor State
        Transaction transaction = transactionRepository.findByIdempotencyKey(idempotencyKey).orElseThrow();
        assertEquals(TransactionStatus.COMPLETED, transaction.getStatus());
        assertEquals(request.getIdempotencyKey(), transaction.getIdempotencyKey());

        // 6. Assert Ledger Entries
        List<LedgerEntry> ledgerEntries = ledgerEntryRepository.findByTransactionReference(txRef);
        assertEquals(2, ledgerEntries.size(), "Exactly 2 ledger entries should exist for this transaction");

        LedgerEntry debitEntry = ledgerEntries.stream()
                .filter(e -> e.getEntryType() == EntryType.DEBIT)
                .findFirst()
                .orElseThrow(() -> new AssertionError("DEBIT entry not found"));

        LedgerEntry creditEntry = ledgerEntries.stream()
                .filter(e -> e.getEntryType() == EntryType.CREDIT)
                .findFirst()
                .orElseThrow(() -> new AssertionError("CREDIT entry not found"));

        // Validate association and mathematics
        assertEquals(sourceAccount, debitEntry.getAccountNumber());
        assertEquals(destinationAccount, creditEntry.getAccountNumber());
        
        assertEquals(0, debitEntry.getAmount().compareTo(transferAmount));
        assertEquals(0, creditEntry.getAmount().compareTo(transferAmount));
        
        assertEquals(0, debitEntry.getAmount().subtract(creditEntry.getAmount()).compareTo(BigDecimal.ZERO), "Debit and Credit amounts must balance to zero difference");
    }
}
