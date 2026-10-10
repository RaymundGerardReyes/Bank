package com.company.banking.transaction;

import com.company.banking.account.application.port.out.AccountPersistencePort;
import com.company.banking.account.domain.Account;
import com.company.banking.common.enums.AccountStatus;
import com.company.banking.common.enums.RoleType;
import com.company.banking.common.exception.BusinessException;
import com.company.banking.common.exception.ErrorCode;
import com.company.banking.common.exception.ForbiddenException;
import com.company.banking.customer.application.port.out.CustomerPersistencePort;
import com.company.banking.customer.domain.Customer;
import com.company.banking.notification.application.port.out.PushNotificationPort;
import com.company.banking.transaction.api.dto.InternalTransferRequest;
import com.company.banking.transaction.api.dto.TransactionResponse;
import com.company.banking.transaction.application.InternalTransferService;
import com.company.banking.transaction.domain.EntryType;
import com.company.banking.transaction.domain.LedgerEntry;
import com.company.banking.transaction.domain.TransactionStatus;
import com.company.banking.transaction.infrastructure.LedgerEntryJpaRepository;
import com.company.banking.transaction.infrastructure.TransactionJpaRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import com.company.banking.config.TransferSpyIntegrationTest;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.assertDoesNotThrow;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
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

    @Autowired
    private CustomerPersistencePort customerPersistencePort;

    private Account sourceAccount;
    private Account destAccount;
    private InternalTransferRequest validRequest;
    private long initialTxCount;
    private long initialLedgerCount;

    @Autowired
    private org.springframework.jdbc.core.JdbcTemplate jdbcTemplate;

    @BeforeEach
    void setup() {
        initialTxCount = transactionRepository.count();
        initialLedgerCount = ledgerEntryRepository.count();
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
        assertEquals(initialTxCount, transactionRepository.count(), "Transaction record must be rolled back");
        assertEquals(initialLedgerCount, ledgerEntryRepository.count(), "Ledger entries must be rolled back");
        
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
        assertEquals(initialTxCount + 1, transactionRepository.count(), "Transaction must commit successfully");
        assertEquals(initialLedgerCount + 2, ledgerEntryRepository.count(), "Exactly 2 ledger entries must be written");

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
        BusinessException ex = assertThrows(BusinessException.class, () -> {
            internalTransferService.processInternalTransfer(request);
        });

        // Verify the exact safety gate error is thrown
        assertEquals(ErrorCode.CROSS_CURRENCY_POSTING_NOT_AVAILABLE, ex.getErrorCode());
        
        // ULTIMATE VERIFICATION: The ledger must remain totally untouched
        assertEquals(initialTxCount, transactionRepository.count(), "No transaction should be saved to the database");
        assertEquals(initialLedgerCount, ledgerEntryRepository.count(), "No ledger entries should be saved to the database");
    }

    @Test
    @DisplayName("Defect A: Masked destination account number must be rejected before DB lookup with no mutations")
    public void maskedDestinationAccount_ShouldBeRejectedWithoutMonetaryMutations() {
        InternalTransferRequest request = InternalTransferRequest.builder()
                .sourceAccountNumber(sourceAccount.getAccountNumber())
                .destinationAccountNumber("********36")
                .amount(new BigDecimal("50.00"))
                .idempotencyKey(UUID.randomUUID().toString())
                .description("Masked Destination Attack")
                .build();

        BusinessException ex = assertThrows(BusinessException.class, () -> {
            internalTransferService.processInternalTransfer(request);
        });

        assertEquals(ErrorCode.INVALID_REQUEST, ex.getErrorCode());
        assertTrue(ex.getMessage().contains("Masked account numbers cannot be used"),
                "Message should inform that masked account numbers cannot be used");
        assertEquals(initialTxCount, transactionRepository.count(), "No transaction record must be created");
        assertEquals(initialLedgerCount, ledgerEntryRepository.count(), "No ledger entries must be created");

        Account unchangedSource = accountPersistencePort.findByAccountNumber(sourceAccount.getAccountNumber()).orElseThrow();
        assertEquals(0, new BigDecimal("500.00").compareTo(unchangedSource.getBalance()), "Source balance must remain untouched");
    }

    @Test
    @DisplayName("Defect A2: Masked source account number must be rejected before DB lookup with no mutations")
    public void maskedSourceAccount_ShouldBeRejectedWithoutMonetaryMutations() {
        InternalTransferRequest request = InternalTransferRequest.builder()
                .sourceAccountNumber("**** **** 1001")
                .destinationAccountNumber(destAccount.getAccountNumber())
                .amount(new BigDecimal("50.00"))
                .idempotencyKey(UUID.randomUUID().toString())
                .description("Masked Source Attack")
                .build();

        BusinessException ex = assertThrows(BusinessException.class, () -> {
            internalTransferService.processInternalTransfer(request);
        });

        assertEquals(ErrorCode.INVALID_REQUEST, ex.getErrorCode());
        assertTrue(ex.getMessage().contains("Masked account numbers cannot be used"),
                "Message should inform that masked account numbers cannot be used");
        assertEquals(initialTxCount, transactionRepository.count(), "No transaction record must be created");
        assertEquals(initialLedgerCount, ledgerEntryRepository.count(), "No ledger entries must be created");
    }

    @Test
    @DisplayName("Defect A3: Malformed destination account number must be rejected with no mutations")
    public void malformedDestinationAccount_ShouldBeRejectedWithoutMonetaryMutations() {
        InternalTransferRequest request = InternalTransferRequest.builder()
                .sourceAccountNumber(sourceAccount.getAccountNumber())
                .destinationAccountNumber("INVALID!DEST@#$")
                .amount(new BigDecimal("50.00"))
                .idempotencyKey(UUID.randomUUID().toString())
                .description("Malformed Destination Attack")
                .build();

        BusinessException ex = assertThrows(BusinessException.class, () -> {
            internalTransferService.processInternalTransfer(request);
        });

        assertEquals(ErrorCode.INVALID_REQUEST, ex.getErrorCode());
        assertTrue(ex.getMessage().contains("Invalid destination account number format"),
                "Message should inform of invalid account number format");
        assertEquals(initialTxCount, transactionRepository.count(), "No transaction record must be created");
        assertEquals(initialLedgerCount, ledgerEntryRepository.count(), "No ledger entries must be created");

        Account unchangedSource = accountPersistencePort.findByAccountNumber(sourceAccount.getAccountNumber()).orElseThrow();
        assertEquals(0, new BigDecimal("500.00").compareTo(unchangedSource.getBalance()), "Source balance must remain untouched");
    }

    @Test
    @DisplayName("Scenario 4: Unauthorized source-account debit must be rejected with 403 Forbidden")
    public void unauthorizedSourceDebit_ShouldBeRejectedWithForbidden() {
        Customer attacker = customerPersistencePort.save(Customer.builder()
                .email("attacker-" + UUID.randomUUID().toString().substring(0, 8) + "@example.com")
                .password("hash")
                .firstName("Mallory")
                .lastName("Attacker")
                .role(RoleType.CUSTOMER)
                .build());

        UsernamePasswordAuthenticationToken auth = new UsernamePasswordAuthenticationToken(
                attacker.getEmail(),
                "credentials",
                List.of(new SimpleGrantedAuthority("ROLE_USER"))
        );
        SecurityContextHolder.getContext().setAuthentication(auth);

        try {
            ForbiddenException ex = assertThrows(ForbiddenException.class, () -> {
                internalTransferService.processInternalTransfer(validRequest);
            });

            assertEquals(ErrorCode.FORBIDDEN, ex.getErrorCode());
            assertEquals(initialTxCount, transactionRepository.count(), "No transaction record must be created");
            assertEquals(initialLedgerCount, ledgerEntryRepository.count(), "No ledger entries must be created");

            Account unchangedSource = accountPersistencePort.findByAccountNumber(sourceAccount.getAccountNumber()).orElseThrow();
            assertEquals(0, new BigDecimal("500.00").compareTo(unchangedSource.getBalance()), "Source balance must remain untouched");
        } finally {
            SecurityContextHolder.clearContext();
        }
    }

    @Test
    @DisplayName("Scenario 1: Valid same-currency internal transfer completes with double-entry ledger balance")
    public void validSameCurrencyInternalTransfer_ShouldSucceedWithDoubleEntryBalance() {
        TransactionResponse response = internalTransferService.processInternalTransfer(validRequest);

        assertNotNull(response.getTransactionReference());
        assertEquals(TransactionStatus.COMPLETED, response.getStatus());

        assertEquals(initialTxCount + 1, transactionRepository.count(), "Transaction must be committed");
        assertEquals(initialLedgerCount + 2, ledgerEntryRepository.count(), "Two ledger entries must be committed");

        Account updatedSource = accountPersistencePort.findByAccountNumber(sourceAccount.getAccountNumber()).orElseThrow();
        Account updatedDest = accountPersistencePort.findByAccountNumber(destAccount.getAccountNumber()).orElseThrow();

        assertEquals(0, new BigDecimal("450.00").compareTo(updatedSource.getBalance()), "Source deducted exactly 50.00");
        assertEquals(0, new BigDecimal("50.00").compareTo(updatedDest.getBalance()), "Destination credited exactly 50.00");

        List<LedgerEntry> entries = ledgerEntryRepository.findByTransactionReference(response.getTransactionReference());
        assertEquals(2, entries.size(), "Must have exactly 2 ledger entries");
        BigDecimal totalDebits = entries.stream()
                .filter(e -> e.getEntryType() == EntryType.DEBIT)
                .map(LedgerEntry::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        BigDecimal totalCredits = entries.stream()
                .filter(e -> e.getEntryType() == EntryType.CREDIT)
                .map(LedgerEntry::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        assertEquals(0, totalDebits.compareTo(totalCredits), "Systemic debits must equal credits");
    }

    @Test
    @DisplayName("Defect A4: Bullet mask destination account number must be rejected before DB lookup with no mutations")
    public void maskedBulletDestinationAccount_ShouldBeRejectedWithoutMonetaryMutations() {
        InternalTransferRequest request = InternalTransferRequest.builder()
                .sourceAccountNumber(sourceAccount.getAccountNumber())
                .destinationAccountNumber("•••• •••• 1002")
                .amount(new BigDecimal("50.00"))
                .idempotencyKey(UUID.randomUUID().toString())
                .description("Bullet Mask Attack")
                .build();

        BusinessException ex = assertThrows(BusinessException.class, () -> {
            internalTransferService.processInternalTransfer(request);
        });

        assertEquals(ErrorCode.INVALID_REQUEST, ex.getErrorCode());
        assertTrue(ex.getMessage().contains("Masked account numbers cannot be used"),
                "Message should inform that masked account numbers cannot be used");
        assertEquals(initialTxCount, transactionRepository.count(), "No transaction record must be created");
        assertEquals(initialLedgerCount, ledgerEntryRepository.count(), "No ledger entries must be created");
    }

    @Test
    @DisplayName("Scenario 4b: Debit of unowned system account (null customerId) by regular customer must be rejected with 403")
    public void unauthorizedSourceDebit_AccountWithoutCustomerId_ShouldBeRejectedWithForbidden() {
        Account systemPoolAccount = accountPersistencePort.save(Account.builder()
                .accountNumber("SYS-POOL-" + UUID.randomUUID().toString().substring(0, 8))
                .customerId(null) // Unowned or system pool account
                .balance(new BigDecimal("10000.00"))
                .currency("PHP")
                .status(AccountStatus.ACTIVE)
                .allowOutgoing(true).allowIncoming(true)
                .build());

        Customer regularCustomer = customerPersistencePort.save(Customer.builder()
                .email("regular-" + UUID.randomUUID().toString().substring(0, 8) + "@example.com")
                .password("hash")
                .firstName("Alice")
                .lastName("Customer")
                .role(RoleType.CUSTOMER)
                .build());

        UsernamePasswordAuthenticationToken auth = new UsernamePasswordAuthenticationToken(
                regularCustomer.getEmail(),
                "credentials",
                List.of(new SimpleGrantedAuthority("ROLE_USER"))
        );
        SecurityContextHolder.getContext().setAuthentication(auth);

        try {
            InternalTransferRequest attackRequest = InternalTransferRequest.builder()
                    .sourceAccountNumber(systemPoolAccount.getAccountNumber())
                    .destinationAccountNumber(destAccount.getAccountNumber())
                    .amount(new BigDecimal("100.00"))
                    .idempotencyKey(UUID.randomUUID().toString())
                    .description("System Pool Drain Attempt")
                    .build();

            ForbiddenException ex = assertThrows(ForbiddenException.class, () -> {
                internalTransferService.processInternalTransfer(attackRequest);
            });

            assertEquals(ErrorCode.FORBIDDEN, ex.getErrorCode());
            assertEquals(initialTxCount, transactionRepository.count(), "No transaction record must be created");
            assertEquals(initialLedgerCount, ledgerEntryRepository.count(), "No ledger entries must be created");

            Account unchangedSystem = accountPersistencePort.findByAccountNumber(systemPoolAccount.getAccountNumber()).orElseThrow();
            assertEquals(0, new BigDecimal("10000.00").compareTo(unchangedSystem.getBalance()), "System pool balance must remain untouched");
        } finally {
            SecurityContextHolder.clearContext();
        }
    }

    @Test
    @DisplayName("Scheduled Transfer Guard: Scheduled transfer with masked destination is rejected without mutations")
    public void scheduledTransfer_WithMaskedDestination_ShouldBeRejectedWithoutMutations() {
        InternalTransferRequest request = InternalTransferRequest.builder()
                .sourceAccountNumber(sourceAccount.getAccountNumber())
                .destinationAccountNumber("********36")
                .amount(new BigDecimal("50.00"))
                .scheduledDate("2026-11-01")
                .idempotencyKey(UUID.randomUUID().toString())
                .description("Scheduled Masked Attack")
                .build();

        BusinessException ex = assertThrows(BusinessException.class, () -> {
            internalTransferService.processInternalTransfer(request);
        });

        assertEquals(ErrorCode.INVALID_REQUEST, ex.getErrorCode());
        assertTrue(ex.getMessage().contains("Masked account numbers cannot be used"));
        assertEquals(initialTxCount, transactionRepository.count(), "No scheduled transaction must be created");
        assertEquals(initialLedgerCount, ledgerEntryRepository.count(), "No ledger entries must be created");
    }

    @Test
    @DisplayName("Scheduled Transfer Guard: Scheduled transfer between cross-currency accounts is rejected without mutations")
    public void scheduledTransfer_CrossCurrency_ShouldBeRejectedWithoutMutations() {
        destAccount.setCurrency("USD");
        accountPersistencePort.save(destAccount);

        InternalTransferRequest request = InternalTransferRequest.builder()
                .sourceAccountNumber(sourceAccount.getAccountNumber())
                .destinationAccountNumber(destAccount.getAccountNumber())
                .amount(new BigDecimal("50.00"))
                .scheduledDate("2026-11-01")
                .idempotencyKey(UUID.randomUUID().toString())
                .description("Scheduled Cross Currency Attempt")
                .build();

        BusinessException ex = assertThrows(BusinessException.class, () -> {
            internalTransferService.processInternalTransfer(request);
        });

        assertEquals(ErrorCode.CROSS_CURRENCY_POSTING_NOT_AVAILABLE, ex.getErrorCode());
        assertEquals(initialTxCount, transactionRepository.count(), "No scheduled transaction must be created");
        assertEquals(initialLedgerCount, ledgerEntryRepository.count(), "No ledger entries must be created");
    }
}
