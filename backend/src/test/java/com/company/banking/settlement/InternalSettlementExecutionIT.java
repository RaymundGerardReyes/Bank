package com.company.banking.settlement;

import com.company.banking.account.application.port.out.AccountPersistencePort;
import com.company.banking.account.domain.Account;
import com.company.banking.common.enums.AccountStatus;
import com.company.banking.common.exception.BusinessException;
import com.company.banking.settlement.application.InternalSettlementExecutionService;
import com.company.banking.settlement.domain.MerchantBalance;
import com.company.banking.settlement.domain.SettlementInstruction;
import com.company.banking.settlement.infrastructure.MerchantBalanceJpaRepository;
import com.company.banking.settlement.infrastructure.SettlementInstructionJpaRepository;
import com.company.banking.transaction.domain.Transaction;
import com.company.banking.transaction.infrastructure.LedgerEntryJpaRepository;
import com.company.banking.transaction.infrastructure.TransactionJpaRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import com.company.banking.config.LedgerSpyIntegrationTest;


import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.concurrent.CountDownLatch;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.atomic.AtomicInteger;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.doThrow;

public class InternalSettlementExecutionIT extends LedgerSpyIntegrationTest {

    @Autowired
    private InternalSettlementExecutionService executionService;

    @Autowired
    private SettlementInstructionJpaRepository instructionRepository;

    @Autowired
    private MerchantBalanceJpaRepository merchantBalanceRepository;

    @Autowired
    private AccountPersistencePort accountPersistencePort;

    @Autowired
    private TransactionJpaRepository transactionRepository;



    private SettlementInstruction reconciledInstruction;
    private final Long TEST_MERCHANT_ID = 77L;
    private final String SUSPENSE_ACC = "MERCHANT-SETTLEMENT-77";
    private final String DEST_ACC = "DEST-OP-123";

    @Autowired
    private com.company.banking.account.infrastructure.AccountJpaRepository accountJpaRepository;

    @BeforeEach
    public void setup() {


        // Seed Suspense & Destination Accounts idempotently
        accountPersistencePort.findByAccountNumber(SUSPENSE_ACC)
                .map(acc -> {
                    acc.setBalance(new BigDecimal("50000.00"));
                    return accountPersistencePort.save(acc);
                })
                .orElseGet(() -> accountPersistencePort.save(Account.builder()
                        .accountNumber(SUSPENSE_ACC).customerId(TEST_MERCHANT_ID)
                        .balance(new BigDecimal("50000.00")).currency("PHP").status(AccountStatus.ACTIVE)
                        .allowOutgoing(true).allowIncoming(true).build()));

        accountPersistencePort.findByAccountNumber(DEST_ACC)
                .map(acc -> {
                    acc.setBalance(new BigDecimal("0.00"));
                    return accountPersistencePort.save(acc);
                })
                .orElseGet(() -> accountPersistencePort.save(Account.builder()
                        .accountNumber(DEST_ACC).customerId(TEST_MERCHANT_ID)
                        .balance(new BigDecimal("0.00")).currency("PHP").status(AccountStatus.ACTIVE)
                        .allowOutgoing(true).allowIncoming(true).build()));

        // Seed Merchant Operational Balance idempotently
        merchantBalanceRepository.findByMerchantId(TEST_MERCHANT_ID)
                .orElseGet(() -> merchantBalanceRepository.save(MerchantBalance.builder()
                        .merchantId(TEST_MERCHANT_ID).availableBalance(new BigDecimal("0.00"))
                        .pendingBalance(new BigDecimal("0.00")).currency("PHP")
                        .updatedAt(LocalDateTime.now()).build()));

        // Seed RECONCILED Instruction
        reconciledInstruction = instructionRepository.save(SettlementInstruction.builder()
                .instructionId("INSTR-" + UUID.randomUUID())
                .settlementBatchId(1L)
                .merchantId(TEST_MERCHANT_ID)
                .amount(new BigDecimal("10000.00"))
                .currency("PHP")
                .status("RECONCILED")
                .destinationAccount(DEST_ACC)
                .createdAt(LocalDateTime.now())
                .build());
    }

    @Test
    public void reconciledInstruction_ShouldSettleExactlyOnce() {
        SettlementInstruction result = executionService.executeSettlement(reconciledInstruction.getInstructionId(), TEST_MERCHANT_ID);

        assertEquals("SETTLED", result.getStatus());

        // Verify Balances
        Account suspense = accountPersistencePort.findByAccountNumber(SUSPENSE_ACC).orElseThrow();
        Account dest = accountPersistencePort.findByAccountNumber(DEST_ACC).orElseThrow();
        MerchantBalance mb = merchantBalanceRepository.findByMerchantId(TEST_MERCHANT_ID).orElseThrow();

        assertEquals(0, new BigDecimal("40000.00").compareTo(suspense.getBalance()));
        assertEquals(0, new BigDecimal("10000.00").compareTo(dest.getBalance()));
        assertEquals(0, new BigDecimal("10000.00").compareTo(mb.getAvailableBalance()));

        // Verify Ledgers
        List<Transaction> txs = transactionRepository.findAll();
        assertEquals(1, txs.size());
        assertEquals(2, ledgerEntryRepository.count());
    }

    @Test
    public void unreconciledInstruction_ShouldNotSettle() {
        reconciledInstruction.setStatus("READY");
        instructionRepository.save(reconciledInstruction);

        BusinessException exception = assertThrows(BusinessException.class, () -> {
            executionService.executeSettlement(reconciledInstruction.getInstructionId(), TEST_MERCHANT_ID);
        });

        assertTrue(exception.getMessage().contains("must be RECONCILED"));
        assertEquals(0, transactionRepository.count(), "No financial effects should occur");
    }

    @Test
    public void merchantCannotExecuteAnotherMerchantsSettlement() {
        BusinessException exception = assertThrows(BusinessException.class, () -> {
            executionService.executeSettlement(reconciledInstruction.getInstructionId(), 999L); // Malicious Merchant ID
        });

        assertTrue(exception.getMessage().contains("Not authorized"));
    }

    @Test
    public void concurrentSettlementExecution_ShouldCreateExactlyOneFinancialEffect() throws InterruptedException {
        int threads = 20;
        ExecutorService executor = Executors.newFixedThreadPool(threads);
        CountDownLatch startPistol = new CountDownLatch(1);
        CountDownLatch finishLine = new CountDownLatch(threads);

        AtomicInteger successCount = new AtomicInteger(0);

        for (int i = 0; i < threads; i++) {
            executor.submit(() -> {
                try {
                    startPistol.await();
                    SettlementInstruction res = executionService.executeSettlement(reconciledInstruction.getInstructionId(), TEST_MERCHANT_ID);
                    if ("SETTLED".equals(res.getStatus())) {
                        successCount.incrementAndGet();
                    }
                } catch (Exception e) {
                    // Safe to ignore lock timeouts
                } finally {
                    finishLine.countDown();
                }
            });
        }

        startPistol.countDown();
        finishLine.await(10, TimeUnit.SECONDS);
        executor.shutdown();

        // 20 threads will try to settle. Because of idempotent returns, all might technically "succeed",
        // but the DB locks ensure the financial logic only executes once.
        Account dest = accountPersistencePort.findByAccountNumber(DEST_ACC).orElseThrow();
        assertEquals(0, new BigDecimal("10000.00").compareTo(dest.getBalance()), "Balance must not be double-credited");
        assertEquals(1, transactionRepository.count(), "Exactly one settlement transaction must be recorded");
    }

    @Test
    public void settlementFailure_ShouldRollbackAllFinancialEffects() {
        // Sabotage the ledger saving to simulate a mid-flight crash
        doThrow(new RuntimeException("Simulated Database Crash")).when(ledgerEntryRepository).saveAll(any());

        assertThrows(RuntimeException.class, () -> {
            executionService.executeSettlement(reconciledInstruction.getInstructionId(), TEST_MERCHANT_ID);
        });

        // Verify Rollback
        Account dest = accountPersistencePort.findByAccountNumber(DEST_ACC).orElseThrow();
        assertEquals(0, new BigDecimal("0.00").compareTo(dest.getBalance()), "Destination account must roll back to 0");

        SettlementInstruction instr = instructionRepository.findById(reconciledInstruction.getId()).orElseThrow();
        assertEquals("RECONCILED", instr.getStatus(), "Instruction status must roll back to RECONCILED");
    }
}
