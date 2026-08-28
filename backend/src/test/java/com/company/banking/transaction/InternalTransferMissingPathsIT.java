package com.company.banking.transaction;

import com.company.banking.account.domain.Account;
import com.company.banking.common.enums.AccountStatus;
import com.company.banking.common.exception.BusinessException;
import com.company.banking.transaction.api.dto.InternalTransferRequest;
import com.company.banking.transaction.application.InternalTransferService;
import com.company.banking.transaction.domain.Transaction;
import com.company.banking.transaction.domain.TransactionStatus;
import com.company.banking.account.infrastructure.AccountJpaRepository;
import com.company.banking.transaction.infrastructure.TransactionJpaRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@ActiveProfiles("test")
@Transactional // Ensures DB changes rollback after each test
public class InternalTransferMissingPathsIT {

    @Autowired
    private InternalTransferService internalTransferService;

    @Autowired
    private AccountJpaRepository accountRepository;

    @Autowired
    private TransactionJpaRepository transactionRepository;

    private Account sourceAccount;
    private Account destAccount;

    @BeforeEach
    void setUp() {
        // Clear all previous transactions to ensure deterministic test states
        transactionRepository.deleteAll();
        accountRepository.deleteAll();
        
        // Setup default active accounts for testing with VAM permissions explicitly granted
        sourceAccount = Account.builder()
                .accountNumber("ACC-SRC-100")
                .customerId(1L)
                .balance(new BigDecimal("1000.00"))
                .currency("PHP")
                .status(AccountStatus.ACTIVE)
                .allowIncoming(true)
                .allowOutgoing(true)
                .build();
        
        destAccount = Account.builder()
                .accountNumber("ACC-DST-200")
                .customerId(2L)
                .balance(new BigDecimal("500.00"))
                .currency("PHP")
                .status(AccountStatus.ACTIVE)
                .allowIncoming(true)
                .allowOutgoing(true)
                .build();
                
        accountRepository.save(sourceAccount);
        accountRepository.save(destAccount);
    }

    @Test
    @DisplayName("P06: Scheduled Transfer Path - Verifies deferred execution and no immediate balance change")
    void testScheduledTransferPath() {
        // Arrange
        InternalTransferRequest request = InternalTransferRequest.builder()
                .sourceAccountNumber(sourceAccount.getAccountNumber())
                .destinationAccountNumber(destAccount.getAccountNumber())
                .amount(new BigDecimal("100.00"))
                .scheduledDate("2026-09-01") // Needs to be String if request DTO is String
                .idempotencyKey(UUID.randomUUID().toString())
                .build();

        // Act
        internalTransferService.processInternalTransfer(request);

        // Assert
        Transaction savedTx = transactionRepository.findAll().get(0);
        assertEquals(TransactionStatus.SCHEDULED, savedTx.getStatus(), "Transaction should be marked as SCHEDULED");
        
        // Verify no immediate balance mutation occurred
        Account updatedSource = accountRepository.findByAccountNumber(sourceAccount.getAccountNumber()).orElseThrow();
        assertEquals(0, new BigDecimal("1000.00").compareTo(updatedSource.getBalance()), "Balance should not be deducted yet");
    }

    @Test
    @DisplayName("P07: Same-Account Self-Transfer Guard - Prevents transferring to the same account")
    void testSameAccountSelfTransferGuard() {
        // Arrange
        InternalTransferRequest request = InternalTransferRequest.builder()
                .sourceAccountNumber(sourceAccount.getAccountNumber())
                .destinationAccountNumber(sourceAccount.getAccountNumber()) // Same account
                .amount(new BigDecimal("50.00"))
                .idempotencyKey(UUID.randomUUID().toString())
                .build();

        // Act & Assert
        BusinessException exception = assertThrows(BusinessException.class, () -> {
            internalTransferService.processInternalTransfer(request);
        });

        assertEquals("INVALID_REQUEST", exception.getErrorCode().name());
        assertEquals(0, transactionRepository.count(), "No transaction should be saved on failure");
    }

    @Test
    @DisplayName("P08: Suspended Account Guard - Rejects transfers from suspended accounts")
    void testSuspendedAccountGuard() {
        // Arrange
        Account suspendedAccount = Account.builder()
                .accountNumber("ACC-SUSP-300")
                .customerId(3L)
                .balance(new BigDecimal("1000.00"))
                .currency("PHP")
                .status(AccountStatus.SUSPENDED)
                .build();
        accountRepository.save(suspendedAccount);

        InternalTransferRequest request = InternalTransferRequest.builder()
                .sourceAccountNumber(suspendedAccount.getAccountNumber())
                .destinationAccountNumber(destAccount.getAccountNumber())
                .amount(new BigDecimal("100.00"))
                .idempotencyKey(UUID.randomUUID().toString())
                .build();

        // Act & Assert
        BusinessException exception = assertThrows(BusinessException.class, () -> {
            internalTransferService.processInternalTransfer(request);
        });

        assertEquals("ACCOUNT_SUSPENDED", exception.getErrorCode().name());
    }

    @Test
    @DisplayName("P09: Velocity Limit Breach - Ensures daily limits are enforced")
    void testVelocityLimitBreach() {
        // Arrange - The default global limit is 50,000.00 per transfer if todaysTransactions is empty.
        // We set the source account balance high enough so it doesn't fail on INSUFFICIENT_FUNDS.
        sourceAccount.setBalance(new BigDecimal("100000.00"));
        accountRepository.save(sourceAccount);
        
        BigDecimal largeAmount = new BigDecimal("50000.01"); // Breaches the 50,000.00 limit
        
        InternalTransferRequest breachRequest = InternalTransferRequest.builder()
                .sourceAccountNumber(sourceAccount.getAccountNumber())
                .destinationAccountNumber(destAccount.getAccountNumber())
                .amount(largeAmount)
                .idempotencyKey(UUID.randomUUID().toString())
                .build();

        // Act & Assert
        BusinessException exception = assertThrows(BusinessException.class, () -> {
            internalTransferService.processInternalTransfer(breachRequest);
        });

        assertEquals("TRANSFER_VELOCITY_EXCEEDED", exception.getErrorCode().name());
        assertTrue(exception.getMessage().contains("exceeds the daily operational limit"));
    }

    @Test
    @DisplayName("P10: Invalid Destination Account Guard - Rejects transfers to non-existent accounts")
    void testInvalidDestinationAccountGuard() {
        // Arrange
        String invalidDestination = "INVALID-ACC-999";
        InternalTransferRequest request = InternalTransferRequest.builder()
                .sourceAccountNumber(sourceAccount.getAccountNumber())
                .destinationAccountNumber(invalidDestination)
                .amount(new BigDecimal("50.00"))
                .idempotencyKey(UUID.randomUUID().toString())
                .build();

        // Act & Assert
        com.company.banking.common.exception.NotFoundException exception = assertThrows(com.company.banking.common.exception.NotFoundException.class, () -> {
            internalTransferService.processInternalTransfer(request);
        });

        // Verify the exact message we set in the Resolver
        assertEquals("Transfer failed: Destination account '" + invalidDestination + "' does not exist.", exception.getMessage());
        
        // Verify no ledger entries were created
        assertEquals(0, transactionRepository.count(), "No transaction should be saved on 404 failure");
    }
}
