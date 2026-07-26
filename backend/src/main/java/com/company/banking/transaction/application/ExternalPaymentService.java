package com.company.banking.transaction.application;

import com.company.banking.account.application.port.out.AccountPersistencePort;
import com.company.banking.account.domain.Account;
import com.company.banking.common.exception.BusinessException;
import com.company.banking.common.exception.ConflictException;
import com.company.banking.common.exception.ErrorCode;
import com.company.banking.common.exception.NotFoundException;
import com.company.banking.transaction.api.dto.ExternalPaymentRequest;
import com.company.banking.transaction.api.dto.TransactionResponse;
import com.company.banking.transaction.application.port.out.FraudScreeningPort;
import com.company.banking.transaction.application.port.out.LedgerPersistencePort;
import com.company.banking.transaction.application.port.out.PaymentGatewayPort;
import com.company.banking.transaction.domain.SufficientFundsPolicy;
import com.company.banking.transaction.domain.Transaction;
import com.company.banking.transaction.domain.TransactionStatus;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ExternalPaymentService {

    private final AccountPersistencePort accountPersistencePort;
    private final LedgerPersistencePort ledgerPersistencePort;
    private final PaymentGatewayPort paymentGatewayPort;
    private final FraudScreeningPort fraudScreeningPort;
    private final SufficientFundsPolicy sufficientFundsPolicy;

    @Transactional
    public TransactionResponse processPayment(ExternalPaymentRequest request) {
        if (ledgerPersistencePort.existsByIdempotencyKey(request.getIdempotencyKey())) {
            throw new ConflictException("External payment with this idempotency key already processed");
        }

        if (fraudScreeningPort.isFraudulent(request.getSourceAccountNumber(), request.getDestinationAccountNumber(), request.getAmount())) {
            throw new BusinessException(ErrorCode.FRAUD_DETECTED, "Transaction flagged as fraudulent");
        }

        Account source = accountPersistencePort.findByAccountNumber(request.getSourceAccountNumber())
                .orElseThrow(() -> new NotFoundException("Source account not found"));

        if (!sufficientFundsPolicy.hasSufficientFunds(source, request.getAmount())) {
            throw new BusinessException(ErrorCode.INSUFFICIENT_FUNDS, "Insufficient funds for external payment");
        }

        boolean gatewaySuccess = paymentGatewayPort.processExternalPayment(
                request.getSourceAccountNumber(), 
                request.getRoutingNumber(), 
                request.getDestinationAccountNumber(), 
                request.getAmount()
        );

        if (!gatewaySuccess) {
            throw new BusinessException(ErrorCode.PAYMENT_GATEWAY_ERROR, "External payment gateway rejected the transaction");
        }

        source.setBalance(source.getBalance().subtract(request.getAmount()));
        accountPersistencePort.save(source);

        Transaction transaction = Transaction.builder()
                .transactionReference("EXT-" + UUID.randomUUID())
                .idempotencyKey(request.getIdempotencyKey())
                .sourceAccountNumber(source.getAccountNumber())
                .destinationAccountNumber(request.getRoutingNumber() + "-" + request.getDestinationAccountNumber())
                .amount(request.getAmount())
                .currency(source.getCurrency())
                .status(TransactionStatus.COMPLETED)
                .description(request.getDescription())
                .build();

        Transaction saved = ledgerPersistencePort.save(transaction);
        return TransactionResponse.fromEntity(saved);
    }
}
