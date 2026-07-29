package com.company.banking.transaction.application;

import com.company.banking.account.application.port.out.AccountPersistencePort;
import com.company.banking.account.domain.Account;
import com.company.banking.common.audit.AuditEventPublisher; // <-- NEW
import com.company.banking.common.enums.AccountStatus;
import com.company.banking.common.exception.BusinessException;
import com.company.banking.common.exception.ErrorCode;
import com.company.banking.common.exception.NotFoundException;
import com.company.banking.transaction.api.dto.InternalTransferRequest;
import com.company.banking.transaction.api.dto.TransactionResponse;
import com.company.banking.transaction.application.port.in.TransactionUseCase;
import com.company.banking.transaction.application.port.out.LedgerPersistencePort;
import com.company.banking.transaction.domain.EntryType;
import com.company.banking.transaction.domain.LedgerEntry;
import com.company.banking.transaction.domain.Transaction;
import com.company.banking.transaction.domain.TransactionStatus;
import com.company.banking.web.filter.CorrelationIdFilter; // <-- NEW

import lombok.RequiredArgsConstructor;
import org.slf4j.MDC; // <-- NEW
import org.springframework.security.core.context.SecurityContextHolder; // <-- NEW
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class InternalTransferService implements TransactionUseCase {

    private final AccountPersistencePort accountPersistencePort;
    private final LedgerPersistencePort ledgerPersistencePort;
    private final com.company.banking.transaction.domain.TransferPolicy transferPolicy;
    private final ScheduledTransferService scheduledTransferService;
    
    private final AuditEventPublisher auditEventPublisher; // <-- NEW

    @Override
    @Transactional
    public TransactionResponse processInternalTransfer(InternalTransferRequest request) {
        // 1. Idempotency Check
        Optional<Transaction> existingTx = ledgerPersistencePort.findByIdempotencyKey(request.getIdempotencyKey());
        if (existingTx.isPresent()) {
            return TransactionResponse.fromEntity(existingTx.get());
        }

        // 1b. Check for Scheduled Transfer Branch
        if (request.getScheduledDate() != null && !request.getScheduledDate().trim().isEmpty()) {
            return scheduledTransferService.scheduleTransfer(request);
        }

        // 2. Fetch & Validate Accounts
        Account source = accountPersistencePort.findByAccountNumber(request.getSourceAccountNumber())
                .orElseThrow(() -> new NotFoundException("Source account not found: " + request.getSourceAccountNumber()));
        
        Account destination = accountPersistencePort.findByAccountNumber(request.getDestinationAccountNumber())
                .orElseThrow(() -> new NotFoundException("Destination account not found: " + request.getDestinationAccountNumber()));

        if (source.getStatus() != AccountStatus.ACTIVE || destination.getStatus() != AccountStatus.ACTIVE) {
            throw new BusinessException(ErrorCode.ACCOUNT_SUSPENDED, "One or both accounts are not active");
        }

        if (source.getBalance().compareTo(request.getAmount()) < 0) {
            throw new BusinessException(ErrorCode.INSUFFICIENT_FUNDS);
        }

        // 2b. Velocity Policy Check
        transferPolicy.validateVelocity(source, request.getAmount(), java.util.Collections.emptyList());

        // 3. Perform Money Movement (Atomic)
        source.setBalance(source.getBalance().subtract(request.getAmount()));
        destination.setBalance(destination.getBalance().add(request.getAmount()));
        
        accountPersistencePort.save(source);
        accountPersistencePort.save(destination);

        String txRef = "TXN-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();

        // 4. Strict Double-Entry Ledger Logging
        LedgerEntry debitEntry = LedgerEntry.builder()
                .transactionReference(txRef)
                .accountNumber(source.getAccountNumber())
                .entryType(EntryType.DEBIT)
                .amount(request.getAmount())
                .currency(source.getCurrency())
                .build();

        LedgerEntry creditEntry = LedgerEntry.builder()
                .transactionReference(txRef)
                .accountNumber(destination.getAccountNumber())
                .entryType(EntryType.CREDIT)
                .amount(request.getAmount())
                .currency(destination.getCurrency())
                .build();

        ledgerPersistencePort.saveLedgerEntry(debitEntry);
        ledgerPersistencePort.saveLedgerEntry(creditEntry);

        // 5. Create overarching Transaction record
        Transaction transaction = Transaction.builder()
                .transactionReference(txRef)
                .idempotencyKey(request.getIdempotencyKey())
                .sourceAccountNumber(source.getAccountNumber())
                .destinationAccountNumber(destination.getAccountNumber())
                .amount(request.getAmount())
                .currency(source.getCurrency())
                .status(TransactionStatus.COMPLETED)
                .description(request.getDescription())
                .build();

        Transaction savedTx = ledgerPersistencePort.save(transaction);

        // 6. ---> NEW: Dispatch Audit Log for Mobile Notifications! <---
        String correlationId = MDC.get(CorrelationIdFilter.MDC_KEY);
        String actor = SecurityContextHolder.getContext().getAuthentication().getName();
        
        auditEventPublisher.publishEvent(
                "Internal Transfer Completed",
                actor,
                String.format("Successfully transferred $%.2f from %s to %s.", request.getAmount(), source.getAccountNumber(), destination.getAccountNumber()),
                correlationId
        );

        return TransactionResponse.fromEntity(savedTx);
    }

    @Override
    @Transactional(readOnly = true)
    public TransactionResponse getByIdempotencyKey(String idempotencyKeyPrefix) {
        Transaction tx = ledgerPersistencePort.findByIdempotencyKey(idempotencyKeyPrefix)
                .orElseThrow(() -> new NotFoundException("Transaction not found for trace ref: " + idempotencyKeyPrefix));
        return TransactionResponse.fromEntity(tx);
    }
}