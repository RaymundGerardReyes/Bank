package com.company.banking.transaction.application;

import com.company.banking.account.application.port.out.AccountPersistencePort;
import com.company.banking.account.domain.Account;
import com.company.banking.common.enums.AccountStatus;
import com.company.banking.common.exception.BusinessException;
import com.company.banking.common.exception.ConflictException;
import com.company.banking.common.exception.ErrorCode;
import com.company.banking.common.exception.NotFoundException;
import com.company.banking.transaction.api.dto.DepositRequest;
import com.company.banking.transaction.api.dto.TransactionResponse;
import com.company.banking.transaction.application.port.in.DepositUseCase;
import com.company.banking.transaction.application.port.out.LedgerPersistencePort;
import com.company.banking.notification.application.port.out.PushNotificationPort;
import com.company.banking.transaction.domain.EntryType;
import com.company.banking.transaction.domain.LedgerEntry;
import com.company.banking.transaction.domain.Transaction;
import com.company.banking.transaction.domain.TransactionStatus;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Arrays;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class DepositService implements DepositUseCase {

    private final AccountPersistencePort accountPersistencePort;
    private final LedgerPersistencePort ledgerPersistencePort;
    private final TransactionAccountResolver accountResolver;
    private final PushNotificationPort pushNotificationPort;

    @Override
    @Transactional
    public TransactionResponse deposit(DepositRequest request) {
        if (ledgerPersistencePort.existsByIdempotencyKey(request.getIdempotencyKey())) {
            throw new ConflictException("Deposit with this idempotency key already processed");
        }

        // Validate account and VAM bindings
        accountResolver.resolveAndAuthorizeSource(request.getAccountNumber());

        // Pessimistic write lock for concurrency control
        Account account = accountPersistencePort.findByAccountNumberForUpdate(request.getAccountNumber())
                .orElseThrow(() -> new NotFoundException("Account not found: " + request.getAccountNumber()));

        if (!account.canCredit()) {
            if (account.isFrozen() || account.getStatus() == AccountStatus.FROZEN) {
                throw new BusinessException(ErrorCode.ACCOUNT_SUSPENDED, "Account is frozen due to compliance or security lockdown");
            }
            if (account.getStatus() != AccountStatus.ACTIVE) {
                throw new BusinessException(ErrorCode.ACCOUNT_SUSPENDED, "Account is not active");
            }
            if (!account.isAllowIncoming()) {
                throw new BusinessException(ErrorCode.ACCOUNT_SUSPENDED, "Account incoming transactions are locked");
            }
            throw new BusinessException(ErrorCode.ACCOUNT_SUSPENDED, "Account is frozen, suspended, or locked for incoming transactions");
        }

        String txRef = "DEP-" + UUID.randomUUID().toString();

        Transaction transaction = Transaction.builder()
                .transactionReference(txRef)
                .idempotencyKey(request.getIdempotencyKey())
                .sourceAccountNumber("CASH")
                .destinationAccountNumber(account.getAccountNumber())
                .amount(request.getAmount())
                .currency(account.getCurrency())
                .status(TransactionStatus.COMPLETED)
                .description("Cash Deposit")
                .build();

        Transaction saved = ledgerPersistencePort.save(transaction);

        // Double-entry bookkeeping: Debit CASH, Credit Account
        LedgerEntry debitEntry = LedgerEntry.builder()
                .transactionReference(txRef)
                .accountNumber("CASH")
                .entryType(EntryType.DEBIT)
                .amount(request.getAmount())
                .currency(account.getCurrency())
                .build();

        LedgerEntry creditEntry = LedgerEntry.builder()
                .transactionReference(txRef)
                .accountNumber(account.getAccountNumber())
                .entryType(EntryType.CREDIT)
                .amount(request.getAmount())
                .currency(account.getCurrency())
                .build();

        ledgerPersistencePort.saveLedgerEntries(Arrays.asList(debitEntry, creditEntry));

        // Mutate and save balance
        account.setBalance(account.getBalance().add(request.getAmount()));
        accountPersistencePort.save(account);

        // --- FIRE WEBSOCKET PUSH ---
        String actor = SecurityContextHolder.getContext().getAuthentication() != null 
                ? SecurityContextHolder.getContext().getAuthentication().getName() : null;
        if (actor != null && !actor.equals("anonymousUser")) {
            pushNotificationPort.sendPush(
                    actor,
                    "Deposit Processed",
                    // Updated to use the Philippine Peso (₱) symbol
                    String.format("Successfully deposited ₱%.2f into your account.", request.getAmount())
            );
        }

        return TransactionResponse.fromEntity(saved);
    }
}