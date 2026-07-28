package com.company.banking.transaction.application;

import com.company.banking.account.application.port.out.AccountPersistencePort;
import com.company.banking.account.domain.Account;
import com.company.banking.common.exception.ConflictException;
import com.company.banking.common.exception.NotFoundException;
import com.company.banking.transaction.api.dto.DepositRequest;
import com.company.banking.transaction.api.dto.TransactionResponse;
import com.company.banking.transaction.application.port.in.DepositUseCase;
import com.company.banking.transaction.application.port.out.LedgerPersistencePort;
import com.company.banking.transaction.domain.Transaction;
import com.company.banking.transaction.domain.TransactionStatus;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class DepositService implements DepositUseCase {

    private final AccountPersistencePort accountPersistencePort;
    private final LedgerPersistencePort ledgerPersistencePort;

    @Override
    @Transactional
    public TransactionResponse deposit(DepositRequest request) {
        if (ledgerPersistencePort.existsByIdempotencyKey(request.getIdempotencyKey())) {
            throw new ConflictException("Deposit with this idempotency key already processed");
        }

        Account account = accountPersistencePort.findByAccountNumber(request.getAccountNumber())
                .orElseThrow(() -> new NotFoundException("Account not found"));

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
        return TransactionResponse.fromEntity(saved);
    }
}
