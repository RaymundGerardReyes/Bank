package com.company.banking.transaction.application;

import com.company.banking.account.application.port.out.AccountPersistencePort;
import com.company.banking.account.domain.Account;
import com.company.banking.common.exception.BusinessException;
import com.company.banking.common.exception.ConflictException;
import com.company.banking.common.exception.ErrorCode;
import com.company.banking.transaction.api.dto.TransactionResponse;
import com.company.banking.transaction.api.dto.WithdrawRequest;
import com.company.banking.transaction.application.port.in.WithdrawUseCase;
import com.company.banking.transaction.application.port.out.LedgerPersistencePort;
import com.company.banking.notification.application.port.out.PushNotificationPort;
import com.company.banking.transaction.domain.SufficientFundsPolicy;
import com.company.banking.transaction.domain.Transaction;
import com.company.banking.transaction.domain.TransactionStatus;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class WithdrawService implements WithdrawUseCase {

    private final AccountPersistencePort accountPersistencePort;
    private final LedgerPersistencePort ledgerPersistencePort;
    private final SufficientFundsPolicy sufficientFundsPolicy;
    private final TransactionAccountResolver accountResolver;
    private final PushNotificationPort pushNotificationPort;

    @Override
    @Transactional
    public TransactionResponse withdraw(WithdrawRequest request) {
        if (ledgerPersistencePort.existsByIdempotencyKey(request.getIdempotencyKey())) {
            throw new ConflictException("Withdrawal with this idempotency key already processed");
        }

        Account account = accountResolver.resolveAndAuthorizeSource(request.getAccountNumber());

        if (!sufficientFundsPolicy.hasSufficientFunds(account, request.getAmount())) {
            throw new BusinessException(ErrorCode.INSUFFICIENT_FUNDS, "Insufficient funds for withdrawal");
        }

        account.setBalance(account.getBalance().subtract(request.getAmount()));
        accountPersistencePort.save(account);

        Transaction transaction = Transaction.builder()
                .transactionReference("WDL-" + UUID.randomUUID())
                .idempotencyKey(request.getIdempotencyKey())
                .sourceAccountNumber(account.getAccountNumber())
                .destinationAccountNumber("CASH")
                .amount(request.getAmount())
                .currency(account.getCurrency())
                .status(TransactionStatus.COMPLETED)
                .description("Cash Withdrawal")
                .build();

        Transaction saved = ledgerPersistencePort.save(transaction);

        // --- FIRE WEBSOCKET PUSH ---
        String actor = SecurityContextHolder.getContext().getAuthentication().getName();
        if (actor != null && !actor.equals("anonymousUser")) {
            pushNotificationPort.sendPush(
                    actor,
                    "Withdrawal Processed",
                    // Updated to use the Philippine Peso (₱) symbol
                    String.format("Successfully withdrew ₱%.2f from your account.", request.getAmount())
            );
        }

        return TransactionResponse.fromEntity(saved);
    }
}