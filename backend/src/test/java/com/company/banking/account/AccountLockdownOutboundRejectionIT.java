package com.company.banking.account;

import com.company.banking.account.application.port.out.AccountPersistencePort;
import com.company.banking.account.domain.Account;
import com.company.banking.account.infrastructure.AccountJpaRepository;
import com.company.banking.common.enums.AccountStatus;
import com.company.banking.common.exception.BusinessException;
import com.company.banking.common.exception.ErrorCode;
import com.company.banking.config.BaseIntegrationTest;
import com.company.banking.payment.api.dto.CreatePaymentIntentRequest;
import com.company.banking.payment.application.CheckoutPaymentConfirmationService;
import com.company.banking.payment.application.InternalAccountAuthorizationService;
import com.company.banking.payment.application.InternalPaymentExecutionService;
import com.company.banking.payment.application.PaymentIntentOrchestrationService;
import com.company.banking.payment.domain.*;
import com.company.banking.payment.gateway.ExternalPaymentGateway;
import com.company.banking.payment.infrastructure.CheckoutSessionJpaRepository;
import com.company.banking.payment.infrastructure.PaymentAuthorizationJpaRepository;
import com.company.banking.payment.infrastructure.PaymentIntentJpaRepository;
import com.company.banking.transaction.api.dto.DepositRequest;
import com.company.banking.transaction.api.dto.InternalTransferRequest;
import com.company.banking.transaction.api.dto.WithdrawRequest;
import com.company.banking.transaction.application.DepositService;
import com.company.banking.transaction.application.InternalTransferService;
import com.company.banking.transaction.application.ScheduledTransferService;
import com.company.banking.transaction.application.WithdrawService;
import com.company.banking.transaction.infrastructure.LedgerEntryJpaRepository;
import com.company.banking.transaction.infrastructure.TransactionJpaRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.bean.override.mockito.MockitoBean;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@ActiveProfiles("test")
public class AccountLockdownOutboundRejectionIT extends BaseIntegrationTest {

    @Autowired
    private AccountPersistencePort accountPersistencePort;

    @Autowired
    private AccountJpaRepository accountRepository;

    @Autowired
    private InternalTransferService internalTransferService;

    @Autowired
    private WithdrawService withdrawService;

    @Autowired
    private DepositService depositService;

    @Autowired
    private ScheduledTransferService scheduledTransferService;

    @Autowired
    private PaymentIntentOrchestrationService paymentIntentOrchestrationService;

    @Autowired
    private InternalAccountAuthorizationService authorizationService;

    @Autowired
    private InternalPaymentExecutionService executionService;

    @Autowired
    private CheckoutPaymentConfirmationService confirmationService;

    @Autowired
    private PaymentIntentJpaRepository intentRepository;

    @Autowired
    private CheckoutSessionJpaRepository sessionRepository;

    @Autowired
    private PaymentAuthorizationJpaRepository authorizationRepository;

    @Autowired
    private TransactionJpaRepository transactionRepository;

    @Autowired
    private LedgerEntryJpaRepository ledgerEntryRepository;

    @Autowired
    private com.company.banking.merchant.application.port.out.MerchantPersistencePort merchantPersistencePort;

    @MockitoBean
    private ExternalPaymentGateway externalPaymentGateway;

    private Account activeAccountA;
    private Account activeAccountB;

    @BeforeEach
    public void setup() {
        ledgerEntryRepository.deleteAll();
        transactionRepository.deleteAll();
        authorizationRepository.deleteAll();
        sessionRepository.deleteAll();
        intentRepository.deleteAll();
        accountRepository.deleteAll();

        activeAccountA = accountPersistencePort.save(Account.builder()
                .accountNumber("ACC-ACTIVE-A-" + UUID.randomUUID().toString().substring(0, 6))
                .customerId(101L)
                .balance(new BigDecimal("10000.00"))
                .currency("PHP")
                .status(AccountStatus.ACTIVE)
                .frozen(false)
                .allowIncoming(true)
                .allowOutgoing(true)
                .build());

        activeAccountB = accountPersistencePort.save(Account.builder()
                .accountNumber("ACC-ACTIVE-B-" + UUID.randomUUID().toString().substring(0, 6))
                .customerId(102L)
                .balance(new BigDecimal("5000.00"))
                .currency("PHP")
                .status(AccountStatus.ACTIVE)
                .frozen(false)
                .allowIncoming(true)
                .allowOutgoing(true)
                .build());
    }

    // ==========================================
    // 1. Internal Transfers Rejection Tests
    // ==========================================

    @Test
    @DisplayName("Transfer rejects when source account is frozen and preserves balances")
    public void testTransfer_FrozenSource_RejectsWithAccountSuspendedAndNoDebit() {
        activeAccountA.setFrozen(true);
        accountPersistencePort.save(activeAccountA);

        InternalTransferRequest request = InternalTransferRequest.builder()
                .sourceAccountNumber(activeAccountA.getAccountNumber())
                .destinationAccountNumber(activeAccountB.getAccountNumber())
                .amount(new BigDecimal("500.00"))
                .idempotencyKey(UUID.randomUUID().toString())
                .description("Frozen source test")
                .build();

        BusinessException ex = assertThrows(BusinessException.class, () ->
                internalTransferService.processInternalTransfer(request));
        assertEquals(ErrorCode.ACCOUNT_SUSPENDED, ex.getErrorCode());

        Account freshA = accountPersistencePort.findByAccountNumber(activeAccountA.getAccountNumber()).orElseThrow();
        Account freshB = accountPersistencePort.findByAccountNumber(activeAccountB.getAccountNumber()).orElseThrow();
        assertEquals(0, new BigDecimal("10000.00").compareTo(freshA.getBalance()));
        assertEquals(0, new BigDecimal("5000.00").compareTo(freshB.getBalance()));
        assertEquals(0, transactionRepository.count());
    }

    @Test
    @DisplayName("Transfer rejects when source account has allowOutgoing = false")
    public void testTransfer_OutgoingLockedSource_RejectsWithAccountSuspendedAndNoDebit() {
        activeAccountA.setAllowOutgoing(false);
        accountPersistencePort.save(activeAccountA);

        InternalTransferRequest request = InternalTransferRequest.builder()
                .sourceAccountNumber(activeAccountA.getAccountNumber())
                .destinationAccountNumber(activeAccountB.getAccountNumber())
                .amount(new BigDecimal("500.00"))
                .idempotencyKey(UUID.randomUUID().toString())
                .description("Outgoing locked test")
                .build();

        BusinessException ex = assertThrows(BusinessException.class, () ->
                internalTransferService.processInternalTransfer(request));
        assertEquals(ErrorCode.ACCOUNT_SUSPENDED, ex.getErrorCode());

        Account freshA = accountPersistencePort.findByAccountNumber(activeAccountA.getAccountNumber()).orElseThrow();
        assertEquals(0, new BigDecimal("10000.00").compareTo(freshA.getBalance()));
    }

    @Test
    @DisplayName("Transfer rejects when destination account has allowIncoming = false")
    public void testTransfer_IncomingLockedDestination_RejectsWithAccountSuspended() {
        activeAccountB.setAllowIncoming(false);
        accountPersistencePort.save(activeAccountB);

        InternalTransferRequest request = InternalTransferRequest.builder()
                .sourceAccountNumber(activeAccountA.getAccountNumber())
                .destinationAccountNumber(activeAccountB.getAccountNumber())
                .amount(new BigDecimal("500.00"))
                .idempotencyKey(UUID.randomUUID().toString())
                .description("Incoming locked test")
                .build();

        BusinessException ex = assertThrows(BusinessException.class, () ->
                internalTransferService.processInternalTransfer(request));
        assertEquals(ErrorCode.ACCOUNT_SUSPENDED, ex.getErrorCode());

        Account freshA = accountPersistencePort.findByAccountNumber(activeAccountA.getAccountNumber()).orElseThrow();
        Account freshB = accountPersistencePort.findByAccountNumber(activeAccountB.getAccountNumber()).orElseThrow();
        assertEquals(0, new BigDecimal("10000.00").compareTo(freshA.getBalance()));
        assertEquals(0, new BigDecimal("5000.00").compareTo(freshB.getBalance()));
    }

    // ==========================================
    // 2. Withdrawals Rejection Tests
    // ==========================================

    @Test
    @DisplayName("Withdrawal rejects when account is frozen and leaves balance untouched")
    public void testWithdrawal_FrozenAccount_RejectsWithAccountSuspendedAndNoDebit() {
        activeAccountA.setFrozen(true);
        accountPersistencePort.save(activeAccountA);

        WithdrawRequest request = WithdrawRequest.builder()
                .accountNumber(activeAccountA.getAccountNumber())
                .amount(new BigDecimal("1000.00"))
                .idempotencyKey(UUID.randomUUID().toString())
                .build();

        BusinessException ex = assertThrows(BusinessException.class, () ->
                withdrawService.withdraw(request));
        assertEquals(ErrorCode.ACCOUNT_SUSPENDED, ex.getErrorCode());

        Account freshA = accountPersistencePort.findByAccountNumber(activeAccountA.getAccountNumber()).orElseThrow();
        assertEquals(0, new BigDecimal("10000.00").compareTo(freshA.getBalance()));
        assertEquals(0, transactionRepository.count());
    }

    @Test
    @DisplayName("Withdrawal rejects when account has allowOutgoing = false")
    public void testWithdrawal_OutgoingLockedAccount_RejectsWithAccountSuspendedAndNoDebit() {
        activeAccountA.setAllowOutgoing(false);
        accountPersistencePort.save(activeAccountA);

        WithdrawRequest request = WithdrawRequest.builder()
                .accountNumber(activeAccountA.getAccountNumber())
                .amount(new BigDecimal("1000.00"))
                .idempotencyKey(UUID.randomUUID().toString())
                .build();

        BusinessException ex = assertThrows(BusinessException.class, () ->
                withdrawService.withdraw(request));
        assertEquals(ErrorCode.ACCOUNT_SUSPENDED, ex.getErrorCode());

        Account freshA = accountPersistencePort.findByAccountNumber(activeAccountA.getAccountNumber()).orElseThrow();
        assertEquals(0, new BigDecimal("10000.00").compareTo(freshA.getBalance()));
    }

    // ==========================================
    // 3. Deposits Rejection Tests
    // ==========================================

    @Test
    @DisplayName("Deposit rejects when account is frozen and leaves balance untouched")
    public void testDeposit_FrozenAccount_RejectsWithAccountSuspendedAndNoCredit() {
        activeAccountA.setFrozen(true);
        accountPersistencePort.save(activeAccountA);

        DepositRequest request = DepositRequest.builder()
                .accountNumber(activeAccountA.getAccountNumber())
                .amount(new BigDecimal("1000.00"))
                .idempotencyKey(UUID.randomUUID().toString())
                .build();

        BusinessException ex = assertThrows(BusinessException.class, () ->
                depositService.deposit(request));
        assertEquals(ErrorCode.ACCOUNT_SUSPENDED, ex.getErrorCode());

        Account freshA = accountPersistencePort.findByAccountNumber(activeAccountA.getAccountNumber()).orElseThrow();
        assertEquals(0, new BigDecimal("10000.00").compareTo(freshA.getBalance()));
    }

    @Test
    @DisplayName("Deposit rejects when account has allowIncoming = false")
    public void testDeposit_IncomingLockedAccount_RejectsWithAccountSuspendedAndNoCredit() {
        activeAccountA.setAllowIncoming(false);
        accountPersistencePort.save(activeAccountA);

        DepositRequest request = DepositRequest.builder()
                .accountNumber(activeAccountA.getAccountNumber())
                .amount(new BigDecimal("1000.00"))
                .idempotencyKey(UUID.randomUUID().toString())
                .build();

        BusinessException ex = assertThrows(BusinessException.class, () ->
                depositService.deposit(request));
        assertEquals(ErrorCode.ACCOUNT_SUSPENDED, ex.getErrorCode());

        Account freshA = accountPersistencePort.findByAccountNumber(activeAccountA.getAccountNumber()).orElseThrow();
        assertEquals(0, new BigDecimal("10000.00").compareTo(freshA.getBalance()));
    }

    // ==========================================
    // 4. Payment Intent & Authorization Rejection
    // ==========================================

    @Test
    @DisplayName("Payment intent creation rejects when source account is frozen")
    public void testPaymentIntentCreation_FrozenAccount_RejectsWithAccountSuspended() {
        activeAccountA.setFrozen(true);
        accountPersistencePort.save(activeAccountA);

        CreatePaymentIntentRequest request = new CreatePaymentIntentRequest();
        request.setSourceAccountId(activeAccountA.getAccountNumber());
        request.setAmount(new BigDecimal("1000.00"));
        request.setIdempotencyKey(UUID.randomUUID().toString());
        request.setDescription("Test Frozen Intent");
        request.setMerchantReference("REF-123");

        BusinessException ex = assertThrows(BusinessException.class, () ->
                paymentIntentOrchestrationService.createIntent(909L, activeAccountA.getAccountNumber(), request));
        assertEquals(ErrorCode.ACCOUNT_SUSPENDED, ex.getErrorCode());

        Account freshA = accountPersistencePort.findByAccountNumber(activeAccountA.getAccountNumber()).orElseThrow();
        assertEquals(0, new BigDecimal("10000.00").compareTo(freshA.getBalance()));
    }

    @Test
    @DisplayName("Payment intent creation rejects when source account has allowOutgoing = false")
    public void testPaymentIntentCreation_OutgoingLockedAccount_RejectsWithAccountSuspended() {
        activeAccountA.setAllowOutgoing(false);
        accountPersistencePort.save(activeAccountA);

        CreatePaymentIntentRequest request = new CreatePaymentIntentRequest();
        request.setSourceAccountId(activeAccountA.getAccountNumber());
        request.setAmount(new BigDecimal("1000.00"));
        request.setIdempotencyKey(UUID.randomUUID().toString());
        request.setDescription("Test Outgoing Locked Intent");
        request.setMerchantReference("REF-456");

        BusinessException ex = assertThrows(BusinessException.class, () ->
                paymentIntentOrchestrationService.createIntent(909L, activeAccountA.getAccountNumber(), request));
        assertEquals(ErrorCode.ACCOUNT_SUSPENDED, ex.getErrorCode());

        Account freshA = accountPersistencePort.findByAccountNumber(activeAccountA.getAccountNumber()).orElseThrow();
        assertEquals(0, new BigDecimal("10000.00").compareTo(freshA.getBalance()));
    }

    @Test
    @DisplayName("Internal account authorization rejects when customer account is frozen")
    public void testInternalAccountAuthorization_FrozenAccount_RejectsWithAccountSuspended() {
        // Seed an active intent and session
        PaymentIntent intent = intentRepository.save(PaymentIntent.builder()
                .intentId("pi_" + UUID.randomUUID())
                .merchantId(99L)
                .customerAccountNumber(activeAccountA.getAccountNumber())
                .amount(new BigDecimal("1000.00"))
                .currency("PHP")
                .status(PaymentIntentStatus.CREATED)
                .build());

        CheckoutSession session = sessionRepository.save(CheckoutSession.builder()
                .sessionId("cs_" + UUID.randomUUID())
                .merchantId(99L)
                .idempotencyKey(UUID.randomUUID().toString())
                .paymentIntentId(intent.getIntentId())
                .amount(new BigDecimal("1000.00"))
                .currency("PHP")
                .status(CheckoutSessionStatus.PAYMENT_PENDING)
                .successUrl("https://example.com")
                .createdAt(LocalDateTime.now())
                .expiresAt(LocalDateTime.now().plusHours(1))
                .build());

        // Freeze customer account
        activeAccountA.setFrozen(true);
        accountPersistencePort.save(activeAccountA);

        BusinessException ex = assertThrows(BusinessException.class, () ->
                authorizationService.authorizeInternalAccount(session.getSessionId(), activeAccountA.getAccountNumber()));
        assertEquals(ErrorCode.ACCOUNT_SUSPENDED, ex.getErrorCode());
    }

    // ==========================================
    // 5. Payment Capture & Refund Rejection Tests
    // ==========================================

    @Test
    @DisplayName("Payment capture rejects when customer account is locked for outgoing deductions")
    public void testPaymentCapture_CustomerAccountOutgoingLocked_RejectsAndPreservesBalances() {
        // Seed Merchant Settlement Account
        Account merchantAccount = accountPersistencePort.findByAccountNumber("MERCHANT-SETTLEMENT-99")
                .orElseGet(() -> accountPersistencePort.save(Account.builder()
                        .accountNumber("MERCHANT-SETTLEMENT-99")
                        .customerId(99L)
                        .balance(BigDecimal.ZERO)
                        .currency("PHP")
                        .status(AccountStatus.ACTIVE)
                        .allowIncoming(true)
                        .allowOutgoing(true)
                        .build()));

        PaymentIntent intent = intentRepository.save(PaymentIntent.builder()
                .intentId("pi_" + UUID.randomUUID())
                .merchantId(99L)
                .customerAccountNumber(activeAccountA.getAccountNumber())
                .amount(new BigDecimal("1000.00"))
                .currency("PHP")
                .status(PaymentIntentStatus.AUTHORIZED)
                .build());

        CheckoutSession session = sessionRepository.save(CheckoutSession.builder()
                .sessionId("cs_" + UUID.randomUUID())
                .merchantId(99L)
                .idempotencyKey(UUID.randomUUID().toString())
                .paymentIntentId(intent.getIntentId())
                .amount(new BigDecimal("1000.00"))
                .currency("PHP")
                .status(CheckoutSessionStatus.AUTHORIZED)
                .successUrl("https://example.com")
                .createdAt(LocalDateTime.now())
                .expiresAt(LocalDateTime.now().plusHours(1))
                .build());

        authorizationRepository.save(PaymentAuthorization.builder()
                .authorizationReference("auth_" + UUID.randomUUID())
                .checkoutSessionId(session.getSessionId())
                .paymentIntentId(intent.getIntentId())
                .customerAccountNumber(activeAccountA.getAccountNumber())
                .merchantId(99L)
                .amount(new BigDecimal("1000.00"))
                .currency("PHP")
                .status(PaymentAuthorizationStatus.AUTHORIZED)
                .authorizedAt(LocalDateTime.now())
                .expiresAt(LocalDateTime.now().plusDays(1))
                .build());

        // Lock customer account for outgoing
        activeAccountA.setAllowOutgoing(false);
        accountPersistencePort.save(activeAccountA);

        BusinessException ex = assertThrows(BusinessException.class, () ->
                confirmationService.confirmCheckout(session.getSessionId()));
        assertEquals(ErrorCode.ACCOUNT_SUSPENDED, ex.getErrorCode());

        // Verify zero money was deducted
        Account freshA = accountPersistencePort.findByAccountNumber(activeAccountA.getAccountNumber()).orElseThrow();
        assertEquals(0, new BigDecimal("10000.00").compareTo(freshA.getBalance()));

        Account freshMerchant = accountPersistencePort.findByAccountNumber("MERCHANT-SETTLEMENT-99").orElseThrow();
        assertEquals(0, BigDecimal.ZERO.compareTo(freshMerchant.getBalance()));
    }

    // ==========================================
    // 6. Scheduled Transfer Rejection Tests
    // ==========================================

    @Test
    @DisplayName("Scheduled transfer rejects when source account has allowOutgoing = false")
    public void testScheduledTransfer_OutgoingLockedSource_RejectsWithAccountSuspended() {
        activeAccountA.setAllowOutgoing(false);
        accountPersistencePort.save(activeAccountA);

        InternalTransferRequest request = InternalTransferRequest.builder()
                .sourceAccountNumber(activeAccountA.getAccountNumber())
                .destinationAccountNumber(activeAccountB.getAccountNumber())
                .amount(new BigDecimal("500.00"))
                .scheduledDate("2026-10-01")
                .idempotencyKey(UUID.randomUUID().toString())
                .description("Scheduled locked test")
                .build();

        BusinessException ex = assertThrows(BusinessException.class, () ->
                scheduledTransferService.scheduleTransfer(request));
        assertEquals(ErrorCode.ACCOUNT_SUSPENDED, ex.getErrorCode());

        Account freshA = accountPersistencePort.findByAccountNumber(activeAccountA.getAccountNumber()).orElseThrow();
        assertEquals(0, new BigDecimal("10000.00").compareTo(freshA.getBalance()));
    }

    @Test
    @DisplayName("Payment capture resolves configured merchant settlement account and honors its controller settings")
    public void testPaymentCapture_ConfiguredMerchantSettlementAccount_HonorsControllerSettings() {
        var savedMerchant = merchantPersistencePort.save(com.company.banking.merchant.domain.Merchant.builder()
                .merchantCode("MERCH-555-" + UUID.randomUUID().toString().substring(0, 8))
                .legalName("Test 555 Merchant")
                .businessRegistrationNumber("BRN-" + UUID.randomUUID().toString().substring(0, 8))
                .ownerId(101L)
                .status("ACTIVE")
                .settlementAccount(activeAccountB.getAccountNumber())
                .build());
        Long testMerchantId = savedMerchant.getId();

        PaymentIntent intent = intentRepository.save(PaymentIntent.builder()
                .intentId("pi_" + UUID.randomUUID())
                .merchantId(testMerchantId)
                .customerAccountNumber(activeAccountA.getAccountNumber())
                .amount(new BigDecimal("1000.00"))
                .currency("PHP")
                .status(PaymentIntentStatus.AUTHORIZED)
                .build());

        CheckoutSession session = sessionRepository.save(CheckoutSession.builder()
                .sessionId("cs_" + UUID.randomUUID())
                .merchantId(testMerchantId)
                .idempotencyKey(UUID.randomUUID().toString())
                .paymentIntentId(intent.getIntentId())
                .amount(new BigDecimal("1000.00"))
                .currency("PHP")
                .status(CheckoutSessionStatus.AUTHORIZED)
                .successUrl("https://example.com")
                .createdAt(LocalDateTime.now())
                .expiresAt(LocalDateTime.now().plusHours(1))
                .build());

        authorizationRepository.save(PaymentAuthorization.builder()
                .authorizationReference("auth_" + UUID.randomUUID())
                .checkoutSessionId(session.getSessionId())
                .paymentIntentId(intent.getIntentId())
                .customerAccountNumber(activeAccountA.getAccountNumber())
                .merchantId(testMerchantId)
                .amount(new BigDecimal("1000.00"))
                .currency("PHP")
                .status(PaymentAuthorizationStatus.AUTHORIZED)
                .authorizedAt(LocalDateTime.now())
                .expiresAt(LocalDateTime.now().plusDays(1))
                .build());

        // 1. When settlement account has allowIncoming = false (locked via Governance & Controller Settings)
        Account accB = accountPersistencePort.findByAccountNumber(activeAccountB.getAccountNumber()).orElseThrow();
        accB.setAllowIncoming(false);
        accountPersistencePort.save(accB);

        BusinessException ex = assertThrows(BusinessException.class, () ->
                confirmationService.confirmCheckout(session.getSessionId()));
        assertEquals(ErrorCode.ACCOUNT_SUSPENDED, ex.getErrorCode());

        // 2. When settlement account is allowed incoming transfers (toggled via Governance & Controller Settings)
        accB = accountPersistencePort.findByAccountNumber(activeAccountB.getAccountNumber()).orElseThrow();
        accB.setAllowIncoming(true);
        accountPersistencePort.save(accB);

        var response = confirmationService.confirmCheckout(session.getSessionId());
        assertEquals("PAID", response.getStatus());

        // Verify balances mutated correctly on the configured settlement account
        Account freshA = accountPersistencePort.findByAccountNumber(activeAccountA.getAccountNumber()).orElseThrow();
        assertEquals(0, new BigDecimal("9000.00").compareTo(freshA.getBalance()));

        Account freshB = accountPersistencePort.findByAccountNumber(activeAccountB.getAccountNumber()).orElseThrow();
        assertEquals(0, new BigDecimal("6000.00").compareTo(freshB.getBalance()));
    }
}

