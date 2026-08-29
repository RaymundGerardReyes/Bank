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
import com.company.banking.transaction.application.port.out.FxRateProviderPort;
import com.company.banking.transaction.domain.FxCalculationService;
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
import org.springframework.transaction.support.TransactionTemplate;

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
    private final org.springframework.context.ApplicationEventPublisher eventPublisher;
    private final com.company.banking.transaction.infrastructure.TransactionJpaRepository transactionRepository;
    private final FxRateProviderPort fxRateProviderPort;
    private final FxCalculationService fxCalculationService;

    private final com.company.banking.account.application.GlobalAccountLockGuard globalAccountLockGuard;
    private final TransactionAccountResolver transactionAccountResolver;
    private final TransactionTemplate transactionTemplate;

    @Override
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

        // Validate accounts exist before locking to throw specific 404s
        Account sourceAccount = transactionAccountResolver.resolveAndAuthorizeSource(request.getSourceAccountNumber());
        Account destinationAccount = transactionAccountResolver.resolveAndAuthorizeDestination(request.getDestinationAccountNumber(), sourceAccount);

        // Phase 2: Domain Abstraction and Classification (PRE-LOCK)
        com.company.banking.transaction.domain.CurrencyCode sourceCurrencyCode = com.company.banking.transaction.domain.CurrencyCode.fromString(sourceAccount.getCurrency());
        com.company.banking.transaction.domain.CurrencyCode destCurrencyCode = com.company.banking.transaction.domain.CurrencyCode.fromString(destinationAccount.getCurrency());
        
        com.company.banking.transaction.domain.TransferType transferType = com.company.banking.transaction.domain.TransferType.from(sourceCurrencyCode, destCurrencyCode);
        com.company.banking.transaction.domain.TransferIntent transferIntent;

        if (transferType == com.company.banking.transaction.domain.TransferType.SAME_CURRENCY) {
            com.company.banking.transaction.domain.Money money = com.company.banking.transaction.domain.Money.of(request.getAmount(), sourceCurrencyCode);
            transferIntent = com.company.banking.transaction.domain.TransferIntent.sameCurrency(money);
        } else {
            com.company.banking.transaction.domain.Money sourceMoney = com.company.banking.transaction.domain.Money.of(request.getAmount(), sourceCurrencyCode);
            
            // 1. Obtain Quote (NETWORK CALL HAPPENS HERE, OUTSIDE LOCK AND TX)
            com.company.banking.transaction.domain.FxQuote quote = fxRateProviderPort.getQuote(sourceCurrencyCode, destCurrencyCode, sourceMoney);
            
            // 2. Validate Expiration
            quote.validateNotExpired(java.time.Instant.now());
            
            // 3. Calculate Target Amount in memory
            com.company.banking.transaction.domain.Money destinationMoney = fxCalculationService.calculateDestinationAmount(sourceMoney, quote);
            
            // SECURITY CHECK: Log the math and the reference, but DO NOT log the account numbers or the full request payload here.
            log.info("FX Quote applied safely in memory. Reference: [{}]. {} converts to {} at rate {}", 
                quote.getProviderReference(), sourceMoney, destinationMoney, quote.getRate());
            
            // 4. THE ACCOUNTING GATE
            // We intentionally crash the flow here because Phase 4 (Accounting Model) is not yet approved.
            throw new BusinessException(
                ErrorCode.CROSS_CURRENCY_POSTING_NOT_AVAILABLE, 
                "Valid FX quote obtained, but cross-currency ledger posting is disabled pending accounting model approval."
            );
        }

        // --- TRANSACTION BOUNDARY START ---
        return transactionTemplate.execute(status -> {
            // 3. Deterministic Lock Ordering (Prevents Deadlocks)
            List<Account> lockedAccounts = globalAccountLockGuard.acquireDeterministicLocks(
                    request.getSourceAccountNumber(), request.getDestinationAccountNumber());
            Account source = lockedAccounts.get(0);
            Account destination = lockedAccounts.get(1);

            if (source.getStatus() != AccountStatus.ACTIVE || destination.getStatus() != AccountStatus.ACTIVE) {
                throw new BusinessException(ErrorCode.ACCOUNT_SUSPENDED, "One or both accounts are not active");
            }

            // 4. Validate Business Rules & VAM Hierarchy (Post-lock to ensure state hasn't changed)
            transferPolicy.validateApiKeyVamBinding(source);
            transferPolicy.validateVamPermissions(source, destination);


        zeroBalanceSweepService.executeSweepIfNecessary(source, request.getAmount(), "Internal Transfer");

        com.company.banking.transaction.domain.Money sourceBalance = com.company.banking.transaction.domain.Money.of(source.getBalance(), sourceCurrencyCode);
        if (sourceBalance.isLessThan(transferIntent.getSourceMoney())) {
            throw new BusinessException(ErrorCode.INSUFFICIENT_FUNDS, "Insufficient funds for internal transfer.");
        }

        transferPolicy.validateVelocity(source, request.getAmount(), Collections.emptyList());

        // 5. Create Transaction anchor FIRST (status=PENDING) so accounting records precede balance mutations.
        //    Order: Transaction → LedgerEntries → Balance updates → Transaction COMPLETED.
        //    If any step after Transaction creation fails the whole @Transactional rolls back cleanly.
        String txRef = "TXN-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();

        Transaction transaction = Transaction.builder()
                .transactionReference(txRef)
                .idempotencyKey(request.getIdempotencyKey())
                .sourceAccountNumber(source.getAccountNumber())
                .destinationAccountNumber(destination.getAccountNumber())
                .amount(transferIntent.getSourceMoney().getAmount())
                .currency(transferIntent.getSourceMoney().getCurrency().name())
                .destinationAmount(transferIntent.getDestinationMoney().getAmount())
                .fxQuoteId(transferIntent.getFxQuote().map(com.company.banking.transaction.domain.FxQuote::getProviderReference).orElse(null))
                .status(TransactionStatus.PENDING)
                .description(request.getDescription())
                .build();

        Transaction savedTx;
        try {
            savedTx = transactionRepository.saveAndFlush(transaction);
        } catch (DataIntegrityViolationException e) {
            Transaction concurrentTx = ledgerPersistencePort.findByIdempotencyKey(request.getIdempotencyKey())
                    .orElseThrow(() -> new BusinessException(ErrorCode.CONFLICT, "Transfer failed due to unresolvable concurrency collision"));
            return TransactionResponse.fromEntity(concurrentTx);
        }

        // 6. Double-Entry Ledger (anchored to the Transaction reference that now exists in DB)
        // Phase 2: Decoupled ledger posting from generic transaction amount using TransferIntent
        LedgerEntry debitEntry = LedgerEntry.builder()
                .transactionReference(txRef)
                .accountNumber(source.getAccountNumber())
                .entryType(EntryType.DEBIT)
                .amount(transferIntent.getSourceMoney().getAmount())
                .currency(transferIntent.getSourceMoney().getCurrency().name())
                .build();

        LedgerEntry creditEntry = LedgerEntry.builder()
                .transactionReference(txRef)
                .accountNumber(destination.getAccountNumber())
                .entryType(EntryType.CREDIT)
                .amount(transferIntent.getDestinationMoney().getAmount())
                .currency(transferIntent.getDestinationMoney().getCurrency().name())
                .build();

        ledgerPersistencePort.saveLedgerEntries(Arrays.asList(debitEntry, creditEntry));

        // 7. Balance mutations — occur AFTER the full accounting record exists, calculated through safe domain Money logic
        com.company.banking.transaction.domain.Money updatedSourceBalance = sourceBalance.subtract(transferIntent.getSourceMoney());
        com.company.banking.transaction.domain.Money updatedDestBalance = com.company.banking.transaction.domain.Money.of(destination.getBalance(), destCurrencyCode).add(transferIntent.getDestinationMoney());
        
        source.setBalance(updatedSourceBalance.getAmount());
        destination.setBalance(updatedDestBalance.getAmount());
        accountPersistencePort.save(source);
        accountPersistencePort.save(destination);

        // 8. Mark Transaction as COMPLETED now that all accounting and balance mutations succeeded
        savedTx.setStatus(TransactionStatus.COMPLETED);
        savedTx = ledgerPersistencePort.save(savedTx);

        // 9. Audit log (synchronous, in-transaction — audit failure should still roll back)
        String correlationId = MDC.get(CorrelationIdFilter.MDC_KEY);
        org.springframework.security.core.Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String actor = (auth != null && auth.getName() != null) ? auth.getName() : "SYSTEM";

        auditEventPublisher.publishEvent(
                "Internal Transfer Completed",
                actor,
                String.format("Successfully transferred ₱%.2f from %s to %s.", request.getAmount(), source.getAccountNumber(), destination.getAccountNumber()),
                correlationId
        );

        // 10. Publish Event for Side Effects (Executes AFTER_COMMIT via TransferNotificationListener)
        eventPublisher.publishEvent(new TransferCompletedEvent(
                savedTx.getTransactionReference(),
                source.getAccountNumber(),
                destination.getAccountNumber(),
                savedTx.getAmount(),
                savedTx.getCurrency()
        ));

            return TransactionResponse.fromEntity(savedTx);
        });
    }

    @Override
    @Transactional(readOnly = true)
    public TransactionResponse getByIdempotencyKey(String idempotencyKeyPrefix) {
        Transaction tx = ledgerPersistencePort.findByIdempotencyKey(idempotencyKeyPrefix)
                .orElseThrow(() -> new NotFoundException("Transaction not found for trace ref: " + idempotencyKeyPrefix));
        return TransactionResponse.fromEntity(tx);
    }
}