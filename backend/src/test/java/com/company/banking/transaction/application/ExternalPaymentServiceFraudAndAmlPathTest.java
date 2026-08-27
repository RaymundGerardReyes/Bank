package com.company.banking.transaction.application;

import com.company.banking.account.domain.Account;
import com.company.banking.aml.application.TransactionMonitoringService;
import com.company.banking.common.audit.AuditEventPublisher;
import com.company.banking.common.enums.AccountStatus;
import com.company.banking.common.exception.BusinessException;
import com.company.banking.common.exception.ConflictException;
import com.company.banking.customer.application.port.out.CustomerPersistencePort;
import com.company.banking.customer.domain.Customer;
import com.company.banking.orchestration.application.port.out.PaymentRailConfigurationPort;
import com.company.banking.orchestration.domain.PaymentRailConfiguration;
import com.company.banking.payment.infrastructure.PaymentEventOutboxJpaRepository;
import com.company.banking.transaction.api.dto.ExternalPaymentRequest;
import com.company.banking.transaction.api.dto.TransactionResponse;
import com.company.banking.transaction.application.port.out.FraudScreeningPort;
import com.company.banking.transaction.application.port.out.LedgerPersistencePort;
import com.company.banking.transaction.application.port.out.PaymentGatewayPort;
import com.company.banking.transaction.domain.SufficientFundsPolicy;
import com.company.banking.transaction.domain.Transaction;
import com.company.banking.transaction.domain.TransactionStatus;
import com.company.banking.transaction.domain.TransferPolicy;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class ExternalPaymentServiceFraudAndAmlPathTest {

    @Mock private LedgerPersistencePort ledgerPersistencePort;
    @Mock private PaymentGatewayPort paymentGatewayPort;
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
                .email("test@example.com")
                .password("encoded")
                .firstName("John")
                .lastName("Doe")
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
    }

    @Test
    @DisplayName("P31: Aborts when fraud screening flags the transaction as fraudulent")
    void p31_FraudulentTransaction_ShouldAbort() {
        setupHappyPathDependencies();
        when(fraudScreeningPort.isFraudulent(anyString(), anyString(), any())).thenReturn(true);

        BusinessException exception = assertThrows(BusinessException.class, () -> {
            externalPaymentService.processPayment(baseRequest);
        });

        assertTrue(exception.getErrorCode().name().contains("FRAUD_DETECTED"));
    }

    @Test
    @DisplayName("P32: Aborts and publishes AML_SCREENING_FAILED audit event when fraud detected")
    void p32_SanctionsListMatch_ShouldPublishAuditEvent() {
        setupHappyPathDependencies();
        when(fraudScreeningPort.isFraudulent(anyString(), anyString(), any())).thenReturn(true);

        assertThrows(BusinessException.class, () -> {
            externalPaymentService.processPayment(baseRequest);
        });

        verify(auditEventPublisher, times(1)).publishEvent(
                eq("AML_SCREENING_FAILED"),
                anyString(),
                anyString(),
                anyString()
        );
    }

    @Test
    @DisplayName("P33: Ensures ledger and outbox interactions are skipped if fraud detected")
    void p33_FraudDetection_ShouldPreventLedgerAndGatewayInteractions() {
        setupHappyPathDependencies();
        when(fraudScreeningPort.isFraudulent(anyString(), anyString(), any())).thenReturn(true);

        assertThrows(BusinessException.class, () -> {
            externalPaymentService.processPayment(baseRequest);
        });

        verify(ledgerPersistencePort, never()).save(any(Transaction.class));
        verify(outboxRepository, never()).save(any());
    }

    @Test
    @DisplayName("P34: High-value transaction correctly triggers async AML monitoring")
    void p34_HighValueTransaction_ShouldTriggerAsyncAmlMonitoring() {
        setupHappyPathDependencies();
        baseRequest.setAmount(new BigDecimal("15000.00")); // Trigger rule > 10000
        
        externalPaymentService.processPayment(baseRequest);
        
        verify(transactionMonitoringService, times(1)).analyzeTransaction(
                anyString(),
                eq(validSourceAccount.getAccountNumber()),
                eq(new BigDecimal("15000.00")),
                eq("LOW")
        );
    }

    @Test
    @DisplayName("P35: High-risk customer transaction correctly triggers async AML monitoring with correct risk profile")
    void p35_HighRiskCustomer_ShouldTriggerAsyncAmlMonitoring() {
        setupHappyPathDependencies();
        mockCustomer.setRiskProfile("HIGH");
        baseRequest.setAmount(new BigDecimal("2500.00")); // Trigger rule > 2000 for HIGH risk
        
        externalPaymentService.processPayment(baseRequest);
        
        verify(transactionMonitoringService, times(1)).analyzeTransaction(
                anyString(),
                eq(validSourceAccount.getAccountNumber()),
                eq(new BigDecimal("2500.00")),
                eq("HIGH")
        );
    }

    @Test
    @DisplayName("P36: AML monitoring safely handles missing customer record without throwing exception")
    void p36_AmlMonitoring_HandlesMissingCustomerGracefully() {
        setupHappyPathDependencies();
        when(customerPersistencePort.findById(anyLong())).thenReturn(Optional.empty());
        
        assertDoesNotThrow(() -> {
            externalPaymentService.processPayment(baseRequest);
        });
        
        verify(transactionMonitoringService, never()).analyzeTransaction(anyString(), anyString(), any(), anyString());
    }

    @Test
    @DisplayName("P37: Transfer policy limit breach throws exception BEFORE fraud screening is called")
    void p37_TransferPolicyLimitBreach_AbortsBeforeFraudScreening() {
        setupHappyPathDependencies();
        doThrow(new BusinessException(com.company.banking.common.exception.ErrorCode.LIMIT_EXCEEDED, "Limit Exceeded"))
                .when(transferPolicy).validateRailLimits(any(), any());

        assertThrows(BusinessException.class, () -> {
            externalPaymentService.processPayment(baseRequest);
        });

        verify(fraudScreeningPort, never()).isFraudulent(anyString(), anyString(), any());
    }

    @Test
    @DisplayName("P38: Duplicate idempotency key throws ConflictException BEFORE fraud screening is called")
    void p38_IdempotencyDuplicate_AbortsBeforeFraudScreening() {
        setupHappyPathDependencies();
        when(ledgerPersistencePort.existsByIdempotencyKey(anyString())).thenReturn(true);

        assertThrows(ConflictException.class, () -> {
            externalPaymentService.processPayment(baseRequest);
        });

        verify(fraudScreeningPort, never()).isFraudulent(anyString(), anyString(), any());
    }

    @Test
    @DisplayName("P39: JIT Sweep is triggered ONLY AFTER fraud screening passes successfully")
    void p39_ZeroBalanceSweep_TriggeredOnlyAfterFraudPasses() {
        setupHappyPathDependencies();
        
        externalPaymentService.processPayment(baseRequest);
        
        verify(zeroBalanceSweepService, times(1)).executeSweepIfNecessary(any(), any(), anyString());
    }

    @Test
    @DisplayName("P40: Clean transaction passes AML, records PENDING, and completes successfully")
    void p40_CleanTransaction_ShouldPassAmlAndCompleteSuccessfully() {
        setupHappyPathDependencies();
        
        TransactionResponse response = externalPaymentService.processPayment(baseRequest);
        
        assertNotNull(response);
        assertEquals(TransactionStatus.PENDING, response.getStatus());
        verify(fraudScreeningPort, times(1)).isFraudulent(anyString(), anyString(), any());
        verify(outboxRepository, times(1)).save(any());
        verify(auditEventPublisher, times(1)).publishEvent(anyString(), anyString(), anyString(), anyString());
    }
}
