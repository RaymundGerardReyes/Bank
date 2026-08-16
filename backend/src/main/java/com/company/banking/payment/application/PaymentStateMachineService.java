package com.company.banking.payment.application;

import com.company.banking.account.application.port.out.AccountPersistencePort;
import com.company.banking.account.domain.Account;
import com.company.banking.common.audit.AuditEventPublisher;
import com.company.banking.notification.application.SendTransactionAlertService;
import com.company.banking.payment.domain.PaymentEvent;
import com.company.banking.payment.domain.PaymentIntent;
import com.company.banking.payment.gateway.ExternalPaymentGateway;
import com.company.banking.payment.gateway.dto.GatewayPaymentStatus;
import com.company.banking.payment.infrastructure.PaymentEventJpaRepository;
import com.company.banking.payment.infrastructure.PaymentIntentJpaRepository;
import com.company.banking.transaction.application.port.out.LedgerPersistencePort;
import com.company.banking.transaction.domain.EntryType;
import com.company.banking.transaction.domain.LedgerEntry;
import com.company.banking.transaction.domain.Transaction;
import com.company.banking.transaction.domain.TransactionStatus;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.company.banking.payment.infrastructure.PaymentAttemptJpaRepository;
import com.company.banking.payment.infrastructure.PaymentSessionJpaRepository;
import com.company.banking.payment.domain.PaymentAttempt;
import com.company.banking.payment.domain.PaymentSession;
import com.company.banking.payment.domain.PaymentSessionStatus;
import com.company.banking.common.exception.BusinessException;
import com.company.banking.common.exception.ErrorCode;
import com.company.banking.payment.domain.PaymentIntentStatus;
import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class PaymentStateMachineService {

    private final PaymentEventJpaRepository eventRepository;
    private final PaymentIntentJpaRepository intentRepository;
    private final List<ExternalPaymentGateway> gateways;
    private final LedgerPersistencePort ledgerPersistencePort;
    private final AccountPersistencePort accountPersistencePort;
    private final AuditEventPublisher auditEventPublisher;
    private final SendTransactionAlertService notificationService;
    private final PaymentAttemptJpaRepository attemptRepository;
    private final PaymentSessionJpaRepository sessionRepository;
    private final InstitutionCallbackService institutionCallbackService;
    
    @Async
    @Transactional
    public void processWebhookEventAsync(Long eventId, String providerName) {
        PaymentEvent event = eventRepository.findById(eventId).orElseThrow();
        
        String providerReference = "extracted_ref_from_payload"; 
        
        ExternalPaymentGateway gateway = gateways.stream()
                .filter(g -> g.getProvider().name().equalsIgnoreCase(providerName))
                .findFirst()
                .orElseThrow();

        GatewayPaymentStatus status = gateway.getStatus(providerReference);
        
        PaymentIntent intent = intentRepository.findAll().stream().findFirst().orElseThrow();
        
        event.setPaymentIntentId(intent.getId());
        eventRepository.save(event);

        transitionState(intent, status);
    }

    private void transitionState(PaymentIntent intent, GatewayPaymentStatus gatewayStatus) {
        PaymentIntentStatus newStatus;
        try {
            newStatus = PaymentIntentStatus.valueOf(gatewayStatus.name());
        } catch (Exception e) {
            newStatus = PaymentIntentStatus.PROCESSING;
        }

        log.info("Transitioning PaymentIntent {} from {} to {}", intent.getIntentId(), intent.getStatus(), newStatus);
        
        if (intent.getStatus() == newStatus) {
            return; 
        }

        if (newStatus == PaymentIntentStatus.SUCCESS) {
            finalizeSuccessfulPayment(intent);
        } else if (newStatus == PaymentIntentStatus.FAILED || newStatus == PaymentIntentStatus.CANCELLED || newStatus == PaymentIntentStatus.EXPIRED) {
            revertFailedPayment(intent);
        }

        intent.setStatus(newStatus);
        intentRepository.save(intent);
    }

    private void finalizeSuccessfulPayment(PaymentIntent intent) {
        log.info("Finalizing successful payment for intent {}", intent.getIntentId());
        
        String txRef = "TXN-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
        
        // 1. Create Ledger Entries (Credit the Merchant, Debit was held in Phase 4)
        LedgerEntry debitEntry = LedgerEntry.builder()
                .transactionReference(txRef)
                .accountNumber(intent.getCustomerAccountNumber())
                .entryType(EntryType.DEBIT)
                .amount(intent.getAmount())
                .currency(intent.getCurrency())
                .build();

        LedgerEntry creditEntry = LedgerEntry.builder()
                .transactionReference(txRef)
                .accountNumber("MERCHANT-" + intent.getMerchantId())
                .entryType(EntryType.CREDIT)
                .amount(intent.getAmount())
                .currency(intent.getCurrency())
                .build();

        ledgerPersistencePort.saveLedgerEntries(Arrays.asList(debitEntry, creditEntry));

        // 2. Create Core Bank Transaction Record
        Transaction tx = Transaction.builder()
                .transactionReference(txRef)
                .idempotencyKey(intent.getIntentId())
                .sourceAccountNumber(intent.getCustomerAccountNumber())
                .destinationAccountNumber("MERCHANT-" + intent.getMerchantId())
                .amount(intent.getAmount())
                .currency(intent.getCurrency())
                .status(TransactionStatus.COMPLETED)
                .description(intent.getDescription())
                .build();
        ledgerPersistencePort.save(tx);

        // 3. Publish Audit & Email Notification
        auditEventPublisher.publishEvent("PAYMENT_SUCCESS", "SYSTEM", "Payment completed for intent " + intent.getIntentId(), intent.getIntentId());
        
        // Look up customer email directly via relationships in production; hardcoded for stub
        notificationService.sendTransactionAlert("customer@company.com", "Your payment of " + intent.getAmount() + " " + intent.getCurrency() + " was successful.");
    }

    private void revertFailedPayment(PaymentIntent intent) {
        log.info("Reverting funds hold for failed payment intent {}", intent.getIntentId());
        
        Account account = accountPersistencePort.findByAccountNumber(intent.getCustomerAccountNumber()).orElseThrow();
        
        // Refund the temporarily held balance back to the customer's active balance
        account.setBalance(account.getBalance().add(intent.getAmount()));
        accountPersistencePort.save(account);

        auditEventPublisher.publishEvent("PAYMENT_FAILED_REVERTED", "SYSTEM", "Payment failed, hold released for intent " + intent.getIntentId(), intent.getIntentId());
    }
    @Transactional
    public void processAttemptOutcome(String providerReference, String newStatus, String gatewayResponse) {
        log.info("[STATE MACHINE] Processing outcome for providerRef: {} -> {}", providerReference, newStatus);

        PaymentAttempt attempt = attemptRepository.findByProviderReference(providerReference)
                .orElseThrow(() -> new BusinessException(ErrorCode.NOT_FOUND, "Payment attempt not found for provider reference: " + providerReference));

        // Idempotency guard: Prevent processing if the attempt is already finalized
        if ("SUCCESS".equals(attempt.getStatus()) || "FAILED".equals(attempt.getStatus()) || "CANCELLED".equals(attempt.getStatus())) {
            log.warn("[STATE MACHINE] Attempt {} is already in terminal state: {}. Ignoring redundant webhook.", attempt.getAttemptId(), attempt.getStatus());
            return;
        }

        // 1. Update internal attempt state
        attempt.setStatus(newStatus);
        attemptRepository.save(attempt);

        // 2. Safely propagate to the 2D Institution Session state
        if (attempt.getPaymentSessionId() != null && !attempt.getPaymentSessionId().isBlank()) {
            propagateAttemptResultToSession(attempt);
        }
    }

    private void propagateAttemptResultToSession(PaymentAttempt attempt) {
        log.info("[STATE MACHINE] Propagating attempt {} result ({}) to session {}", 
                attempt.getAttemptId(), attempt.getStatus(), attempt.getPaymentSessionId());

        PaymentSession session = sessionRepository.findBySessionId(attempt.getPaymentSessionId())
                .orElseThrow(() -> new BusinessException(ErrorCode.NOT_FOUND, "Payment session not found: " + attempt.getPaymentSessionId()));

        // Guard: If the session is already terminal, we halt propagation.
        if (session.getStatus() == PaymentSessionStatus.SUCCESS || 
            session.getStatus() == PaymentSessionStatus.COMPLETED ||
            session.getStatus() == PaymentSessionStatus.EXPIRED) {
            log.warn("[STATE MACHINE] Session {} is already terminal ({}). Skipping propagation.", session.getSessionId(), session.getStatus());
            return;
        }

        if ("SUCCESS".equalsIgnoreCase(attempt.getStatus())) {
            session.setStatus(PaymentSessionStatus.SUCCESS);
            session.setCompletedAt(LocalDateTime.now());
            sessionRepository.save(session);
            
            log.info("[STATE MACHINE] Session {} resolved to SUCCESS. Triggering Phase E institution callback.", session.getSessionId());
            institutionCallbackService.notify(session); 
            
        } else if ("FAILED".equalsIgnoreCase(attempt.getStatus()) || "CANCELLED".equalsIgnoreCase(attempt.getStatus())) {
            // CRITICAL ARCHITECTURE RULE: Do NOT close the session on a failed attempt.
            // Allow the frontend to return the customer to the Payment Method Selector to retry.
            session.setStatus(PaymentSessionStatus.ACTIVE);
            sessionRepository.save(session);
            log.info("[STATE MACHINE] Attempt {} failed. Session {} safely reverted to ACTIVE to permit customer retry.", attempt.getAttemptId(), session.getSessionId());
        }
    }

}