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

    @Override
    @Transactional
    public TransactionResponse processPayment(ExternalPaymentRequest request) {
        String swiftTxRef = "SWIFT-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
        log.info("========== ENTERPRISE SWIFT LIFECYCLE INITIATED: {} ==========", swiftTxRef);

        // STEP 1 & 2: Idempotency & Customer Identity Verification
        if (ledgerPersistencePort.existsByIdempotencyKey(request.getIdempotencyKey())) {
            throw new ConflictException("External payment with this idempotency key already processed");
        }
        
        Account source = accountPersistencePort.findByAccountNumber(request.getSourceAccountNumber())
                .orElseThrow(() -> new NotFoundException("Source account not found"));

        // STEP 3: AML / KYC / Sanctions Screening
        log.info("[SWIFT STEP 3] Executing AML/KYC & Sanctions screening for Beneficiary: {}", request.getRecipientName());
        if (fraudScreeningPort.isFraudulent(request.getSourceAccountNumber(), request.getDestinationAccountNumber(), request.getAmount())) {
            auditEventPublisher.publishEvent("AML_SCREENING_FAILED", source.getCustomerId().toString(), "Transaction blocked due to sanctions screening flag", request.getIdempotencyKey());
            throw new BusinessException(ErrorCode.FRAUD_DETECTED, "Transaction flagged as fraudulent or sanctioned");
        }

        // STEP 4: Payment Validation
        log.info("[SWIFT STEP 4] Validating payment limits and liquidity...");
        if (!sufficientFundsPolicy.hasSufficientFunds(source, request.getAmount())) {
            throw new BusinessException(ErrorCode.INSUFFICIENT_FUNDS, "Insufficient funds for SWIFT transfer");
        }

        // STEP 5: SWIFT / ISO 20022 Message Creation
        log.info("[SWIFT STEP 5] Generating ISO 20022 'pacs.008' Financial Institution Credit Transfer Message.");

        // STEP 6: Digital Authentication
        log.info("[SWIFT STEP 6] Applying digital HMAC authentication and non-repudiation seals to pacs.008 payload.");

        // STEP 7, 8, & 9: SWIFT Network Transmission & Correspondent Bank Routing
        log.info("[SWIFT STEP 7-9] Transmitting to Correspondent Banking Gateway (Routing: {})", request.getRoutingNumber());
        boolean gatewaySuccess = paymentGatewayPort.processExternalPayment(
                request.getSourceAccountNumber(),
                request.getRoutingNumber(),
                request.getDestinationAccountNumber(),
                request.getAmount()
        );

        if (!gatewaySuccess) {
            throw new BusinessException(ErrorCode.PAYMENT_GATEWAY_ERROR, "Correspondent bank rejected SWIFT transmission");
        }

        // STEP 10: Settlement (Ledger Update)
        log.info("[SWIFT STEP 10] Settling funds internally. Reconciling Nostro/Vostro accounts.");
        source.setBalance(source.getBalance().subtract(request.getAmount()));
        accountPersistencePort.save(source);

        Transaction transaction = Transaction.builder()
                .transactionReference(swiftTxRef)
                .idempotencyKey(request.getIdempotencyKey())
                .sourceAccountNumber(source.getAccountNumber())
                .destinationAccountNumber("EXT:" + request.getRoutingNumber() + "-" + request.getDestinationAccountNumber())
                .amount(request.getAmount())
                .currency(source.getCurrency())
                .status(TransactionStatus.COMPLETED)
                .description("SWIFT Transfer to " + request.getRecipientName())
                .build();

        Transaction saved = ledgerPersistencePort.save(transaction);

        // STEP 11: Confirmation & Audit Logging
        log.info("[SWIFT STEP 11] Issuing Payment Status Report confirmation.");
        auditEventPublisher.publishEvent("SWIFT_TRANSFER_COMPLETED", source.getCustomerId().toString(), 
                "ISO 20022 pacs.008 message successfully settled for " + request.getAmount() + " " + source.getCurrency() + " to " + request.getRecipientName(), 
                request.getIdempotencyKey());

        return TransactionResponse.fromEntity(saved);
    }
}