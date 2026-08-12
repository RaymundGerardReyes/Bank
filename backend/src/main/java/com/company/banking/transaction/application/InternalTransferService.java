package com.company.banking.transaction.application;

import com.company.banking.account.application.port.out.AccountPersistencePort;
import com.company.banking.account.domain.Account;
import com.company.banking.common.audit.AuditEventPublisher;
import com.company.banking.common.enums.AccountStatus;
import com.company.banking.common.exception.BusinessException;
import com.company.banking.common.exception.ErrorCode;
import com.company.banking.common.exception.NotFoundException;
import com.company.banking.transaction.api.dto.InternalTransferRequest;
import com.company.banking.transaction.api.dto.TransactionResponse;
import com.company.banking.transaction.application.port.in.TransactionUseCase;
import com.company.banking.transaction.application.port.out.LedgerPersistencePort;
// --- ADD THIS IMPORT ---
import com.company.banking.notification.application.port.out.PushNotificationPort;
import com.company.banking.transaction.domain.EntryType;
import com.company.banking.transaction.domain.LedgerEntry;
import com.company.banking.transaction.domain.Transaction;
import com.company.banking.transaction.domain.TransactionStatus;
import com.company.banking.web.filter.CorrelationIdFilter;
import com.company.banking.transaction.application.ZeroBalanceSweepService; 
import lombok.RequiredArgsConstructor;
import org.slf4j.MDC; 
import org.springframework.security.core.context.SecurityContextHolder; 
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
    private final AuditEventPublisher auditEventPublisher;
    private final ZeroBalanceSweepService zeroBalanceSweepService; 
    private final TransactionAccountResolver accountResolver;
    
    // --- INJECT THE PUSH NOTIFICATION PORT ---
    private final PushNotificationPort pushNotificationPort;

    @Override
    @Transactional
    public TransactionResponse processInternalTransfer(InternalTransferRequest request) {
        Optional<Transaction> existingTx = ledgerPersistencePort.findByIdempotencyKey(request.getIdempotencyKey());
        if (existingTx.isPresent()) {
            return TransactionResponse.fromEntity(existingTx.get());
        }

        if (request.getScheduledDate() != null && !request.getScheduledDate().trim().isEmpty()) {
            return scheduledTransferService.scheduleTransfer(request);
        }

        Account source = accountResolver.resolveAndAuthorizeSource(request.getSourceAccountNumber());
        Account destination = accountResolver.resolveAndAuthorizeDestination(request.getDestinationAccountNumber(), source);

        if (source.getStatus() != AccountStatus.ACTIVE || destination.getStatus() != AccountStatus.ACTIVE) {
            throw new BusinessException(ErrorCode.ACCOUNT_SUSPENDED, "One or both accounts are not active");
        }

        transferPolicy.validateVamPermissions(source, destination);
        zeroBalanceSweepService.executeSweepIfNecessary(source, request.getAmount(), "Internal Transfer");

        if (source.getBalance().compareTo(request.getAmount()) < 0) {
            throw new BusinessException(ErrorCode.INSUFFICIENT_FUNDS);
        }

        transferPolicy.validateVelocity(source, request.getAmount(), java.util.Collections.emptyList());

        source.setBalance(source.getBalance().subtract(request.getAmount()));
        destination.setBalance(destination.getBalance().add(request.getAmount()));
        
        accountPersistencePort.save(source);
        accountPersistencePort.save(destination);

        String txRef = "TXN-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();

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

        ledgerPersistencePort.saveLedgerEntries(java.util.Arrays.asList(debitEntry, creditEntry));

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

        String correlationId = MDC.get(CorrelationIdFilter.MDC_KEY);
        String actor = SecurityContextHolder.getContext().getAuthentication().getName();
        
        auditEventPublisher.publishEvent(
                "Internal Transfer Completed",
                actor,
                String.format("Successfully transferred $%.2f from %s to %s.", request.getAmount(), source.getAccountNumber(), destination.getAccountNumber()),
                correlationId
        );

        // --- NEW: FIRE THE WEBSOCKET PAYLOAD DIRECTLY TO THE MOBILE APP ---
        pushNotificationPort.sendPush(
                actor, 
                "Transfer Successful", 
                String.format("Your transfer of $%.2f was completed successfully.", request.getAmount())
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