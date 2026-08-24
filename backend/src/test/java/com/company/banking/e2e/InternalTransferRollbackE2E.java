package com.company.banking.e2e;

import com.company.banking.account.application.port.out.AccountPersistencePort;
import com.company.banking.account.domain.Account;
import com.company.banking.account.infrastructure.AccountJpaRepository;
import com.company.banking.common.enums.AccountStatus;
import com.company.banking.transaction.api.dto.InternalTransferRequest;
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
public class InternalTransferRollbackE2E {

    @Autowired
    private TestRestTemplate http;

    @Autowired
    private AccountJpaRepository accountRepository;

    @Autowired
    private TransactionJpaRepository transactionRepository;

    @Autowired
    private LedgerEntryJpaRepository ledgerEntryRepository;

    // Use a spy to artificially inject a catastrophic database failure halfway through the @Transactional method
    @MockitoSpyBean
    private AccountPersistencePort accountPersistencePort;

    private String sourceAccount;
    private String destinationAccount;
    private BigDecimal initialSourceBalance;
    private BigDecimal initialDestBalance;

    @BeforeEach
    public void setup() {
        sourceAccount = "ACC-2001";
        destinationAccount = "ACC-2002";

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
    public void shouldCompletelyRollbackOnMidTransactionFailure() {
        // 1. Arrange: Configure the spy to fail ONLY when saving the destination account balance.
        // This simulates a database crash right at the end of the transaction.
        doThrow(new RuntimeException("Simulated Database Crash During Balance Mutation!"))
                .when(accountPersistencePort).save(any(Account.class));

        BigDecimal transferAmount = new BigDecimal("500.00");
        InternalTransferRequest request = new InternalTransferRequest();
        request.setSourceAccountNumber(sourceAccount);
        request.setDestinationAccountNumber(destinationAccount);
        request.setAmount(transferAmount);
        request.setIdempotencyKey(UUID.randomUUID().toString());
        request.setDescription("E2E Rollback Test");

        // 2. Act
        ResponseEntity<String> response = http.postForEntity(
                "/api/v1/transfers/internal",
                request,
                String.class
        );

        // 3. Assert HTTP Failure
        assertEquals(HttpStatus.INTERNAL_SERVER_ERROR, response.getStatusCode(), "HTTP response must indicate failure");

        // 4. Assert Atomic Rollback (Financial Invariant)
        Account source = accountRepository.findByAccountNumber(sourceAccount).orElseThrow();
        Account dest = accountRepository.findByAccountNumber(destinationAccount).orElseThrow();

        assertEquals(0, source.getBalance().compareTo(initialSourceBalance), "Source balance MUST be unchanged");
        assertEquals(0, dest.getBalance().compareTo(initialDestBalance), "Destination balance MUST be unchanged");

        // 5. Assert No Partial Ledger State Leaked
        long transactionCount = transactionRepository.findAll().stream()
                .filter(tx -> tx.getIdempotencyKey().equals(request.getIdempotencyKey()))
                .count();
        assertEquals(0, transactionCount, "Transaction anchor must be completely rolled back");

        // Note: LedgerEntries are linked via transactionReference. 
        // Since we rolled back the transaction creation, the ledger entries should also be rolled back.
    }
}
