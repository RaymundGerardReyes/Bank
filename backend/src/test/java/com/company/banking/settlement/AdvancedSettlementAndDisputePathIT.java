package com.company.banking.settlement;

import com.company.banking.common.enums.AccountStatus;
import com.company.banking.common.exception.BusinessException;
import com.company.banking.config.LedgerSpyIntegrationTest;
import com.company.banking.payment.application.GatewayDisputeService;
import com.company.banking.payment.domain.GatewayDispute;
import com.company.banking.payment.domain.PaymentIntent;
import com.company.banking.payment.domain.PaymentIntentStatus;
import com.company.banking.payment.infrastructure.GatewayDisputeJpaRepository;
import com.company.banking.payment.infrastructure.PaymentIntentJpaRepository;
import com.company.banking.settlement.application.InternalSettlementExecutionService;
import com.company.banking.settlement.application.SettlementBatchService;
import com.company.banking.settlement.application.SettlementInstructionService;
import com.company.banking.settlement.application.SettlementReconciliationService;
import com.company.banking.settlement.domain.MerchantBalance;
import com.company.banking.settlement.domain.SettlementBatch;
import com.company.banking.settlement.domain.SettlementInstruction;
import com.company.banking.settlement.infrastructure.MerchantBalanceJpaRepository;
import com.company.banking.settlement.infrastructure.SettlementBatchJpaRepository;
import com.company.banking.settlement.infrastructure.SettlementExceptionJpaRepository;
import com.company.banking.settlement.infrastructure.SettlementInstructionJpaRepository;
import com.company.banking.transaction.domain.EntryType;
import com.company.banking.transaction.domain.LedgerEntry;
import com.company.banking.transaction.domain.Transaction;
import com.company.banking.transaction.domain.TransactionStatus;
import com.company.banking.transaction.infrastructure.LedgerEntryJpaRepository;
import com.company.banking.transaction.infrastructure.TransactionJpaRepository;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.test.context.ActiveProfiles;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@ActiveProfiles("test")
public class AdvancedSettlementAndDisputePathIT extends LedgerSpyIntegrationTest {

    @Autowired private SettlementBatchService batchService;
    @Autowired private SettlementInstructionService instructionService;
    @Autowired private SettlementReconciliationService reconciliationService;
    @Autowired private InternalSettlementExecutionService executionService;
    @Autowired private GatewayDisputeService disputeService;

    @Autowired private SettlementBatchJpaRepository batchRepository;
    @Autowired private SettlementInstructionJpaRepository instructionRepository;
    @Autowired private SettlementExceptionJpaRepository exceptionRepository;
    @Autowired private MerchantBalanceJpaRepository merchantBalanceRepository;
    @Autowired private TransactionJpaRepository transactionRepository;
    @Autowired private LedgerEntryJpaRepository ledgerEntryRepository;
    @Autowired private GatewayDisputeJpaRepository disputeRepository;
    @Autowired private PaymentIntentJpaRepository paymentIntentRepository;
    @Autowired private JdbcTemplate jdbcTemplate;
    @Autowired private com.company.banking.account.application.port.out.AccountPersistencePort accountPersistencePort;

    private final Long MERCHANT_ID = 505L;
    private final Long WINDOW_ID = 20260901L;
    private final String DEST_ACC = "DEST-SETTLE-505";
    private final String MERCHANT_SUSPENSE_ACC = "MERCHANT-SETTLEMENT-505";

    @BeforeEach
    public void setup() {
        exceptionRepository.deleteAll();
        instructionRepository.deleteAll();
        batchRepository.deleteAll();
        ledgerEntryRepository.deleteAll();
        transactionRepository.deleteAll();
        disputeRepository.deleteAll();
        paymentIntentRepository.deleteAll();

        merchantBalanceRepository.findByMerchantId(MERCHANT_ID)
            .ifPresentOrElse(
                mb -> {
                    mb.setAvailableBalance(new BigDecimal("0.00"));
                    merchantBalanceRepository.save(mb);
                },
                () -> merchantBalanceRepository.save(MerchantBalance.builder()
                        .merchantId(MERCHANT_ID).availableBalance(new BigDecimal("0.00"))
                        .pendingBalance(new BigDecimal("0.00")).currency("PHP")
                        .updatedAt(LocalDateTime.now()).build())
            );

        // Seed necessary accounts for the Settlement Execution Lock Guard
        accountPersistencePort.findByAccountNumber(DEST_ACC).ifPresentOrElse(
            acc -> {},
            () -> accountPersistencePort.save(com.company.banking.account.domain.Account.builder()
                    .accountNumber(DEST_ACC).customerId(999L).balance(new BigDecimal("0.00"))
                    .currency("PHP").status(AccountStatus.ACTIVE).allowIncoming(true).allowOutgoing(true).build())
        );

        accountPersistencePort.findByAccountNumber(MERCHANT_SUSPENSE_ACC).ifPresentOrElse(
            acc -> {},
            () -> accountPersistencePort.save(com.company.banking.account.domain.Account.builder()
                    .accountNumber(MERCHANT_SUSPENSE_ACC).customerId(MERCHANT_ID).balance(new BigDecimal("500000.00")) // Suspense must have funds
                    .currency("PHP").status(AccountStatus.ACTIVE).allowIncoming(true).allowOutgoing(true).build())
        );
    }

    private void seedPendingTransaction(BigDecimal amount) {
        String txRef = "TX-" + UUID.randomUUID();
        transactionRepository.save(Transaction.builder()
                .transactionReference(txRef)
                .idempotencyKey(UUID.randomUUID().toString())
                .sourceAccountNumber("CUST-123")
                .destinationAccountNumber(MERCHANT_SUSPENSE_ACC)
                .amount(amount)
                .currency("PHP")
                .status(TransactionStatus.COMPLETED)
                .createdAt(LocalDateTime.now())
                .build());

        ledgerEntryRepository.save(LedgerEntry.builder()
                .transactionReference(txRef)
                .accountNumber("CUST-123")
                .entryType(EntryType.DEBIT)
                .amount(amount)
                .currency("PHP")
                .build());

        ledgerEntryRepository.save(LedgerEntry.builder()
                .transactionReference(txRef)
                .accountNumber(MERCHANT_SUSPENSE_ACC)
                .entryType(EntryType.CREDIT)
                .amount(amount)
                .currency("PHP")
                .build());
    }

    @Test
    @DisplayName("P01: Full Golden Path - Batch -> Instruct -> Reconcile -> Execute")
    public void p01_FullSettlementLifecycle_ShouldUpdateMerchantBalance() {
        seedPendingTransaction(new BigDecimal("1000.00"));
        seedPendingTransaction(new BigDecimal("2000.00"));

        SettlementBatch batch = batchService.createSettlementBatch(MERCHANT_ID, WINDOW_ID, DEST_ACC, "RT-001");
        assertNotNull(batch);
        assertEquals(new BigDecimal("3000.00"), batch.getAmount());

        SettlementInstruction instruction = instructionService.generateInstructionFromBatch(batch.getBatchReference());
        assertEquals("READY", instruction.getStatus());

        instruction = reconciliationService.reconcileInstruction(instruction.getInstructionId());
        assertEquals("RECONCILED", instruction.getStatus());

        instruction = executionService.executeSettlement(instruction.getInstructionId(), MERCHANT_ID);
        assertEquals("SETTLED", instruction.getStatus());

        MerchantBalance mb = merchantBalanceRepository.findByMerchantId(MERCHANT_ID).orElseThrow();
        assertEquals(0, new BigDecimal("3000.00").compareTo(mb.getAvailableBalance()), "Merchant balance MUST be credited precisely.");
    }

    @Test
    @DisplayName("P02: State Guard - Cannot execute un-reconciled instruction")
    public void p02_UnreconciledInstruction_ShouldRejectExecution() {
        seedPendingTransaction(new BigDecimal("500.00"));
        SettlementBatch batch = batchService.createSettlementBatch(MERCHANT_ID, WINDOW_ID, DEST_ACC, "RT-001");
        SettlementInstruction instruction = instructionService.generateInstructionFromBatch(batch.getBatchReference());

        BusinessException ex = assertThrows(BusinessException.class, () -> {
            executionService.executeSettlement(instruction.getInstructionId(), MERCHANT_ID);
        });

        assertTrue(ex.getMessage().contains("must be RECONCILED"), "System must block out-of-order state transitions.");
    }

    @Test
    @DisplayName("P03: Ledger Tampering - Reconciliation fails safely and flags exception")
    public void p03_TamperedBatch_ShouldFailReconciliation_AndLogException() {
        seedPendingTransaction(new BigDecimal("1000.00"));
        SettlementBatch batch = batchService.createSettlementBatch(MERCHANT_ID, WINDOW_ID, DEST_ACC, "RT-001");
        SettlementInstruction instruction = instructionService.generateInstructionFromBatch(batch.getBatchReference());

        jdbcTemplate.update("UPDATE \"settlement_instructions\" SET amount = ? WHERE id = ?", new BigDecimal("50000.00"), instruction.getId());

        SettlementInstruction result = reconciliationService.reconcileInstruction(instruction.getInstructionId());
        
        assertEquals("EXCEPTION", result.getStatus(), "Tampered amounts must push instruction to EXCEPTION state.");
        assertEquals(1, exceptionRepository.count(), "A formal SettlementException must be persisted for ops review.");
    }

    @Test
    @DisplayName("P04: Idempotency Guard - Double execution returns safe state without duplicate funds")
    public void p04_DuplicateExecution_ShouldNotDoubleCreditMerchant() {
        seedPendingTransaction(new BigDecimal("100.00"));
        SettlementBatch batch = batchService.createSettlementBatch(MERCHANT_ID, WINDOW_ID, DEST_ACC, "RT-001");
        SettlementInstruction instr = instructionService.generateInstructionFromBatch(batch.getBatchReference());
        reconciliationService.reconcileInstruction(instr.getInstructionId());

        executionService.executeSettlement(instr.getInstructionId(), MERCHANT_ID);
        SettlementInstruction duplicateResult = executionService.executeSettlement(instr.getInstructionId(), MERCHANT_ID);
        
        assertEquals("SETTLED", duplicateResult.getStatus());
        
        MerchantBalance mb = merchantBalanceRepository.findByMerchantId(MERCHANT_ID).orElseThrow();
        assertEquals(0, new BigDecimal("100.00").compareTo(mb.getAvailableBalance()), "Idempotency MUST prevent double-crediting.");
    }

    @Test
    @DisplayName("P05: Opening a Gateway Dispute against a CAPTURED PaymentIntent transitions state to UNDER_INVESTIGATION")
    public void p05_OpenDispute_ShouldTransitionState() {
        PaymentIntent intent = paymentIntentRepository.save(PaymentIntent.builder()
                .intentId("pi_dispute_" + UUID.randomUUID().toString().substring(0, 8))
                .merchantId(MERCHANT_ID)
                .amount(new BigDecimal("1000.00"))
                .currency("PHP")
                .status(PaymentIntentStatus.CAPTURED)
                .customerAccountNumber("CUST-123")
                .build());

        GatewayDispute dispute = disputeService.openDispute(intent.getIntentId(), "FRAUDULENT_CHARGE");

        assertNotNull(dispute.getDisputeReference());
        assertEquals("UNDER_INVESTIGATION", dispute.getStatus());
        assertEquals(1, disputeRepository.count());
    }
}
