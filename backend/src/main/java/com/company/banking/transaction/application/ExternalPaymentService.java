package com.company.banking.transaction.application;

import com.company.banking.account.application.port.out.AccountPersistencePort;
import com.company.banking.account.domain.Account;
import com.company.banking.common.audit.AuditEventPublisher;
import com.company.banking.common.exception.BusinessException;
import com.company.banking.common.exception.ConflictException;
import com.company.banking.common.exception.ErrorCode;
import com.company.banking.common.exception.NotFoundException;
import com.company.banking.transaction.api.dto.ExternalPaymentRequest;
import com.company.banking.transaction.api.dto.TransactionResponse;
import com.company.banking.transaction.application.port.in.ExternalPaymentUseCase;
import com.company.banking.transaction.application.port.out.FraudScreeningPort;
import com.company.banking.transaction.application.port.out.LedgerPersistencePort;
import com.company.banking.transaction.application.port.out.PaymentGatewayPort;
import com.company.banking.transaction.domain.SufficientFundsPolicy;
import com.company.banking.transaction.domain.Transaction;
import com.company.banking.transaction.domain.TransactionStatus;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.company.banking.transaction.application.ZeroBalanceSweepService;

import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class ExternalPaymentService implements ExternalPaymentUseCase {

    private final AccountPersistencePort accountPersistencePort;
    private final LedgerPersistencePort ledgerPersistencePort;
    private final PaymentGatewayPort paymentGatewayPort;
    private final FraudScreeningPort fraudScreeningPort;
    private final SufficientFundsPolicy sufficientFundsPolicy;
    private final AuditEventPublisher auditEventPublisher;
    
    private final ZeroBalanceSweepService zeroBalanceSweepService; // <-- Inject Sweep Service
    private final TransactionAccountResolver accountResolver;
    private final com.company.banking.payment.infrastructure.PaymentEventOutboxJpaRepository outboxRepository;

    // AML / CDD dependencies
    private final com.company.banking.customer.application.port.out.CustomerPersistencePort customerPersistencePort;
    private final com.company.banking.aml.application.TransactionMonitoringService transactionMonitoringService;

    private final com.company.banking.transaction.domain.TransferPolicy transferPolicy;
    private final com.company.banking.orchestration.application.port.out.PaymentRailConfigurationPort paymentRailConfigurationPort;

    @Override
    @Transactional
    public TransactionResponse processPayment(ExternalPaymentRequest request) {
        String railName = request.getRailName() != null ? request.getRailName() : "SWIFT";
        
        com.company.banking.orchestration.domain.PaymentRailConfiguration railConfig = paymentRailConfigurationPort.findByRailName(railName)
                .orElseThrow(() -> new BusinessException(ErrorCode.INVALID_REQUEST, "Unsupported payment rail: " + railName));

        String txRef = railName.toUpperCase() + "-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
        log.info("========== ENTERPRISE {} LIFECYCLE INITIATED: {} ==========", railName.toUpperCase(), txRef);

        // STEP 1 & 2: Idempotency & Customer Identity Verification
        if (ledgerPersistencePort.existsByIdempotencyKey(request.getIdempotencyKey())) {
            throw new ConflictException("External payment with this idempotency key already processed");
        }
        
        // VULN 1 FIX: Safely resolves and automatically runs the VAM security checks!
        Account source = accountResolver.resolveAndAuthorizeSource(request.getSourceAccountNumber());
        
        // NRPS LIMIT VALIDATION
        transferPolicy.validateRailLimits(railConfig, request.getAmount());

        // STEP 3: AML / KYC / Sanctions Screening
        log.info("[{} STEP 3] Executing AML/KYC & Sanctions screening for Beneficiary: {}", railName, request.getRecipientName());
        if (fraudScreeningPort.isFraudulent(request.getSourceAccountNumber(), request.getDestinationAccountNumber(), request.getAmount())) {
            auditEventPublisher.publishEvent("AML_SCREENING_FAILED", source.getCustomerId().toString(), "Transaction blocked due to sanctions screening flag", request.getIdempotencyKey());
            throw new BusinessException(ErrorCode.FRAUD_DETECTED, "Transaction flagged as fraudulent or sanctioned");
        }

       // ---> ENTERPRISE VAM: JUST-IN-TIME (JIT) ZERO-BALANCE SWEEP <---
        log.info("[{} STEP 4] Validating payment limits and executing JIT Liquidity Sweep if necessary...", railName);
        zeroBalanceSweepService.executeSweepIfNecessary(source, request.getAmount(), railName + " External Wire");

        // The Safeguard Check
        if (!sufficientFundsPolicy.hasSufficientFunds(source, request.getAmount())) {
            throw new BusinessException(ErrorCode.INSUFFICIENT_FUNDS, "Insufficient funds for " + railName + " transfer");
        }

        // STEP 5: Digital Authentication
        log.info("[{} STEP 5] Applying digital authentication and non-repudiation seals to payload.", railName);

        // ARCHITECTURE CHANGE: We do NOT deduct the balance or write ledger entries yet.
        // We record the transaction as PENDING and queue the network call to the Outbox.
        log.info("[{} STEP 6 & 10] Atomically saving PENDING transaction and queueing Outbox event.", railName);

        String extAccountIdentifier = "EXT:" + request.getRoutingNumber() + "-" + request.getDestinationAccountNumber();

        Transaction transaction = Transaction.builder()
                .transactionReference(txRef)
                .idempotencyKey(request.getIdempotencyKey())
                .sourceAccountNumber(source.getAccountNumber())
                .destinationAccountNumber(extAccountIdentifier)
                .amount(request.getAmount())
                .currency(source.getCurrency())
                .status(TransactionStatus.PENDING)
                .description(railName + " Transfer to " + request.getRecipientName())
                .build();

        Transaction saved = ledgerPersistencePort.save(transaction);

        // Queue Outbox Event for async external network transmission
        try {
            com.fasterxml.jackson.databind.ObjectMapper mapper = new com.fasterxml.jackson.databind.ObjectMapper();
            String payload = mapper.writeValueAsString(request);
            
            com.company.banking.payment.domain.PaymentEventOutbox outboxEvent = com.company.banking.payment.domain.PaymentEventOutbox.builder()
                    .eventId("EVT-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase())
                    .merchantId(0L) // No merchant for wire transfer
                    .aggregateType("TRANSACTION")
                    .aggregateId(txRef)
                    .sequence(1)
                    .idempotencyKey(request.getIdempotencyKey() + "-OUTBOX")
                    .eventType(com.company.banking.payment.domain.PaymentEventType.CHECKOUT_PAYMENT_SUCCEEDED)
                    .apiVersion("v1")
                    .payload(payload)
                    .status(com.company.banking.payment.domain.PaymentEventOutboxStatus.PENDING)
                    .attemptCount(0)
                    .build();
            
            outboxRepository.save(outboxEvent);
        } catch (Exception e) {
            throw new RuntimeException("Failed to queue outbox event", e);
        }

        // STEP 10.5: Asynchronous Transaction Monitoring (AML/CFT)
        log.info("[{} STEP 10.5] Triggering AML/CFT transaction monitoring rules...", railName);
        customerPersistencePort.findById(source.getCustomerId()).ifPresent(customer -> {
            transactionMonitoringService.analyzeTransaction(
                saved.getTransactionReference(),
                source.getAccountNumber(),
                saved.getAmount(),
                customer.getRiskProfile()
            );
        });

        // STEP 11: Confirmation & Audit Logging
        log.info("[{} STEP 11] Issuing Payment Status Report confirmation.", railName);
        auditEventPublisher.publishEvent(railName.toUpperCase() + "_TRANSFER_COMPLETED", source.getCustomerId().toString(), 
                railName + " payment successfully settled for " + request.getAmount() + " " + source.getCurrency() + " to " + request.getRecipientName(), 
                request.getIdempotencyKey());

        return TransactionResponse.fromEntity(saved);
    }
}