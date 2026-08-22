package com.company.banking.transaction.application;

import com.company.banking.account.application.port.out.AccountPersistencePort;
import com.company.banking.account.domain.Account;
import com.company.banking.common.exception.BusinessException;
import com.company.banking.common.exception.ErrorCode;
import com.company.banking.transaction.application.port.out.LedgerPersistencePort;
import com.company.banking.transaction.domain.Transaction;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyList;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class ZeroBalanceSweepServiceTest {

    @Mock
    private AccountPersistencePort accountPersistencePort;

    @Mock
    private LedgerPersistencePort ledgerPersistencePort;

    @Mock
    private TransactionAccountResolver accountResolver;

    @InjectMocks
    private ZeroBalanceSweepService zeroBalanceSweepService;

    @Test
    public void executeSweepIfNecessary_ShouldReturnEarly_WhenFundsAreSufficient() {
        // Arrange
        Account subAccount = new Account();
        subAccount.setBalance(new BigDecimal("100.00")); // Has 100
        BigDecimal requiredAmount = new BigDecimal("50.00"); // Only needs 50

        // Act
        zeroBalanceSweepService.executeSweepIfNecessary(subAccount, requiredAmount, "Test Context");

        // Assert: Verify no dependencies were called since no sweep was needed
        verifyNoInteractions(accountPersistencePort, ledgerPersistencePort, accountResolver);
    }

    @Test
    public void executeSweepIfNecessary_ShouldThrowException_WhenNoParentAccountExists() {
        // Arrange
        Account subAccount = new Account();
        subAccount.setBalance(new BigDecimal("10.00")); // Needs 50, only has 10
        subAccount.setParentAccountId(null); // No master account to sweep from

        BigDecimal requiredAmount = new BigDecimal("50.00");

        // Act & Assert
        BusinessException exception = assertThrows(BusinessException.class, () -> {
            zeroBalanceSweepService.executeSweepIfNecessary(subAccount, requiredAmount, "Test Context");
        });

        assertEquals(ErrorCode.INSUFFICIENT_FUNDS, exception.getErrorCode());
    }

    @Test
    public void executeSweepIfNecessary_ShouldThrowException_WhenParentHasInsufficientFunds() {
        // Arrange
        Account subAccount = new Account();
        subAccount.setAccountNumber("SUB-123");
        subAccount.setBalance(new BigDecimal("10.00"));
        subAccount.setParentAccountId("PARENT-999"); // Shortfall will be 40.00

        Account parentAccount = new Account();
        parentAccount.setAccountNumber("PARENT-999");
        parentAccount.setBalance(new BigDecimal("20.00")); // Parent only has 20.00, not enough for the 40.00 shortfall

        BigDecimal requiredAmount = new BigDecimal("50.00");

        when(accountResolver.resolveAndAuthorizeSource("PARENT-999")).thenReturn(parentAccount);

        // Act & Assert
        BusinessException exception = assertThrows(BusinessException.class, () -> {
            zeroBalanceSweepService.executeSweepIfNecessary(subAccount, requiredAmount, "Test Context");
        });

        assertEquals(ErrorCode.INSUFFICIENT_FUNDS, exception.getErrorCode());
    }

    @Test
    public void executeSweepIfNecessary_ShouldSweepFunds_WhenParentHasSufficientFunds() {
        // Arrange
        Account subAccount = new Account();
        subAccount.setAccountNumber("SUB-123");
        subAccount.setBalance(new BigDecimal("10.00"));
        subAccount.setCurrency("PHP");
        subAccount.setParentAccountId("PARENT-999"); // Shortfall will be 40.00

        Account parentAccount = new Account();
        parentAccount.setAccountNumber("PARENT-999");
        parentAccount.setBalance(new BigDecimal("100.00")); // Parent has plenty of funds
        parentAccount.setCurrency("PHP");

        BigDecimal requiredAmount = new BigDecimal("50.00");

        when(accountResolver.resolveAndAuthorizeSource("PARENT-999")).thenReturn(parentAccount);

        // Act
        zeroBalanceSweepService.executeSweepIfNecessary(subAccount, requiredAmount, "Test Context");

        // Assert
        // Parent balance: 100.00 - 40.00 shortfall = 60.00
        assertEquals(new BigDecimal("60.00"), parentAccount.getBalance());
        // Sub balance: 10.00 + 40.00 shortfall = 50.00
        assertEquals(new BigDecimal("50.00"), subAccount.getBalance());

        // Verify that the updated balances were saved to the database
        verify(accountPersistencePort).save(parentAccount);
        verify(accountPersistencePort).save(subAccount);

        // Verify that the ledger entries and overarching sweep transaction were recorded
        verify(ledgerPersistencePort).saveLedgerEntries(anyList());
        verify(ledgerPersistencePort).save(any(Transaction.class));
    }
}
