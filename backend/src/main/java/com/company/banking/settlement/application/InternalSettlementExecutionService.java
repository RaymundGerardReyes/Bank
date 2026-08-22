package com.company.banking.settlement.application;

import com.company.banking.account.application.port.out.AccountPersistencePort;
import com.company.banking.account.domain.Account;
import com.company.banking.common.exception.BusinessException;
import com.company.banking.common.exception.ConflictException;
import com.company.banking.common.exception.ErrorCode;
import com.company.banking.settlement.domain.MerchantBalance;
import com.company.banking.settlement.domain.SettlementInstruction;
import com.company.banking.settlement.infrastructure.MerchantBalanceJpaRepository;
import com.company.banking.settlement.infrastructure.SettlementInstructionJpaRepository;
import com.company.banking.transaction.application.port.out.LedgerPersistencePort;
import com.company.banking.transaction.domain.EntryType;
import com.company.banking.transaction.domain.LedgerEntry;
import com.company.banking.transaction.domain.Transaction;
import com.company.banking.transaction.domain.TransactionStatus;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Arrays;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class InternalSettlementExecutionService {

    private final SettlementInstructionJpaRepository instructionRepository;
    private final MerchantBalanceJpaRepository merchantBalanceRepository;
    private final AccountPersistencePort accountPersistencePort;
    private final LedgerPersistencePort ledgerPersistencePort;
    private final com.company.banking.account.application.GlobalAccountLockGuard globalAccountLockGuard;

    @Transactional
    public SettlementInstruction executeSettlement(String instructionId, Long requestingMerchantId) {
        log.info("[SETTLEMENT EXECUTION] Initiating execution for Instruction: {}", instructionId);

        // 1. Lock the Instruction to serialize concurrent execution attempts
        SettlementInstruction instruction = instructionRepository.findByInstructionIdForUpdate(instructionId)
                .orElseThrow(() -> new BusinessException(ErrorCode.NOT_FOUND, "Instruction not found: " + instructionId));

        // 2. Cross-Merchant Authorization Protection
        if (!instruction.getMerchantId().equals(requestingMerchantId)) {
            throw new BusinessException(ErrorCode.FORBIDDEN, "Not authorized to execute settlement for this merchant.");
        }

        // 3. Strict State Machine & Idempotency Enforcement
        if ("SETTLED".equals(instruction.getStatus())) {
            log.info("[SETTLEMENT EXECUTION] Instruction {} is already SETTLED. Idempotent return.", instructionId);
            return instruction;
        }

        if (!"RECONCILED".equals(instruction.getStatus())) {
            throw new BusinessException(ErrorCode.INVALID_REQUEST, 
                    "Cannot execute settlement. Instruction must be RECONCILED. Current state: " + instruction.getStatus());
        }

        // 4. Deterministic Account Locking (Prevents Deadlocks)
        String sourceAccNumber = "MERCHANT-SETTLEMENT-" + instruction.getMerchantId();
        String destAccNumber = instruction.getDestinationAccount();

        List<Account> lockedAccounts = globalAccountLockGuard.acquireDeterministicLocks(sourceAccNumber, destAccNumber);
        Account source = lockedAccounts.get(0);
        Account destination = lockedAccounts.get(1);

        // 5. Account Mutation
        if (source.getBalance().compareTo(instruction.getAmount()) < 0) {
            throw new BusinessException(ErrorCode.INSUFFICIENT_FUNDS, "Suspense account lacks sufficient funds to settle.");
        }
        
        source.setBalance(source.getBalance().subtract(instruction.getAmount()));
        destination.setBalance(destination.getBalance().add(instruction.getAmount()));
        
        accountPersistencePort.save(source);
        accountPersistencePort.save(destination);

        // 6. Update Merchant Operational Balance
        MerchantBalance merchantBalance = merchantBalanceRepository.findByMerchantId(instruction.getMerchantId())
                .orElseThrow(() -> new BusinessException(ErrorCode.NOT_FOUND, "Merchant balance record not found"));
        
        merchantBalance.setAvailableBalance(merchantBalance.getAvailableBalance().add(instruction.getAmount()));
        merchantBalanceRepository.save(merchantBalance);

        // 7. Immutable Double-Entry Ledger
        String txRef = "SETTLE-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();

        LedgerEntry debit = LedgerEntry.builder()
                .transactionReference(txRef)
                .accountNumber(source.getAccountNumber())
                .entryType(EntryType.DEBIT)
                .amount(instruction.getAmount())
                .currency(instruction.getCurrency())
                .build();

        LedgerEntry credit = LedgerEntry.builder()
                .transactionReference(txRef)
                .accountNumber(destination.getAccountNumber())
                .entryType(EntryType.CREDIT)
                .amount(instruction.getAmount())
                .currency(instruction.getCurrency())
                .build();

        ledgerPersistencePort.saveLedgerEntries(Arrays.asList(debit, credit));

        Transaction transaction = Transaction.builder()
                .transactionReference(txRef)
                .idempotencyKey("EXEC-" + instruction.getInstructionId())
                .sourceAccountNumber(source.getAccountNumber())
                .destinationAccountNumber(destination.getAccountNumber())
                .amount(instruction.getAmount())
                .currency(instruction.getCurrency())
                .status(TransactionStatus.COMPLETED)
                .description("Settlement Payout for " + instruction.getInstructionId())
                .build();

        try {
            ledgerPersistencePort.save(transaction);
        } catch (DataIntegrityViolationException e) {
            throw new ConflictException("Settlement transaction is idempotent. Blocked at DB level.");
        }

        // 8. Terminal State Transition
        instruction.setStatus("SETTLED");
        log.info("[SETTLEMENT EXECUTION] Successfully executed settlement for {}. Amount: {}", instructionId, instruction.getAmount());
        
        return instructionRepository.save(instruction);
    }
}
