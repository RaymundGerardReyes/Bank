package com.company.banking.transaction.application;

import com.company.banking.account.application.port.out.AccountPersistencePort;
import com.company.banking.account.domain.Account;
import com.company.banking.common.enums.AccountStatus;
import com.company.banking.common.exception.BusinessException;
import com.company.banking.common.exception.ErrorCode;
import com.company.banking.common.exception.NotFoundException;
import com.company.banking.transaction.api.dto.InternalTransferRequest;
import com.company.banking.transaction.api.dto.TransactionResponse;
import com.company.banking.transaction.application.port.in.TransactionUseCase;
import com.company.banking.transaction.application.port.out.LedgerPersistencePort;
import com.company.banking.transaction.domain.Transaction;
import com.company.banking.transaction.domain.TransactionStatus;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class InternalTransferService implements TransactionUseCase {

    private final AccountPersistencePort accountPersistencePort;
    private final LedgerPersistencePort ledgerPersistencePort;

    @Override
    @Transactional
    public TransactionResponse processInternalTransfer(InternalTransferRequest request) {
        // 1. Idempotency Check
        Optional<Transaction> existingTx = ledgerPersistencePort.findByIdempotencyKey(request.getIdempotencyKey());
        if (existingTx.isPresent()) {
            return TransactionResponse.fromEntity(existingTx.get());
        }

        // 2. Fetch & Validate Accounts
        Account source = accountPersistencePort.findByAccountNumber(request.getSourceAccountNumber())
                .orElseThrow(() -> new NotFoundException("Source account not found: " + request.getSourceAccountNumber()));

        Account destination = accountPersistencePort.findByAccountNumber(request.getDestinationAccountNumber())
                .orElseThrow(() -> new NotFoundException("Destination account not found: " + request.getDestinationAccountNumber()));

        if (source.getStatus() != AccountStatus.ACTIVE) {
            throw new BusinessException(ErrorCode.ACCOUNT_SUSPENDED, "Source account is not active");
        }

        if (destination.getStatus() != AccountStatus.ACTIVE) {
            throw new BusinessException(ErrorCode.ACCOUNT_SUSPENDED, "Destination account is not active");
        }

        if (source.getBalance().compareTo(request.getAmount()) < 0) {
            throw new BusinessException(ErrorCode.INSUFFICIENT_FUNDS);
        }

        // 3. Perform Money Movement (Atomic)
        source.setBalance(source.getBalance().subtract(request.getAmount()));
        destination.setBalance(destination.getBalance().add(request.getAmount()));

        accountPersistencePort.save(source);
        accountPersistencePort.save(destination);

        // 4. Create Transaction & Ledger Entry
        Transaction transaction = Transaction.builder()
                .transactionReference("TXN-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase())
                .idempotencyKey(request.getIdempotencyKey())
                .sourceAccountNumber(source.getAccountNumber())
                .destinationAccountNumber(destination.getAccountNumber())
                .amount(request.getAmount())
                .currency(source.getCurrency())
                .status(TransactionStatus.COMPLETED)
                .description(request.getDescription())
                .build();

        Transaction savedTx = ledgerPersistencePort.save(transaction);

        return TransactionResponse.fromEntity(savedTx);
    }
}
