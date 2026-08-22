package com.company.banking.transaction.application;

import com.company.banking.account.application.port.out.AccountPersistencePort;
import com.company.banking.account.domain.Account;
import com.company.banking.common.audit.AuditEventPublisher;
import com.company.banking.common.enums.AccountStatus;
import com.company.banking.common.exception.BusinessException;
import com.company.banking.common.exception.ConflictException;
import com.company.banking.common.exception.ErrorCode;
import com.company.banking.common.exception.NotFoundException;
import com.company.banking.notification.application.port.out.PushNotificationPort;
import com.company.banking.transaction.api.dto.InternalTransferRequest;
import com.company.banking.transaction.api.dto.TransactionResponse;
import com.company.banking.transaction.application.port.in.TransactionUseCase;
import com.company.banking.transaction.application.port.out.LedgerPersistencePort;
import com.company.banking.transaction.domain.EntryType;
import com.company.banking.transaction.domain.LedgerEntry;
import com.company.banking.transaction.domain.Transaction;
import com.company.banking.transaction.domain.TransactionStatus;
import com.company.banking.web.filter.CorrelationIdFilter;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.slf4j.MDC;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class InternalTransferService implements TransactionUseCase {

    private final AccountPersistencePort accountPersistencePort;
    private final LedgerPersistencePort ledgerPersistencePort;
    private final com.company.banking.transaction.domain.TransferPolicy transferPolicy;
    private final ScheduledTransferService scheduledTransferService;
    private final AuditEventPublisher auditEventPublisher;
    private final ZeroBalanceSweepService zeroBalanceSweepService;
    private final PushNotificationPort pushNotificationPort;

    private final com.company.banking.account.application.GlobalAccountLockGuard globalAccountLockGuard;

    @Override
    @Transactional
    public TransactionResponse processInternalTransfer(InternalTransferRequest request) {
        log.info("[INTERNAL TRANSFER] Initiating transfer from {} to {}", 
                 request.getSourceAccountNumber(), request.getDestinationAccountNumber());

        // 1. Enforce fast-path idempotency check
        Optional<Transaction> existingTx = ledgerPersistencePort.findByIdempotencyKey(request.getIdempotencyKey());
        if (existingTx.isPresent()) {
            return TransactionResponse.fromEntity(existingTx.get());
        }

        if (request.getScheduledDate() != null && !request.getScheduledDate().trim().isEmpty()) {
            return scheduledTransferService.scheduleTransfer(request);
        }

        // 2. Prevent logical errors
        if (request.getSourceAccountNumber().equals(request.getDestinationAccountNumber())) {
            throw new BusinessException(ErrorCode.INVALID_REQUEST, "Source and destination accounts cannot be the same.");
        }
        if (request.getAmount() == null || request.getAmount().compareTo(BigDecimal.ZERO) <= 0) {
            throw new BusinessException(ErrorCode.INVALID_REQUEST, "Transfer amount must be strictly positive.");
        }

        // 3. Deterministic Lock Ordering (Prevents Deadlocks)
        List<Account> lockedAccounts = globalAccountLockGuard.acquireDeterministicLocks(
                request.getSourceAccountNumber(), request.getDestinationAccountNumber());
        Account source = lockedAccounts.get(0);
        Account destination = lockedAccounts.get(1);

        if (source.getStatus() != AccountStatus.ACTIVE || destination.getStatus() != AccountStatus.ACTIVE) {
            throw new BusinessException(ErrorCode.ACCOUNT_SUSPENDED, "One or both accounts are not active");
        }

        // 4. Validate Business Rules & VAM Hierarchy
        transferPolicy.validateApiKeyVamBinding(source);
        transferPolicy.validateDestinationWithinVamHierarchy(source, destination);
        transferPolicy.validateVamPermissions(source, destination);

        zeroBalanceSweepService.executeSweepIfNecessary(source, request.getAmount(), "Internal Transfer");

        if (source.getBalance().compareTo(request.getAmount()) < 0) {
            throw new BusinessException(ErrorCode.INSUFFICIENT_FUNDS, "Insufficient funds for internal transfer.");
        }

        transferPolicy.validateVelocity(source, request.getAmount(), Collections.emptyList());

        // 5. Atomic Balance Mutations
        source.setBalance(source.getBalance().subtract(request.getAmount()));
        destination.setBalance(destination.getBalance().add(request.getAmount()));

        accountPersistencePort.save(source);
        accountPersistencePort.save(destination);

        // 6. Double-Entry Ledger Creation
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

        ledgerPersistencePort.saveLedgerEntries(Arrays.asList(debitEntry, creditEntry));

        // 7. Transaction Posting
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

        Transaction savedTx;
        try {
            savedTx = ledgerPersistencePort.save(transaction);
        } catch (DataIntegrityViolationException e) {
            throw new ConflictException("Transfer operation is idempotent. Blocked at database level.");
        }

        String correlationId = MDC.get(CorrelationIdFilter.MDC_KEY);
        org.springframework.security.core.Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String actor = (auth != null && auth.getName() != null) ? auth.getName() : "SYSTEM";
        
        auditEventPublisher.publishEvent(
                "Internal Transfer Completed",
                actor,
                String.format("Successfully transferred ₱%.2f from %s to %s.", request.getAmount(), source.getAccountNumber(), destination.getAccountNumber()),
                correlationId
        );

        pushNotificationPort.sendPush(
                actor,
                "Transfer Successful",
                String.format("Your transfer of ₱%.2f was completed successfully.", request.getAmount())
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