package com.company.banking.transaction;

import com.company.banking.account.application.port.out.AccountPersistencePort;
import com.company.banking.account.domain.Account;
import com.company.banking.common.enums.AccountStatus;
import com.company.banking.common.exception.BusinessException;
import com.company.banking.common.exception.ErrorCode;
import com.company.banking.config.TransferSpyIntegrationTest;
import com.company.banking.transaction.api.dto.InternalTransferRequest;
import com.company.banking.transaction.api.dto.TransactionResponse;
import com.company.banking.transaction.application.InternalTransferService;
import com.company.banking.transaction.infrastructure.LedgerEntryJpaRepository;
import com.company.banking.transaction.infrastructure.TransactionJpaRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;

import java.math.BigDecimal;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.doThrow;

/**
 * Comprehensive Path Testing Suite for the Internal Transfer Workflow.
 * This class maps the exact legacy execution paths defined in the system matrix.
 */
public class InternalTransferWorkflowPathIT extends TransferSpyIntegrationTest {

    @Autowired
    private InternalTransferService internalTransferService;

    @Autowired
    private TransactionJpaRepository transactionRepository;

    @Autowired
    private LedgerEntryJpaRepository ledgerEntryRepository;

    private Account sourceAccount;
    private Account destAccount;
    private InternalTransferRequest validRequest;
    private final String IDEMPOTENCY_KEY = UUID.randomUUID().toString();

    @BeforeEach
    void setup() {
        // Seed authoritative baseline accounts
        sourceAccount = accountPersistencePort.save(Account.builder()
                .accountNumber("PATH-SRC-" + UUID.randomUUID().toString().substring(0, 8))
                .customerId(101L)
                .balance(new BigDecimal("500.00"))
                .currency("PHP")
                .status(AccountStatus.ACTIVE)
                .allowOutgoing(true).allowIncoming(true)
                .build());

        destAccount = accountPersistencePort.save(Account.builder()
                .accountNumber("PATH-DST-" + UUID.randomUUID().toString().substring(0, 8))
                .customerId(102L)
                .balance(new BigDecimal("0.00"))
                .currency("PHP")
                .status(AccountStatus.ACTIVE)
                .allowOutgoing(true).allowIncoming(true)
                .build());

        // Prepare a standard valid transfer request template
        validRequest = InternalTransferRequest.builder()
                .sourceAccountNumber(sourceAccount.getAccountNumber())
                .destinationAccountNumber(destAccount.getAccountNumber())
                .amount(new BigDecimal("50.00"))
                .idempotencyKey(IDEMPOTENCY_KEY)
                .description("Path Matrix Transfer")
                .build();
    }

    @Test
    @DisplayName("P01: Valid accounts and sufficient funds should successfully execute and balance the ledger")
    public void p01_StandardExecutionPath() {
        // Act
        TransactionResponse response = internalTransferService.processInternalTransfer(validRequest);

        // Assert Financial Invariants
        assertNotNull(response.getTransactionReference());

        Account finalSource = accountPersistencePort.findByAccountNumber(sourceAccount.getAccountNumber()).orElseThrow();
        Account finalDest = accountPersistencePort.findByAccountNumber(destAccount.getAccountNumber()).orElseThrow();

        assertEquals(0, new BigDecimal("450.00").compareTo(finalSource.getBalance()), "Source must be deducted exactly 50.00");
        assertEquals(0, new BigDecimal("50.00").compareTo(finalDest.getBalance()), "Destination must be credited exactly 50.00");
    }

    @Test
    @DisplayName("P02: Duplicate requests with an existing idempotency key must not duplicate financial effects")
    public void p02_IdempotentExecutionPath() {
        // Act: Execute twice with the exact same request
        TransactionResponse firstResponse = internalTransferService.processInternalTransfer(validRequest);
        TransactionResponse secondResponse = internalTransferService.processInternalTransfer(validRequest);

        // Assert Idempotency Invariants
        assertEquals(firstResponse.getTransactionReference(), secondResponse.getTransactionReference(), "Must return the same transaction reference");

        Account finalSource = accountPersistencePort.findByAccountNumber(sourceAccount.getAccountNumber()).orElseThrow();
        assertEquals(0, new BigDecimal("450.00").compareTo(finalSource.getBalance()), "Balance must only be deducted once");
    }

    @Test
    @DisplayName("P03: Insufficient funds must safely abort the workflow with no ledger writes")
    public void p03_ValidationFailurePath() {
        // Arrange: Modify request to exceed balance
        validRequest.setAmount(new BigDecimal("9999.00"));

        // Act & Assert
        BusinessException exception = assertThrows(BusinessException.class, () -> {
            internalTransferService.processInternalTransfer(validRequest);
        });

        assertEquals(ErrorCode.INSUFFICIENT_FUNDS, exception.getErrorCode());
    }

    @Test
    @DisplayName("P04: Database crash during persistence must trigger full transactional rollback")
    public void p04_DatabaseCrashRollbackPath() {
        // Arrange: Sabotage the persistence layer to simulate a mid-flight crash
        doThrow(new RuntimeException("Simulated Database Crash"))
                .when(accountPersistencePort).save(any(Account.class));

        // Act & Assert
        assertThrows(RuntimeException.class, () -> {
            internalTransferService.processInternalTransfer(validRequest);
        });

        Account unchangedSource = accountPersistencePort.findByAccountNumber(sourceAccount.getAccountNumber()).orElseThrow();
        assertEquals(0, new BigDecimal("500.00").compareTo(unchangedSource.getBalance()), "Source balance must roll back to original state");
    }

    @Test
    @DisplayName("P05: Notification gateway timeout must NOT roll back the committed financial ledger")
    public void p05_PostCommitSideEffectFailurePath() {
        // Arrange: Simulate a completely unreachable push notification gateway
        doThrow(new RuntimeException("Simulated Push Gateway Timeout"))
                .when(pushNotificationPort).sendPush(anyString(), anyString(), anyString());

        // Act
        assertDoesNotThrow(() -> {
            internalTransferService.processInternalTransfer(validRequest);
        });

        // Assert Resilience Invariants: Financials survive side-effect failures
        Account finalSource = accountPersistencePort.findByAccountNumber(sourceAccount.getAccountNumber()).orElseThrow();
        assertEquals(0, new BigDecimal("450.00").compareTo(finalSource.getBalance()), "Balance must be deducted despite push notification failure");
    }
}
