package com.company.banking.transaction;

import com.company.banking.account.application.port.out.AccountPersistencePort;
import com.company.banking.account.domain.Account;
import com.company.banking.common.enums.AccountStatus;
import com.company.banking.common.exception.BusinessException;
import com.company.banking.common.exception.ConflictException;
import com.company.banking.common.exception.ErrorCode;
import com.company.banking.config.BaseIntegrationTest;
import com.company.banking.orchestration.domain.PaymentRailConfiguration;
import com.company.banking.orchestration.infrastructure.PaymentRailConfigurationJpaRepository;
import com.company.banking.transaction.api.dto.ExternalPaymentRequest;
import com.company.banking.transaction.api.dto.TransactionResponse;
import com.company.banking.transaction.application.ExternalPaymentService;
import com.company.banking.transaction.application.port.out.FraudScreeningPort;
import com.company.banking.transaction.domain.TransactionStatus;
import com.company.banking.transaction.infrastructure.TransactionJpaRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.bean.override.mockito.MockitoBean;

import java.math.BigDecimal;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;

import static org.mockito.Mockito.when;

public class ExternalPaymentWorkflowPathIT extends BaseIntegrationTest {

    @Autowired
    private ExternalPaymentService externalPaymentService;

    @Autowired
    private AccountPersistencePort accountPersistencePort;

    @Autowired
    private TransactionJpaRepository transactionRepository;

    @Autowired
    private PaymentRailConfigurationJpaRepository railRepository;

    @MockitoBean
    private FraudScreeningPort fraudScreeningPort;

    private Account sourceAccount;
    private long initialTxCount;

    @BeforeEach
    void setUp() {
        initialTxCount = transactionRepository.count();
        sourceAccount = accountPersistencePort.save(Account.builder()
                .accountNumber("ACC-EXT-" + UUID.randomUUID().toString().substring(0, 8))
                .customerId(301L)
                .balance(new BigDecimal("5000.00"))
                .currency("PHP")
                .status(AccountStatus.ACTIVE)
                .allowOutgoing(true).allowIncoming(true)
                .build());

        railRepository.findByRailName("SWIFT").orElseGet(() ->
                railRepository.save(PaymentRailConfiguration.builder()
                        .railName("SWIFT")
                        .processingType("BATCH")
                        .active(true)
                        .maxAmountPerTx(new BigDecimal("100000.00"))
                        .build())
        );

        when(fraudScreeningPort.isFraudulent(any(), any(), any())).thenReturn(false);
    }

    @Test
    @DisplayName("P01: External Wire Golden Path (SWIFT) - Queues Outbox event")
    void testExternalWireGoldenPath() {
        ExternalPaymentRequest request = ExternalPaymentRequest.builder()
                .sourceAccountNumber(sourceAccount.getAccountNumber())
                .destinationAccountNumber("EXT-NOVA-999")
                .routingNumber("ROUTING-1234")
                .recipientName("Nova Global")
                .amount(new BigDecimal("1000.00"))
                .railName("SWIFT")
                .idempotencyKey(UUID.randomUUID().toString())
                .build();

        TransactionResponse response = externalPaymentService.processPayment(request);

        assertNotNull(response.getTransactionReference());
        assertEquals(TransactionStatus.PENDING, response.getStatus(), "External wire should remain PENDING until Outbox resolves");
        assertTrue(transactionRepository.findByIdempotencyKey(request.getIdempotencyKey()).isPresent(), "Transaction must be saved");
    }

    @Test
    @DisplayName("P02: Unsupported Payment Rail Rejection")
    void testUnsupportedPaymentRailRejection() {
        ExternalPaymentRequest request = ExternalPaymentRequest.builder()
                .sourceAccountNumber(sourceAccount.getAccountNumber())
                .destinationAccountNumber("EXT-NOVA-999")
                .routingNumber("ROUTING-1234")
                .recipientName("Nova Global")
                .amount(new BigDecimal("1000.00"))
                .railName("INVALID_RAIL")
                .idempotencyKey(UUID.randomUUID().toString())
                .build();

        BusinessException exception = assertThrows(BusinessException.class, () -> {
            externalPaymentService.processPayment(request);
        });

        assertEquals(ErrorCode.INVALID_REQUEST, exception.getErrorCode());
        assertEquals(initialTxCount, transactionRepository.count());
    }

    @Test
    @DisplayName("P03: Fraud Screening Block - Rejects and audits")
    void testFraudScreeningBlock() {
        when(fraudScreeningPort.isFraudulent(any(), any(), any())).thenReturn(true);
        ExternalPaymentRequest request = ExternalPaymentRequest.builder()
                .sourceAccountNumber(sourceAccount.getAccountNumber())
                .destinationAccountNumber("EXT-NOVA-999")
                .routingNumber("ROUTING-1234")
                .recipientName("Nova Global")
                .amount(new BigDecimal("1000.00"))
                .railName("SWIFT")
                .idempotencyKey(UUID.randomUUID().toString())
                .build();

        BusinessException exception = assertThrows(BusinessException.class, () -> {
            externalPaymentService.processPayment(request);
        });

        assertEquals(ErrorCode.FRAUD_DETECTED, exception.getErrorCode());
        assertEquals(initialTxCount, transactionRepository.count(), "Fraud blocks must prevent ledger writes");
    }

    @Test
    @DisplayName("P04: Idempotency Guard — Duplicate Wire Prevention")
    void testDuplicateWirePrevention() {
        String sharedIdempotencyKey = "IDEMP-EXT-" + UUID.randomUUID().toString().substring(0, 8);
        ExternalPaymentRequest request = ExternalPaymentRequest.builder()
                .sourceAccountNumber(sourceAccount.getAccountNumber())
                .destinationAccountNumber("EXT-NOVA-999")
                .routingNumber("ROUTING-1234")
                .recipientName("Nova Global")
                .amount(new BigDecimal("1000.00"))
                .railName("SWIFT")
                .idempotencyKey(sharedIdempotencyKey)
                .build();

        externalPaymentService.processPayment(request);

        assertThrows(ConflictException.class, () -> {
            externalPaymentService.processPayment(request);
        });

        assertEquals(initialTxCount + 1, transactionRepository.count(), "Only one wire transaction should be processed");
    }
}
