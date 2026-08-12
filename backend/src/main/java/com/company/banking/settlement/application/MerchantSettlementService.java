package com.company.banking.settlement.application;

import com.company.banking.common.audit.AuditEventPublisher;
import com.company.banking.common.exception.BusinessException;
import com.company.banking.common.exception.ErrorCode;
import com.company.banking.settlement.domain.MerchantBalance;
import com.company.banking.settlement.domain.SettlementBatch;
import com.company.banking.settlement.infrastructure.MerchantBalanceJpaRepository;
import com.company.banking.settlement.infrastructure.SettlementBatchJpaRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class MerchantSettlementService {

    private final MerchantBalanceJpaRepository merchantBalanceJpaRepository;
    private final SettlementBatchJpaRepository settlementBatchJpaRepository;
    private final AuditEventPublisher auditEventPublisher;

    /**
     * Called when a PaymentIntent is CAPTURED. Moves funds to the merchant's available balance.
     */
    @Transactional
    public void creditMerchantBalance(Long merchantId, BigDecimal amount, String currency) {
        MerchantBalance balance = merchantBalanceJpaRepository.findByMerchantId(merchantId)
                .orElseGet(() -> merchantBalanceJpaRepository.save(
                        MerchantBalance.builder()
                                .merchantId(merchantId)
                                .availableBalance(BigDecimal.ZERO)
                                .pendingBalance(BigDecimal.ZERO)
                                .currency(currency)
                                .build()
                ));

        balance.setAvailableBalance(balance.getAvailableBalance().add(amount));
        merchantBalanceJpaRepository.save(balance);

        log.info("[SETTLEMENT] Credited {} {} to Merchant {}", amount, currency, merchantId);
    }

    /**
     * Executes nightly at 11:30 PM. Sweeps all available balances into SettlementBatches.
     */
    @Scheduled(cron = "0 30 23 * * ?") 
    @Transactional
    public void generateNightlySettlementBatches() {
        log.info("[SETTLEMENT] Starting nightly settlement batch generation...");

        List<MerchantBalance> balances = merchantBalanceJpaRepository.findAll();

        for (MerchantBalance balance : balances) {
            if (balance.getAvailableBalance().compareTo(BigDecimal.ZERO) > 0) {
                
                BigDecimal amountToSettle = balance.getAvailableBalance();
                
                // Deduct from available, wait for actual bank transfer
                balance.setAvailableBalance(BigDecimal.ZERO);
                merchantBalanceJpaRepository.save(balance);

                SettlementBatch batch = SettlementBatch.builder()
                        .batchReference("STL-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase())
                        .merchantId(balance.getMerchantId())
                        .amount(amountToSettle)
                        .currency(balance.getCurrency())
                        .status("PENDING")
                        // In reality, this would be fetched from the Merchant's profile setup
                        .destinationBankAccount("ACCT-0000")
                        .destinationRoutingNumber("ROUTING-0000")
                        .build();

                settlementBatchJpaRepository.save(batch);

                log.info("[SETTLEMENT] Generated Settlement Batch {} for Merchant {} for {}", 
                        batch.getBatchReference(), balance.getMerchantId(), amountToSettle);
                
                auditEventPublisher.publishEvent("SETTLEMENT_BATCH_CREATED", balance.getMerchantId().toString(), 
                        "Settlement batch created for " + amountToSettle + " " + balance.getCurrency(), batch.getBatchReference());
            }
        }
    }
}
