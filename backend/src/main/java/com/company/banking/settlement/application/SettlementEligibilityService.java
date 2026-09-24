package com.company.banking.settlement.application;

import com.company.banking.account.application.port.out.AccountPersistencePort;
import com.company.banking.merchant.application.port.out.MerchantPersistencePort;
import com.company.banking.merchant.domain.Merchant;
import com.company.banking.transaction.domain.Transaction;
import com.company.banking.transaction.domain.TransactionStatus;
import com.company.banking.transaction.infrastructure.TransactionJpaRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Slf4j
public class SettlementEligibilityService {

    private final TransactionJpaRepository transactionRepository;
    private final MerchantPersistencePort merchantPersistencePort;
    private final AccountPersistencePort accountPersistencePort;

    /**
     * Determines eligibility and aggressively locks the rows.
     * Must be called within an existing Transaction boundary.
     */
    @Transactional(propagation = Propagation.MANDATORY)
    public List<Transaction> getEligibleTransactionsForUpdate(Long merchantId) {
        String merchantSettlementAccount = resolveMerchantSettlementAccountNumber(merchantId);
        log.info("[SETTLEMENT ELIGIBILITY] Scanning and locking eligible transactions for {}", merchantSettlementAccount);

        // Uses the @Lock(PESSIMISTIC_WRITE) query we added in Phase 5A
        // The query MUST include "AND t.settlementBatchId IS NULL" and "ORDER BY t.id ASC"
        return transactionRepository.findEligibleForSettlementForUpdate(
                merchantSettlementAccount, TransactionStatus.COMPLETED);
    }

    private String resolveMerchantSettlementAccountNumber(Long merchantId) {
        if (merchantPersistencePort != null && merchantId != null) {
            Optional<Merchant> merchantOpt = merchantPersistencePort.findById(merchantId);
            if (merchantOpt.isPresent()) {
                String configuredSettlement = merchantOpt.get().getSettlementAccount();
                if (configuredSettlement != null && !configuredSettlement.trim().isEmpty()) {
                    if (accountPersistencePort != null && accountPersistencePort.findByAccountNumber(configuredSettlement.trim()).isPresent()) {
                        return configuredSettlement.trim();
                    }
                }
            }
        }
        return "MERCHANT-SETTLEMENT-" + merchantId;
    }
}
