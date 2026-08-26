package com.company.banking.transaction;

import com.company.banking.account.application.port.out.AccountPersistencePort;
import com.company.banking.account.domain.Account;
import com.company.banking.common.enums.AccountStatus;
import com.company.banking.common.exception.BusinessException;
import com.company.banking.common.exception.ConflictException;
import com.company.banking.common.exception.ErrorCode;
import com.company.banking.config.BaseIntegrationTest;
import com.company.banking.notification.application.port.out.PushNotificationPort;
import com.company.banking.transaction.api.dto.DepositRequest;
import com.company.banking.transaction.api.dto.TransactionResponse;
import com.company.banking.transaction.api.dto.WithdrawRequest;
import com.company.banking.transaction.application.DepositService;
import com.company.banking.transaction.application.WithdrawService;
import com.company.banking.transaction.domain.TransactionStatus;
import com.company.banking.transaction.infrastructure.TransactionJpaRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.security.test.context.support.WithMockUser;

import java.math.BigDecimal;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@ActiveProfiles("test")
@Transactional
@WithMockUser(username = "test-user")
public class DepositWithdrawWorkflowPathIT {

    @Autowired
    private DepositService depositService;

    @Autowired
    private WithdrawService withdrawService;

    @Autowired
    private AccountPersistencePort accountPersistencePort;

    @Autowired
    private TransactionJpaRepository transactionRepository;

    @MockitoBean
    private PushNotificationPort pushNotificationPort;

    private Account depositAccount;
    private Account withdrawAccount;

    @BeforeEach
    void setUp() {
        org.springframework.security.core.context.SecurityContextHolder.getContext().setAuthentication(
                new org.springframework.security.authentication.UsernamePasswordAuthenticationToken("test-user", "password")
        );

        depositAccount = accountPersistencePort.save(Account.builder()
                .accountNumber("DEP-ACC-" + UUID.randomUUID().toString().substring(0, 8))
                .customerId(401L)
                .balance(new BigDecimal("100.00"))
                .currency("PHP")
                .status(AccountStatus.ACTIVE)
                .allowOutgoing(true).allowIncoming(true)
                .build());

        withdrawAccount = accountPersistencePort.save(Account.builder()
                .accountNumber("WTH-ACC-" + UUID.randomUUID().toString().substring(0, 8))
                .customerId(402L)
                .balance(new BigDecimal("500.00"))
                .currency("PHP")
                .status(AccountStatus.ACTIVE)
                .allowOutgoing(true).allowIncoming(true)
                .build());
    }

    @org.junit.jupiter.api.AfterEach
    void tearDown() {
        org.springframework.security.core.context.SecurityContextHolder.clearContext();
    }

    @Test
    @DisplayName("P01: Deposit Golden Path - Correctly updates balance and writes transaction")
    void testDepositGoldenPath() {
        // Arrange
        DepositRequest request = DepositRequest.builder()
                .accountNumber(depositAccount.getAccountNumber())
                .amount(new BigDecimal("500.00"))
                .idempotencyKey(UUID.randomUUID().toString())
                .build();

        // Act
        TransactionResponse response = depositService.deposit(request);

        // Assert
        Account updatedAccount = accountPersistencePort.findByAccountNumber(depositAccount.getAccountNumber()).orElseThrow();
        assertEquals(0, new BigDecimal("600.00").compareTo(updatedAccount.getBalance()));
        
        assertEquals(TransactionStatus.COMPLETED, response.getStatus());
        assertTrue(transactionRepository.findAll().stream().anyMatch(tx -> tx.getTransactionReference().equals(response.getTransactionReference())));
    }

    @Test
    @DisplayName("P02: Deposit Idempotency Guard - Prevents double-crediting on retries")
    void testDepositIdempotencyGuard() {
        // Arrange
        String sharedIdempotencyKey = "IDEMP-DEP-12345";
        DepositRequest request = DepositRequest.builder()
                .accountNumber(depositAccount.getAccountNumber())
                .amount(new BigDecimal("500.00"))
                .idempotencyKey(sharedIdempotencyKey)
                .build();

        // Act - First successful deposit
        depositService.deposit(request);

        // Assert - Second attempt throws ConflictException
        assertThrows(ConflictException.class, () -> {
            depositService.deposit(request);
        });

        // Verify balance was only credited once
        Account updatedAccount = accountPersistencePort.findByAccountNumber(depositAccount.getAccountNumber()).orElseThrow();
        assertEquals(0, new BigDecimal("600.00").compareTo(updatedAccount.getBalance()));
    }

    @Test
    @DisplayName("P03: Withdrawal Golden Path - Correctly deducts balance")
    void testWithdrawalGoldenPath() {
        // Arrange
        WithdrawRequest request = WithdrawRequest.builder()
                .accountNumber(withdrawAccount.getAccountNumber())
                .amount(new BigDecimal("200.00"))
                .idempotencyKey(UUID.randomUUID().toString())
                .build();

        // Act
        TransactionResponse response = withdrawService.withdraw(request);

        // Assert
        Account updatedAccount = accountPersistencePort.findByAccountNumber(withdrawAccount.getAccountNumber()).orElseThrow();
        assertEquals(0, new BigDecimal("300.00").compareTo(updatedAccount.getBalance()));
        
        assertEquals(TransactionStatus.COMPLETED, response.getStatus());
        assertTrue(transactionRepository.findAll().stream().anyMatch(tx -> tx.getTransactionReference().equals(response.getTransactionReference())));
    }

    @Test
    @DisplayName("P04: Insufficient Funds Withdrawal Guard - Prevents overdrafting")
    void testInsufficientFundsWithdrawalGuard() {
        // Arrange - Withdraw account starts with 500
        WithdrawRequest request = WithdrawRequest.builder()
                .accountNumber(withdrawAccount.getAccountNumber())
                .amount(new BigDecimal("9999.00"))
                .idempotencyKey(UUID.randomUUID().toString())
                .build();

        // Act & Assert
        BusinessException exception = assertThrows(BusinessException.class, () -> {
            withdrawService.withdraw(request);
        });

        assertEquals(ErrorCode.INSUFFICIENT_FUNDS, exception.getErrorCode());

        // Verify balance is unchanged
        Account updatedAccount = accountPersistencePort.findByAccountNumber(withdrawAccount.getAccountNumber()).orElseThrow();
        assertEquals(0, new BigDecimal("500.00").compareTo(updatedAccount.getBalance()));
    }

    @Test
    @DisplayName("P05: Withdrawal Idempotency Guard - Prevents double-debiting on ATM retries")
    void testWithdrawalIdempotencyGuard() {
        // Arrange
        String sharedIdempotencyKey = "IDEMP-WTH-54321";

        WithdrawRequest request = WithdrawRequest.builder()
                .accountNumber(withdrawAccount.getAccountNumber())
                .amount(new BigDecimal("100.00"))
                .idempotencyKey(sharedIdempotencyKey)
                .build();

        // Act - First successful withdrawal
        withdrawService.withdraw(request);

        // Assert - Second attempt throws exception
        assertThrows(ConflictException.class, () -> {
            withdrawService.withdraw(request);
        });

        // Verify balance was only debited once
        Account updatedAccount = accountPersistencePort.findByAccountNumber(withdrawAccount.getAccountNumber()).orElseThrow();
        assertEquals(0, new BigDecimal("400.00").compareTo(updatedAccount.getBalance()));
    }
}
