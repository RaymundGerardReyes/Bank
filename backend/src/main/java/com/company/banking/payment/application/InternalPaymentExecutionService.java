package com.company.banking.payment.application;

import com.company.banking.account.application.port.out.AccountPersistencePort;
import com.company.banking.account.domain.Account;
import com.company.banking.common.exception.BusinessException;
import com.company.banking.common.exception.ConflictException;
import com.company.banking.common.exception.ErrorCode;
import com.company.banking.payment.domain.PaymentIntent;
import com.company.banking.payment.domain.PaymentIntentStatus;
import com.company.banking.payment.infrastructure.PaymentIntentJpaRepository;
import com.company.banking.transaction.application.port.out.LedgerPersistencePort;
import com.company.banking.transaction.domain.EntryType;
import com.company.banking.transaction.domain.LedgerEntry;
import com.company.banking.transaction.domain.Transaction;
import com.company.banking.transaction.domain.TransactionStatus;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.Arrays;
import java.util.Optional;
import java.util.UUID;

import com.company.banking.common.audit.AuditEventPublisher;
import com.company.banking.payment.domain.PaymentStateTransitionPolicy;
import com.company.banking.payment.domain.Refund;
import com.company.banking.payment.infrastructure.RefundJpaRepository;

@Service
@RequiredArgsConstructor
@Slf4j
public class InternalPaymentExecutionService {

    private final PaymentIntentJpaRepository paymentIntentRepository;
    private final AccountPersistencePort accountPersistencePort;
    private final LedgerPersistencePort ledgerPersistencePort;
    private final AuditEventPublisher auditEventPublisher;
    private final PaymentStateTransitionPolicy statePolicy;
    private final RefundJpaRepository refundRepository;
    private final PaymentEventOutboxService outboxService;

    /**
     * Phase 4A: Hardened Canonical CAPTURE flow.
     * Enforces strict lock acquisition order: PaymentIntent -> Account.
     * Relies on DB UNIQUE constraints for idempotency.
     */
    @Transactional
    public PaymentIntent capturePayment(String intentId, Long merchantId, String captureIdempotencyKey) {
        log.info("[INTERNAL GATEWAY] Capturing payment intent: {}", intentId);

        // Preliminary fast-fail check (DB constraint handles the actual race condition)
        if (ledgerPersistencePort.existsByIdempotencyKey(captureIdempotencyKey)) {
            throw new ConflictException("Capture operation is idempotent. Already processed: " + captureIdempotencyKey);
        }

        // LOCK 1: PaymentIntent (Acquired First to prevent Deadlocks)
        PaymentIntent intent = paymentIntentRepository.findByIntentIdForUpdate(intentId)
                .orElseThrow(() -> new BusinessException(ErrorCode.NOT_FOUND, "Payment Intent not found"));

        // Validate Ownership & State
        if (!intent.getMerchantId().equals(merchantId)) {
            throw new BusinessException(ErrorCode.FORBIDDEN, "Merchant ownership validation failed");
        }
        statePolicy.validateCanCapture(intent.getStatus());

        // Deterministic Lock Ordering: Customer Account & Merchant Settlement Account
        String accountA = intent.getCustomerAccountNumber();
        String accountB = "MERCHANT-SETTLEMENT-" + merchantId;

        Account firstLock, secondLock;
        if (accountA.compareTo(accountB) < 0) {
            firstLock = accountPersistencePort.findByAccountNumberForUpdate(accountA)
                .orElseThrow(() -> new BusinessException(ErrorCode.NOT_FOUND, "Account not found: " + accountA));
            secondLock = accountPersistencePort.findByAccountNumberForUpdate(accountB)
                .orElseThrow(() -> new BusinessException(ErrorCode.NOT_FOUND, "Account not found: " + accountB));
        } else {
            firstLock = accountPersistencePort.findByAccountNumberForUpdate(accountB)
                .orElseThrow(() -> new BusinessException(ErrorCode.NOT_FOUND, "Account not found: " + accountB));
            secondLock = accountPersistencePort.findByAccountNumberForUpdate(accountA)
                .orElseThrow(() -> new BusinessException(ErrorCode.NOT_FOUND, "Account not found: " + accountA));
        }

        Account sourceAccount = accountA.equals(firstLock.getAccountNumber()) ? firstLock : secondLock;
        Account merchantSettlementAccount = accountB.equals(firstLock.getAccountNumber()) ? firstLock : secondLock;

        // Validate Available Funds
        if (sourceAccount.getBalance().compareTo(intent.getAmount()) < 0) {
            throw new BusinessException(ErrorCode.INSUFFICIENT_FUNDS, "Insufficient funds for capture");
        }

        // Financial Mutation: Update Balance for both accounts
        sourceAccount.setBalance(sourceAccount.getBalance().subtract(intent.getAmount()));
        merchantSettlementAccount.setBalance(merchantSettlementAccount.getBalance().add(intent.getAmount()));
        
        accountPersistencePort.save(sourceAccount);
        accountPersistencePort.save(merchantSettlementAccount);

        // Create Transaction & Double-Entry Ledger
        String txRef = "INT-CAP-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
        
        LedgerEntry debitEntry = LedgerEntry.builder()
                .transactionReference(txRef)
                .accountNumber(sourceAccount.getAccountNumber())
                .entryType(EntryType.DEBIT)
                .amount(intent.getAmount())
                .currency(intent.getCurrency())
                .build();

        LedgerEntry creditEntry = LedgerEntry.builder()
                .transactionReference(txRef)
                .accountNumber(merchantSettlementAccount.getAccountNumber())
                .entryType(EntryType.CREDIT)
                .amount(intent.getAmount())
                .currency(intent.getCurrency())
                .build();

        ledgerPersistencePort.saveLedgerEntries(Arrays.asList(debitEntry, creditEntry));

        Transaction transaction = Transaction.builder()
                .transactionReference(txRef)
                .idempotencyKey(captureIdempotencyKey)
                .sourceAccountNumber(sourceAccount.getAccountNumber())
                .destinationAccountNumber("MERCHANT-SETTLEMENT-" + merchantId)
                .amount(intent.getAmount())
                .currency(intent.getCurrency())
                .status(TransactionStatus.COMPLETED)
                .description("Internal Payment Capture: " + intentId)
                .build();
                
        try {
            // DB constraint UNIQUE(idempotency_key) guarantees exactly-once execution
            ledgerPersistencePort.save(transaction);
        } catch (DataIntegrityViolationException e) {
            throw new ConflictException("Capture operation is idempotent. Blocked at database level.");
        }

        // Transition State
        intent.setStatus(PaymentIntentStatus.CAPTURED);
        PaymentIntent savedIntent = paymentIntentRepository.save(intent);

        // Enqueue Outbox Event atomically within the transaction
        outboxService.enqueuePaymentSucceeded(savedIntent, transaction);

        return savedIntent;
    }

    /**
     * Phase 4B: Canonical CANCEL flow.
     * Atomically validates state and ownership, then transitions to CANCELLED.
     * Guaranteed to produce NO financial ledger mutations.
     */
    @Transactional
    public PaymentIntent cancelPayment(String intentId, Long merchantId, String cancelIdempotencyKey) {
        log.info("[INTERNAL GATEWAY] Cancelling payment intent: {}", intentId);

        // LOCK 1: PaymentIntent (Pessimistic Lock)
        PaymentIntent intent = paymentIntentRepository.findByIntentIdForUpdate(intentId)
                .orElseThrow(() -> new BusinessException(ErrorCode.NOT_FOUND, "Payment Intent not found"));

        // Validate Ownership
        if (!intent.getMerchantId().equals(merchantId)) {
            throw new BusinessException(ErrorCode.FORBIDDEN, "Merchant ownership validation failed");
        }

        // Idempotency & State Validation
        PaymentIntentStatus currentState = intent.getStatus();
        
        if (currentState == PaymentIntentStatus.CANCELLED) {
            log.info("Payment {} is already cancelled. Idempotent return.", intentId);
            return intent; // Idempotent success
        }

        statePolicy.validateCanCancel(currentState);

        // Transition State
        intent.setStatus(PaymentIntentStatus.CANCELLED);
        PaymentIntent savedIntent = paymentIntentRepository.save(intent);

        // Audit Trail (No LedgerEntries or Transactions are created)
        auditEventPublisher.publishEvent(
            "PAYMENT_CANCELLED", 
            merchantId.toString(), 
            "Payment " + intentId + " successfully cancelled.", 
            cancelIdempotencyKey
        );

        return savedIntent;
    }

    /**
     * Phase 4C: Canonical EXPIRE flow.
     * System-driven expiration (no merchant ownership validation).
     * Enforces the pessimistic lock to guarantee serialization against CAPTURE operations.
     */
    @Transactional
    public PaymentIntent expirePayment(String intentId, String expireIdempotencyKey) {
        log.info("[INTERNAL GATEWAY] Expiring payment intent: {}", intentId);

        // LOCK 1: PaymentIntent (Pessimistic Lock ensures CAPTURE and EXPIRE are serialized)
        PaymentIntent intent = paymentIntentRepository.findByIntentIdForUpdate(intentId)
                .orElseThrow(() -> new BusinessException(ErrorCode.NOT_FOUND, "Payment Intent not found"));

        PaymentIntentStatus currentState = intent.getStatus();
        
        // Idempotency check
        if (currentState == PaymentIntentStatus.EXPIRED) {
            log.info("Payment {} is already expired. Idempotent return.", intentId);
            return intent;
        }

        // Re-check state while holding the lock
        statePolicy.validateCanExpire(currentState);

        intent.setStatus(PaymentIntentStatus.EXPIRED);
        PaymentIntent savedIntent = paymentIntentRepository.save(intent);

        // Audit Trail (System action, no financial mutations)
        auditEventPublisher.publishEvent(
            "PAYMENT_EXPIRED", 
            "SYSTEM", // System-driven identity
            "Payment " + intentId + " automatically expired due to timeout.", 
            expireIdempotencyKey
        );

        return savedIntent;
    }

    /**
     * Phase 4D: Canonical REFUND flow.
     * Atomically validates state, calculates remaining refundable amount, reverses ledger balances,
     * and transitions intent to PARTIALLY_REFUNDED or REFUNDED.
     */
    @Transactional
    public Refund refundPayment(String intentId, Long merchantId, String refundId, BigDecimal refundAmount, String reason) {
        log.info("[INTERNAL GATEWAY] Refunding payment intent: {} for amount: {}", intentId, refundAmount);

        if (refundAmount.compareTo(BigDecimal.ZERO) <= 0) {
            throw new BusinessException(ErrorCode.INVALID_REQUEST, "Refund amount must be greater than zero");
        }

        // Preliminary Idempotency Check (Backed by DB UNIQUE constraint on refund_id)
        Optional<Refund> existingRefund = refundRepository.findByRefundId(refundId);
        if (existingRefund.isPresent()) {
            log.info("Refund {} already processed. Idempotent return.", refundId);
            return existingRefund.get();
        }

        // LOCK 1: PaymentIntent (Pessimistic Lock)
        PaymentIntent intent = paymentIntentRepository.findByIntentIdForUpdate(intentId)
                .orElseThrow(() -> new BusinessException(ErrorCode.NOT_FOUND, "Payment Intent not found"));

        // Validate Ownership & State
        if (!intent.getMerchantId().equals(merchantId)) {
            throw new BusinessException(ErrorCode.FORBIDDEN, "Merchant ownership validation failed");
        }
        statePolicy.validateCanRefund(intent.getStatus());

        // Mathematical Invariant Check: total_refunded + new_refund <= captured_amount
        BigDecimal totalRefunded = refundRepository.sumCompletedRefundsByPaymentIntentId(intent.getId());
        BigDecimal remainingRefundable = intent.getAmount().subtract(totalRefunded);

        if (refundAmount.compareTo(remainingRefundable) > 0) {
            throw new BusinessException(ErrorCode.INVALID_REQUEST, 
                String.format("Refund amount (%.2f) exceeds remaining refundable amount (%.2f)", refundAmount, remainingRefundable));
        }

        // Deterministic Lock Ordering: Customer Account & Merchant Settlement Account
        String accountA = intent.getCustomerAccountNumber();
        String accountB = "MERCHANT-SETTLEMENT-" + merchantId;

        Account firstLock, secondLock;
        if (accountA.compareTo(accountB) < 0) {
            firstLock = accountPersistencePort.findByAccountNumberForUpdate(accountA)
                .orElseThrow(() -> new BusinessException(ErrorCode.NOT_FOUND, "Account not found: " + accountA));
            secondLock = accountPersistencePort.findByAccountNumberForUpdate(accountB)
                .orElseThrow(() -> new BusinessException(ErrorCode.NOT_FOUND, "Account not found: " + accountB));
        } else {
            firstLock = accountPersistencePort.findByAccountNumberForUpdate(accountB)
                .orElseThrow(() -> new BusinessException(ErrorCode.NOT_FOUND, "Account not found: " + accountB));
            secondLock = accountPersistencePort.findByAccountNumberForUpdate(accountA)
                .orElseThrow(() -> new BusinessException(ErrorCode.NOT_FOUND, "Account not found: " + accountA));
        }

        Account customerAccount = accountA.equals(firstLock.getAccountNumber()) ? firstLock : secondLock;
        Account merchantSettlementAccount = accountB.equals(firstLock.getAccountNumber()) ? firstLock : secondLock;

        // Financial Mutation: Return funds to customer, deduct from merchant
        customerAccount.setBalance(customerAccount.getBalance().add(refundAmount));
        merchantSettlementAccount.setBalance(merchantSettlementAccount.getBalance().subtract(refundAmount));
        
        accountPersistencePort.save(customerAccount);
        accountPersistencePort.save(merchantSettlementAccount);

        // Reverse Transaction & Double-Entry Ledger
        String txRef = "INT-REF-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();

        LedgerEntry debitEntry = LedgerEntry.builder()
                .transactionReference(txRef)
                .accountNumber(merchantSettlementAccount.getAccountNumber()) // Debiting the merchant
                .entryType(EntryType.DEBIT)
                .amount(refundAmount)
                .currency(intent.getCurrency())
                .build();

        LedgerEntry creditEntry = LedgerEntry.builder()
                .transactionReference(txRef)
                .accountNumber(customerAccount.getAccountNumber()) // Crediting the customer
                .entryType(EntryType.CREDIT)
                .amount(refundAmount)
                .currency(intent.getCurrency())
                .build();

        ledgerPersistencePort.saveLedgerEntries(Arrays.asList(debitEntry, creditEntry));

        Transaction transaction = Transaction.builder()
                .transactionReference(txRef)
                .idempotencyKey(refundId) // The refundId doubles as the transaction idempotency key
                .sourceAccountNumber(merchantSettlementAccount.getAccountNumber())
                .destinationAccountNumber(customerAccount.getAccountNumber())
                .amount(refundAmount)
                .currency(intent.getCurrency())
                .status(TransactionStatus.COMPLETED)
                .description("Refund for Payment: " + intentId + " - " + reason)
                .build();

        try {
            ledgerPersistencePort.save(transaction);
        } catch (DataIntegrityViolationException e) {
            throw new ConflictException("Refund operation is idempotent. Blocked at database level.");
        }

        // Save Refund Record
        Refund refund = Refund.builder()
                .refundId(refundId)
                .paymentIntentId(intent.getId())
                .amount(refundAmount)
                .reason(reason)
                .status("COMPLETED")
                .build();
        
        try {
            refund = refundRepository.save(refund);
        } catch (DataIntegrityViolationException e) {
            throw new ConflictException("Refund operation is idempotent. Blocked at database level.");
        }

        // Determine next PaymentIntent state
        BigDecimal newTotalRefunded = totalRefunded.add(refundAmount);
        if (newTotalRefunded.compareTo(intent.getAmount()) == 0) {
            intent.setStatus(PaymentIntentStatus.REFUNDED);
        } else {
            intent.setStatus(PaymentIntentStatus.PARTIALLY_REFUNDED);
        }
        paymentIntentRepository.save(intent);

        // Audit Trail
        auditEventPublisher.publishEvent("PAYMENT_REFUNDED", merchantId.toString(), 
            "Successfully refunded " + refundAmount + " for payment " + intentId, refundId);

        // Enqueue Outbox Event atomically within the transaction
        outboxService.enqueuePaymentRefunded(intent, refund);

        return refund;
    }
}
