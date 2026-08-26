package com.company.banking.transaction;

import com.company.banking.account.application.port.out.AccountPersistencePort;
import com.company.banking.account.domain.Account;
import com.company.banking.common.enums.AccountStatus;
import com.company.banking.common.exception.BusinessException;
import com.company.banking.common.exception.ErrorCode;
import com.company.banking.config.BaseIntegrationTest;
import com.company.banking.transaction.application.ZeroBalanceSweepService;
import com.company.banking.transaction.domain.LedgerEntry;
import com.company.banking.transaction.infrastructure.LedgerEntryJpaRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;

public class ZeroBalanceSweepPathIT extends BaseIntegrationTest {

    @Autowired
    private ZeroBalanceSweepService zeroBalanceSweepService;

    @Autowired
    private AccountPersistencePort accountPersistencePort;

    @Autowired
    private LedgerEntryJpaRepository ledgerRepository;

    private Account masterAccount;
    private Account subAccount;
    private Account standardAccount;

    @BeforeEach
    void setUp() {
        String masterNo = "VAM-MASTER-" + UUID.randomUUID().toString().substring(0, 8);
        String subNo = "VAM-SUB-" + UUID.randomUUID().toString().substring(0, 8);
        String stdNo = "STD-ACC-" + UUID.randomUUID().toString().substring(0, 8);

        masterAccount = accountPersistencePort.save(Account.builder()
                .accountNumber(masterNo)
                .customerId(201L)
                .balance(new BigDecimal("1000.00"))
                .currency("PHP")
                .status(AccountStatus.ACTIVE)
                .allowOutgoing(true).allowIncoming(true)
                .build());

        subAccount = accountPersistencePort.save(Account.builder()
                .accountNumber(subNo)
                .customerId(201L)
                .balance(new BigDecimal("50.00"))
                .currency("PHP")
                .status(AccountStatus.ACTIVE)
                .parentAccountId(masterNo)
                .allowOutgoing(true).allowIncoming(true)
                .build());

        standardAccount = accountPersistencePort.save(Account.builder()
                .accountNumber(stdNo)
                .customerId(202L)
                .balance(BigDecimal.ZERO)
                .currency("PHP")
                .status(AccountStatus.ACTIVE)
                .allowOutgoing(true).allowIncoming(true)
                .build());
    }

    @Test
    @DisplayName("P01: JIT Sweep Golden Path — Sub-Account Fully Funded by Master")
    void testJitSweepGoldenPath() {
        BigDecimal requiredAmount = new BigDecimal("200.00");

        zeroBalanceSweepService.executeSweepIfNecessary(subAccount, requiredAmount, "TXN-123");

        Account updatedMaster = accountPersistencePort.findByAccountNumber(masterAccount.getAccountNumber()).orElseThrow();
        Account updatedSub = accountPersistencePort.findByAccountNumber(subAccount.getAccountNumber()).orElseThrow();

        assertEquals(0, new BigDecimal("850.00").compareTo(updatedMaster.getBalance()), "Master should be debited 150.00");
        assertEquals(0, new BigDecimal("200.00").compareTo(updatedSub.getBalance()), "Sub should be funded to exactly 200.00");

        List<LedgerEntry> sweepEntries = ledgerRepository.findAll();
        assertFalse(sweepEntries.isEmpty(), "Sweep ledger entries SWP-xxx must be generated");
    }

    @Test
    @DisplayName("P02: JIT Sweep Failure — Master Account Insufficient")
    void testJitSweepFailureMasterInsufficient() {
        masterAccount.setBalance(new BigDecimal("10.00"));
        accountPersistencePort.save(masterAccount);
        BigDecimal requiredAmount = new BigDecimal("500.00");

        BusinessException exception = assertThrows(BusinessException.class, () -> {
            zeroBalanceSweepService.executeSweepIfNecessary(subAccount, requiredAmount, "TXN-456");
        });

        assertEquals(ErrorCode.INSUFFICIENT_FUNDS, exception.getErrorCode());
        assertEquals(0, ledgerRepository.count(), "Zero ledger writes should occur on sweep failure");
    }

    @Test
    @DisplayName("P03: JIT Sweep Bypass — Standard Account (No Parent)")
    void testJitSweepBypassStandardAccount() {
        BigDecimal requiredAmount = new BigDecimal("50.00");

        BusinessException exception = assertThrows(BusinessException.class, () -> {
            zeroBalanceSweepService.executeSweepIfNecessary(standardAccount, requiredAmount, "TXN-789");
        });

        assertEquals(ErrorCode.INSUFFICIENT_FUNDS, exception.getErrorCode());
        assertEquals(0, ledgerRepository.count(), "No sweep attempts should be made for non-VAM accounts");
    }
}
