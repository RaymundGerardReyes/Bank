package com.company.banking.transaction.application;

import com.company.banking.account.application.port.out.AccountPersistencePort;
import com.company.banking.account.domain.Account;
import com.company.banking.common.exception.ConflictException;
import com.company.banking.transaction.api.dto.DepositRequest;
import com.company.banking.transaction.api.dto.TransactionResponse;
import com.company.banking.transaction.application.port.in.DepositUseCase;
import com.company.banking.transaction.application.port.out.LedgerPersistencePort;
import com.company.banking.notification.application.port.out.PushNotificationPort;
import com.company.banking.transaction.domain.Transaction;
import com.company.banking.transaction.domain.TransactionStatus;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

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

        Account account = accountResolver.resolveAndAuthorizeSource(request.getAccountNumber());

        account.setBalance(account.getBalance().add(request.getAmount()));
        accountPersistencePort.save(account);

        Transaction transaction = Transaction.builder()
                .transactionReference("DEP-" + UUID.randomUUID())
                .idempotencyKey(request.getIdempotencyKey())
                .sourceAccountNumber("CASH")
                .destinationAccountNumber(account.getAccountNumber())
                .amount(request.getAmount())
                .currency(account.getCurrency())
                .status(TransactionStatus.COMPLETED)
                .description("Cash Deposit")
                .build();

        Transaction saved = ledgerPersistencePort.save(transaction);

        // --- FIRE WEBSOCKET PUSH ---
        String actor = SecurityContextHolder.getContext().getAuthentication().getName();
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