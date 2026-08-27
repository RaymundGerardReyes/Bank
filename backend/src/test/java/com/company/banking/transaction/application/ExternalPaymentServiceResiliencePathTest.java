package com.company.banking.transaction.application;

import com.company.banking.account.domain.Account;
import com.company.banking.common.audit.AuditEventPublisher;
import com.company.banking.common.enums.AccountStatus;
import com.company.banking.common.exception.BusinessException;
import com.company.banking.common.exception.ConflictException;
import com.company.banking.common.exception.NotFoundException;
import com.company.banking.customer.application.port.out.CustomerPersistencePort;
import com.company.banking.customer.domain.Customer;
import com.company.banking.orchestration.application.port.out.PaymentRailConfigurationPort;
import com.company.banking.orchestration.domain.PaymentRailConfiguration;
import com.company.banking.payment.infrastructure.PaymentEventOutboxJpaRepository;
import com.company.banking.transaction.api.dto.ExternalPaymentRequest;
import com.company.banking.transaction.api.dto.TransactionResponse;
import com.company.banking.transaction.application.port.out.FraudScreeningPort;
import com.company.banking.transaction.application.port.out.LedgerPersistencePort;
import com.company.banking.transaction.domain.SufficientFundsPolicy;
import com.company.banking.transaction.domain.Transaction;
import com.company.banking.transaction.domain.TransactionStatus;
import com.company.banking.transaction.domain.TransferPolicy;
import com.company.banking.aml.application.TransactionMonitoringService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.dao.OptimisticLockingFailureException;
import org.springframework.dao.DataIntegrityViolationException;

import java.math.BigDecimal;
import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class ExternalPaymentServiceResiliencePathTest {

    @Mock private LedgerPersistencePort ledgerPersistencePort;
    @Mock private FraudScreeningPort fraudScreeningPort;
    @Mock private SufficientFundsPolicy sufficientFundsPolicy;
    @Mock private AuditEventPublisher auditEventPublisher;
    @Mock private ZeroBalanceSweepService zeroBalanceSweepService;
    @Mock private TransactionAccountResolver accountResolver;
    @Mock private PaymentEventOutboxJpaRepository outboxRepository;
    @Mock private CustomerPersistencePort customerPersistencePort;
    @Mock private TransactionMonitoringService transactionMonitoringService;
    @Mock private TransferPolicy transferPolicy;
    @Mock private PaymentRailConfigurationPort paymentRailConfigurationPort;

    @InjectMocks
    private ExternalPaymentService externalPaymentService;

    private Account validSourceAccount;
    private Customer mockCustomer;
    private PaymentRailConfiguration railConfig;
    private ExternalPaymentRequest baseRequest;

    @BeforeEach
    void setUp() {
        validSourceAccount = Account.builder()
                .accountNumber("ACC-SRC-100")
                .customerId(1L)
                .balance(new BigDecimal("50000.00"))
                .currency("PHP")
                .status(AccountStatus.ACTIVE)
                .allowOutgoing(true)
                .build();

        mockCustomer = Customer.builder()
                .id(1L)
                .riskProfile("LOW")
                .build();

        railConfig = PaymentRailConfiguration.builder()
                .railName("SWIFT")
                .build();

        baseRequest = ExternalPaymentRequest.builder()
                .sourceAccountNumber("ACC-SRC-100")
                .destinationAccountNumber("EXT-999-555")
                .routingNumber("SWIFT123")
                .recipientName("Global Corp")
                .amount(new BigDecimal("1000.00"))
                .railName("SWIFT")
                .idempotencyKey(UUID.randomUUID().toString())
                .build();
    }

    private void setupHappyPathDependencies() {
        lenient().when(paymentRailConfigurationPort.findByRailName(anyString())).thenReturn(Optional.of(railConfig));
        lenient().when(ledgerPersistencePort.existsByIdempotencyKey(anyString())).thenReturn(false);
        lenient().when(accountResolver.resolveAndAuthorizeSource(anyString())).thenReturn(validSourceAccount);
        lenient().doNothing().when(transferPolicy).validateRailLimits(any(), any());
        lenient().when(fraudScreeningPort.isFraudulent(anyString(), anyString(), any())).thenReturn(false);
        lenient().doNothing().when(zeroBalanceSweepService).executeSweepIfNecessary(any(), any(), anyString());
        lenient().when(sufficientFundsPolicy.hasSufficientFunds(any(), any())).thenReturn(true);
        lenient().when(ledgerPersistencePort.save(any(Transaction.class))).thenAnswer(invocation -> {
            Transaction tx = invocation.getArgument(0);
            tx.setId(1L);
            return tx;
        });
        lenient().when(customerPersistencePort.findById(anyLong())).thenReturn(Optional.of(mockCustomer));
        lenient().when(outboxRepository.save(any())).thenReturn(null);
    }

    @Test
    @DisplayName("P41: Throws ConflictException when Idempotency Key is reused")
    void p41_IdempotencyKeyReused_ShouldThrowConflict() {
        setupHappyPathDependencies();
        when(ledgerPersistencePort.existsByIdempotencyKey(anyString())).thenReturn(true);

        assertThrows(ConflictException.class, () -> {
            externalPaymentService.processPayment(baseRequest);
        });

        // Ensure outbox and ledger are never reached
        verify(ledgerPersistencePort, never()).save(any());
        verify(outboxRepository, never()).save(any());
    }

    @Test
    @DisplayName("P42: Gracefully handles Database Failure during ledger save and aborts outbox queueing")
    void p42_DatabaseFailure_LedgerSave_ShouldRollback() {
        setupHappyPathDependencies();
        when(ledgerPersistencePort.save(any(Transaction.class)))
                .thenThrow(new DataIntegrityViolationException("Database unavailable"));

        assertThrows(DataIntegrityViolationException.class, () -> {
            externalPaymentService.processPayment(baseRequest);
        });

        // Outbox event MUST NOT be saved if the ledger transaction fails
        verify(outboxRepository, never()).save(any()); 
    }

    @Test
    @DisplayName("P43: Handles Database failure during outbox save and prevents partial commit")
    void p43_DatabaseFailure_OutboxSave_ShouldRollback() {
        setupHappyPathDependencies();
        when(outboxRepository.save(any()))
                .thenThrow(new RuntimeException("Outbox DB Connection Dropped"));

        RuntimeException ex = assertThrows(RuntimeException.class, () -> {
            externalPaymentService.processPayment(baseRequest);
        });

        assertTrue(ex.getMessage().contains("Failed to queue outbox event"));
    }

    @Test
    @DisplayName("P44: Throws BusinessException when unsupported Payment Rail is requested")
    void p44_MissingPaymentRail_ShouldAbort() {
        setupHappyPathDependencies();
        when(paymentRailConfigurationPort.findByRailName(anyString())).thenReturn(Optional.empty());

        BusinessException ex = assertThrows(BusinessException.class, () -> {
            externalPaymentService.processPayment(baseRequest);
        });

        assertEquals("INVALID_REQUEST", ex.getErrorCode().name());
    }

    @Test
    @DisplayName("P45: Aborts transaction if Source Account resolution fails")
    void p45_AccountResolutionFailure_ShouldAbort() {
        setupHappyPathDependencies();
        when(accountResolver.resolveAndAuthorizeSource(anyString()))
                .thenThrow(new NotFoundException("Account not found"));

        assertThrows(NotFoundException.class, () -> {
            externalPaymentService.processPayment(baseRequest);
        });
        
        verify(ledgerPersistencePort, never()).save(any());
    }

    @Test
    @DisplayName("P46: Handles Optimistic Locking Failure on JIT Zero Balance Sweep")
    void p46_OptimisticLockingFailure_OnSweep_ShouldAbort() {
        setupHappyPathDependencies();
        doThrow(new OptimisticLockingFailureException("Version mismatch"))
                .when(zeroBalanceSweepService).executeSweepIfNecessary(any(), any(), anyString());

        assertThrows(OptimisticLockingFailureException.class, () -> {
            externalPaymentService.processPayment(baseRequest);
        });

        // The transaction must not be saved if sweep fails concurrently
        verify(ledgerPersistencePort, never()).save(any());
    }

    @Test
    @DisplayName("P47: Rejects transaction if Sufficient Funds Policy check fails post-sweep")
    void p47_InsufficientFunds_PostSweep_ShouldAbort() {
        setupHappyPathDependencies();
        when(sufficientFundsPolicy.hasSufficientFunds(any(), any())).thenReturn(false);

        BusinessException ex = assertThrows(BusinessException.class, () -> {
            externalPaymentService.processPayment(baseRequest);
        });

        assertEquals("INSUFFICIENT_FUNDS", ex.getErrorCode().name());
        verify(ledgerPersistencePort, never()).save(any());
    }

    @Test
    @DisplayName("P48: Synchronous AML monitoring failure properly bubbles up for rollback")
    void p48_AmlMonitoringFailure_ShouldRollback() {
        setupHappyPathDependencies();
        doThrow(new RuntimeException("Monitoring service down"))
                .when(transactionMonitoringService).analyzeTransaction(anyString(), anyString(), any(), anyString());

        assertThrows(RuntimeException.class, () -> {
            externalPaymentService.processPayment(baseRequest);
        });
    }

    @Test
    @DisplayName("P49: Generates valid outbox event and synchronizes perfectly")
    void p49_OutboxEvent_ShouldGenerateCorrectly() {
        setupHappyPathDependencies();
        
        TransactionResponse response = externalPaymentService.processPayment(baseRequest);
        
        assertNotNull(response);
        verify(outboxRepository, times(1)).save(argThat(event -> 
                event.getAggregateId().equals(response.getTransactionReference()) &&
                event.getEventType().name().equals("CHECKOUT_PAYMENT_SUCCEEDED")
        ));
    }

    @Test
    @DisplayName("P50: Successfully writes PENDING state and completes robust execution")
    void p50_RobustExecution_ShouldMapToPending() {
        setupHappyPathDependencies();

        TransactionResponse response = externalPaymentService.processPayment(baseRequest);

        assertEquals(TransactionStatus.PENDING, response.getStatus());
        assertNotNull(response.getTransactionReference());
        
        // Verify outbox and ledger were perfectly synchronized
        verify(ledgerPersistencePort, times(1)).save(any(Transaction.class));
        verify(outboxRepository, times(1)).save(any());
        verify(auditEventPublisher, times(1)).publishEvent(anyString(), anyString(), anyString(), anyString());
    }
}
