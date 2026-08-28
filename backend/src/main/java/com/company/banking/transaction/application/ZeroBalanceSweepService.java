package com.company.banking.transaction.application;

import com.company.banking.account.application.port.out.AccountPersistencePort;
import com.company.banking.account.domain.Account;
import com.company.banking.common.exception.BusinessException;
import com.company.banking.common.exception.ErrorCode;
import com.company.banking.common.exception.NotFoundException;
import com.company.banking.transaction.application.port.out.LedgerPersistencePort;
import com.company.banking.transaction.domain.EntryType;
import com.company.banking.transaction.domain.LedgerEntry;
import com.company.banking.transaction.domain.Transaction;
import com.company.banking.transaction.domain.TransactionStatus;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class ZeroBalanceSweepService {

    private final AccountPersistencePort accountPersistencePort;
    private final LedgerPersistencePort ledgerPersistencePort;
    private final TransactionAccountResolver accountResolver;

    @Transactional
    public void executeSweepIfNecessary(Account subAccount, BigDecimal requiredAmount, String traceRefContext) {
        // 1. If the account already has sufficient liquidity, do nothing.
        if (subAccount.getBalance().compareTo(requiredAmount) >= 0) {
            return; 
        }

        // 2. If it's a standard account (no parent) and has insufficient funds, fail standardly.
        if (subAccount.getParentAccountId() == null || subAccount.getParentAccountId().trim().isEmpty()) {
            throw new BusinessException(ErrorCode.INSUFFICIENT_FUNDS, 
                "Account has insufficient funds and no Master Account to sweep liquidity from.");
        }

        // 4. Retrieve the Master Account (VULN 1 FIX)
        Account parentAccount = accountResolver.resolveAndAuthorizeSource(subAccount.getParentAccountId());

        com.company.banking.transaction.domain.CurrencyCode parentCurrencyCode = com.company.banking.transaction.domain.CurrencyCode.fromString(parentAccount.getCurrency());
        com.company.banking.transaction.domain.CurrencyCode subCurrencyCode = com.company.banking.transaction.domain.CurrencyCode.fromString(subAccount.getCurrency());

        com.company.banking.transaction.domain.Money requiredMoney = com.company.banking.transaction.domain.Money.of(requiredAmount, subCurrencyCode);
        com.company.banking.transaction.domain.Money subBalance = com.company.banking.transaction.domain.Money.of(subAccount.getBalance(), subCurrencyCode);

        // 3. Calculate Exact Shortfall using Money
        com.company.banking.transaction.domain.Money shortfallMoney = requiredMoney.subtract(subBalance);
        log.info("[VAM SWEEP] Account {} requires {}. Sweeping shortfall of {} from Master Account {}", 
                 subAccount.getAccountNumber(), requiredAmount, shortfallMoney.getAmount(), subAccount.getParentAccountId());

        com.company.banking.transaction.domain.Money parentBalance = com.company.banking.transaction.domain.Money.of(parentAccount.getBalance(), parentCurrencyCode);

        // Ensure currencies match before sweep
        com.company.banking.transaction.domain.TransferType.from(parentCurrencyCode, subCurrencyCode);

        if (parentBalance.isLessThan(shortfallMoney)) {
            log.error("[VAM SWEEP] Master Account {} has insufficient liquidity to cover the {} sweep.", parentAccount.getAccountNumber(), shortfallMoney.getAmount());
            throw new BusinessException(ErrorCode.INSUFFICIENT_FUNDS, 
                "Master Account has insufficient liquidity to automatically fund the VAM sub-account sweep.");
        }

        // 5. Record the Sweep in the Immutable Ledger FIRST
        String sweepTxRef = "SWP-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();

        LedgerEntry debitEntry = LedgerEntry.builder()
                .transactionReference(sweepTxRef)
                .accountNumber(parentAccount.getAccountNumber())
                .entryType(EntryType.DEBIT)
                .amount(shortfallMoney.getAmount())
                .currency(parentAccount.getCurrency())
                .build();

        LedgerEntry creditEntry = LedgerEntry.builder()
                .transactionReference(sweepTxRef)
                .accountNumber(subAccount.getAccountNumber())
                .entryType(EntryType.CREDIT)
                .amount(shortfallMoney.getAmount())
                .currency(subAccount.getCurrency())
                .build();

        ledgerPersistencePort.saveLedgerEntries(java.util.Arrays.asList(debitEntry, creditEntry));

        // 6. Store Overarching Sweep Transaction Context
        Transaction sweepTx = Transaction.builder()
                .transactionReference(sweepTxRef)
                .idempotencyKey(UUID.randomUUID().toString()) // Internal sweep gets its own unique trace
                .sourceAccountNumber(parentAccount.getAccountNumber())
                .destinationAccountNumber(subAccount.getAccountNumber())
                .amount(shortfallMoney.getAmount())
                .currency(parentAccount.getCurrency())
                .status(TransactionStatus.COMPLETED)
                .description("Automated JIT Liquidity Sweep for " + traceRefContext)
                .build();

        ledgerPersistencePort.save(sweepTx);

        // 7. Execute JIT Sweep Money Movement (Balance Mutation) safely isolated AFTER ledger
        parentAccount.setBalance(parentBalance.subtract(shortfallMoney).getAmount());
        subAccount.setBalance(subBalance.add(shortfallMoney).getAmount());

        accountPersistencePort.save(parentAccount);
        accountPersistencePort.save(subAccount);

        log.info("[VAM SWEEP] Sweep completed successfully. Sub-account {} is now sufficiently funded.", subAccount.getAccountNumber());
    }
}