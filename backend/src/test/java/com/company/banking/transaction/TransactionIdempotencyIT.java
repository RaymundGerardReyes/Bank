package com.company.banking.transaction;

import com.company.banking.account.application.port.out.AccountPersistencePort;
import com.company.banking.account.domain.Account;
import com.company.banking.common.enums.AccountStatus;
import com.company.banking.transaction.api.dto.InternalTransferRequest;
import com.company.banking.transaction.api.dto.TransactionResponse;
import com.company.banking.transaction.application.port.in.TransactionUseCase;
import com.company.banking.transaction.infrastructure.LedgerEntryJpaRepository;
import com.company.banking.transaction.infrastructure.TransactionJpaRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;

import java.math.BigDecimal;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;

/**
 * Idempotency integration test.
 *
 * IMPORTANT: This test must NOT be annotated with @Transactional.
 * If the test runs inside a single transaction, the second processInternalTransfer() call
 * would find the first transaction in the same uncommitted Hibernate session, producing
 * a false-positive (it would look idempotent even if the DB constraint wasn't working).
 * Running without @Transactional means each service call commits its own transaction,
 * so the second call truly reads from the committed database state.
 */
@SpringBootTest
@ActiveProfiles("test")
public class TransactionIdempotencyIT {

    @Autowired
    private TransactionUseCase transactionUseCase;

    @Autowired
    private AccountPersistencePort accountPersistencePort;

    @Autowired
    private TransactionJpaRepository transactionRepository;

    @Autowired
    private LedgerEntryJpaRepository ledgerEntryRepository;

    @Autowired
    private com.company.banking.account.infrastructure.AccountJpaRepository accountJpaRepository;

    private static final String SOURCE_ACC = "IDEM-SRC-" + UUID.randomUUID().toString().substring(0, 8);
    private static final String DEST_ACC   = "IDEM-DST-" + UUID.randomUUID().toString().substring(0, 8);
    private static final String IDEM_KEY   = "idem-test-" + UUID.randomUUID();

    @BeforeEach
    void setup() {
        // Purge any state from prior runs so test is repeatable
        ledgerEntryRepository.deleteAll();
        transactionRepository.deleteAll();
        accountJpaRepository.deleteAll();

        accountPersistencePort.save(Account.builder()
                .accountNumber(SOURCE_ACC)
                .customerId(901L)
                .balance(new BigDecimal("500.00"))
                .currency("PHP")
                .status(AccountStatus.ACTIVE)
                .allowOutgoing(true).allowIncoming(true)
                .build());

        accountPersistencePort.save(Account.builder()
                .accountNumber(DEST_ACC)
                .customerId(902L)
                .balance(new BigDecimal("0.00"))
                .currency("PHP")
                .status(AccountStatus.ACTIVE)
                .allowOutgoing(true).allowIncoming(true)
                .build());
    }

    @Test
    public void duplicateTransferRequests_ShouldReturnSameTransaction_WithoutFailing() {
        InternalTransferRequest request = InternalTransferRequest.builder()
                .sourceAccountNumber(SOURCE_ACC)
                .destinationAccountNumber(DEST_ACC)
                .amount(new BigDecimal("50.00"))
                .idempotencyKey(IDEM_KEY)
                .description("Idempotency Test")
                .build();

        // Act: Execute the same request twice — the second must return the same result
        TransactionResponse firstResponse  = transactionUseCase.processInternalTransfer(request);
        TransactionResponse secondResponse = transactionUseCase.processInternalTransfer(request);

        // Assert 1: Both calls map to the SAME transaction reference
        assertEquals(firstResponse.getTransactionReference(), secondResponse.getTransactionReference(),
                "Both responses must reference the same transaction");

        // Assert 2: Exactly ONE transaction record in the database
        long txCount = transactionRepository.count();
        assertEquals(1, txCount, "Idempotency must ensure exactly 1 transaction is persisted, not 2");

        // Assert 3: Money was moved exactly once — balance deducted once, not twice
        Account finalSource = accountPersistencePort.findByAccountNumber(SOURCE_ACC).orElseThrow();
        Account finalDest   = accountPersistencePort.findByAccountNumber(DEST_ACC).orElseThrow();
        assertEquals(0, new BigDecimal("450.00").compareTo(finalSource.getBalance()),
                "Source balance must show exactly one 50.00 deduction (500 - 50 = 450)");
        assertEquals(0, new BigDecimal("50.00").compareTo(finalDest.getBalance()),
                "Destination balance must show exactly one 50.00 credit");

        // Assert 4: Exactly two ledger entries (one DEBIT, one CREDIT)
        long ledgerCount = ledgerEntryRepository.findByTransactionReference(
                firstResponse.getTransactionReference()).size();
        assertEquals(2, ledgerCount,
                "Exactly one DEBIT + one CREDIT ledger entry must exist for the single transaction");
    }
}
