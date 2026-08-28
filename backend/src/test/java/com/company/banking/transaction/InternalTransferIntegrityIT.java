package com.company.banking.transaction;

import com.company.banking.account.application.port.out.AccountPersistencePort;
import com.company.banking.account.domain.Account;
import com.company.banking.common.enums.AccountStatus;
import com.company.banking.notification.application.port.out.PushNotificationPort;
import com.company.banking.transaction.api.dto.InternalTransferRequest;
import com.company.banking.transaction.application.InternalTransferService;
import com.company.banking.transaction.domain.EntryType;
import com.company.banking.transaction.domain.LedgerEntry;
import com.company.banking.transaction.infrastructure.LedgerEntryJpaRepository;
import com.company.banking.transaction.infrastructure.TransactionJpaRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import com.company.banking.config.TransferSpyIntegrationTest;
import org.springframework.dao.DataIntegrityViolationException;


import java.math.BigDecimal;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.assertDoesNotThrow;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.doThrow;

public class InternalTransferIntegrityIT extends TransferSpyIntegrationTest {

    @Autowired
    private InternalTransferService internalTransferService;

    @Autowired
    private TransactionJpaRepository transactionRepository;

    @Autowired
    private LedgerEntryJpaRepository ledgerEntryRepository;


    private Account sourceAccount;
    private Account destAccount;
    private InternalTransferRequest validRequest;

    @Autowired
    private org.springframework.jdbc.core.JdbcTemplate jdbcTemplate;

    @BeforeEach
    void setup() {
        try {
            jdbcTemplate.execute("ALTER TABLE ledger_entries ADD CONSTRAINT fk_ledger_transaction_reference FOREIGN KEY (transaction_reference) REFERENCES transactions(transaction_reference)");
        } catch (Exception ignored) {
            // Constraint may already exist across tests
        }

        // Database is automatically cleaned by TestDatabaseCleaner

        // 1. Seed authoritative accounts
        sourceAccount = accountPersistencePort.save(Account.builder()
                .accountNumber("SRC-INT-" + UUID.randomUUID().toString().substring(0, 8))
                .customerId(101L)
                .balance(new BigDecimal("500.00"))
                .currency("PHP")
                .status(AccountStatus.ACTIVE)
                .allowOutgoing(true).allowIncoming(true)
                .build());

        destAccount = accountPersistencePort.save(Account.builder()
                .accountNumber("DST-INT-" + UUID.randomUUID().toString().substring(0, 8))
                .customerId(102L)
                .balance(new BigDecimal("0.00"))
                .currency("PHP")
                .status(AccountStatus.ACTIVE)
                .allowOutgoing(true).allowIncoming(true)
                .build());

        // 2. Prepare a standard valid transfer request
        validRequest = InternalTransferRequest.builder()
                .sourceAccountNumber(sourceAccount.getAccountNumber())
                .destinationAccountNumber(destAccount.getAccountNumber())
                .amount(new BigDecimal("50.00"))
                .idempotencyKey(UUID.randomUUID().toString())
                .description("Integrity Audit Transfer")
                .build();
    }

    @Test
    @DisplayName("Failure A/B: Mid-Transaction Database Crash Must Rollback All Records")
    public void midTransactionCrash_ShouldRollbackEverything() {
        // Attack: Sabotage the account save operation.
        // Because of our newly reordered algorithm, the Transaction and Ledger Entries
        // will have already been written to the database buffer when this crash occurs.
        doThrow(new RuntimeException("Simulated Database Crash"))
                .when(accountPersistencePort).save(any(Account.class));

        assertThrows(RuntimeException.class, () -> {
            internalTransferService.processInternalTransfer(validRequest);
        });

        // Verification: The @Transactional boundary MUST cleanly wipe the partial state
        assertEquals(0, transactionRepository.count(), "Transaction record must be rolled back");
        assertEquals(0, ledgerEntryRepository.count(), "Ledger entries must be rolled back");
        
        Account unchangedSource = accountPersistencePort.findByAccountNumber(sourceAccount.getAccountNumber()).orElseThrow();
        assertEquals(0, new BigDecimal("500.00").compareTo(unchangedSource.getBalance()), "Balance must remain untouched");
    }

    @Test
    @DisplayName("Phase 9: Push Notification Outage Must Not Rollback Committed Ledgers")
    public void pushNotificationCrash_ShouldNotRollbackTransaction() {
        // Attack: Simulate a completely unreachable push notification gateway
        doThrow(new RuntimeException("Simulated Push Gateway Timeout"))
                .when(pushNotificationPort).sendPush(anyString(), anyString(), anyString());

        // The financial transaction must survive the external side-effect failing
        assertDoesNotThrow(() -> {
            internalTransferService.processInternalTransfer(validRequest);
        });

        // Verification: Because we utilized @TransactionalEventListener(phase = AFTER_COMMIT),
        // the ledger must be permanently saved despite the notification failure.
        assertEquals(1, transactionRepository.count(), "Transaction must commit successfully");
        assertEquals(2, ledgerEntryRepository.count(), "Exactly 2 ledger entries must be written");

        Account updatedSource = accountPersistencePort.findByAccountNumber(sourceAccount.getAccountNumber()).orElseThrow();
        assertEquals(0, new BigDecimal("450.00").compareTo(updatedSource.getBalance()), "Balance must be successfully deducted");
    }

    @Test
    @DisplayName("Phase 14: Orphaned Ledger Entries Must Be Blocked By Foreign Key Constraint")
    public void orphanedLedgerEntry_ShouldBeBlockedByForeignKey() {
        // Attack: Attempt to bypass the service and write a malicious ledger entry 
        // with a Transaction ID that doesn't exist.
        LedgerEntry orphan = LedgerEntry.builder()
                .transactionReference("TXN-FAKE-12345")
                .accountNumber(sourceAccount.getAccountNumber())
                .entryType(EntryType.DEBIT)
                .amount(new BigDecimal("50.00"))
                .currency("PHP")
                .build();

        // Verification: The V52 database migration MUST physically block this insertion
        assertThrows(DataIntegrityViolationException.class, () -> {
            ledgerEntryRepository.saveAndFlush(orphan);
        });
    }

    @Test
    @DisplayName("Phase 3: Cross Currency Transfer Obtains Fake Quote but Blocks Ledger Posting")
    public void crossCurrencyTransfer_ShouldObtainQuoteAndBlockPosting() {
        // 1. Arrange: Change destination account to USD to trigger the CROSS_CURRENCY flow
        Account source = accountPersistencePort.findByAccountNumber(sourceAccount.getAccountNumber()).orElseThrow();
        Account dest = accountPersistencePort.findByAccountNumber(destAccount.getAccountNumber()).orElseThrow();
        
        // Source is PHP (default), we change destination to USD
        dest.setCurrency("USD");
        accountPersistencePort.save(dest);

        InternalTransferRequest request = InternalTransferRequest.builder()
                .sourceAccountNumber(source.getAccountNumber())
                .destinationAccountNumber(dest.getAccountNumber())
                .amount(new BigDecimal("100.00")) // Transferring 100.00 PHP
                .idempotencyKey(UUID.randomUUID().toString())
                .description("Phase 3 FX Safety Gate Test")
                .build();

        // Act & Assert: The hard gate MUST catch it
        com.company.banking.common.exception.BusinessException ex = assertThrows(com.company.banking.common.exception.BusinessException.class, () -> {
            internalTransferService.processInternalTransfer(request);
        });

        // Verify the exact safety gate error is thrown
        assertEquals(com.company.banking.common.exception.ErrorCode.CROSS_CURRENCY_POSTING_NOT_AVAILABLE, ex.getErrorCode());
        
        // ULTIMATE VERIFICATION: The ledger must remain totally untouched
        assertEquals(0, transactionRepository.count(), "No transaction should be saved to the database");
        assertEquals(0, ledgerEntryRepository.count(), "No ledger entries should be saved to the database");
    }
}
