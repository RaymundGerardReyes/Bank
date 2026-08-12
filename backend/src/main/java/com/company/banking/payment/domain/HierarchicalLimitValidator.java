package com.company.banking.payment.domain;

import com.company.banking.common.exception.BusinessException;
import com.company.banking.common.exception.ErrorCode;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.Optional;

@Component
@Slf4j
public class HierarchicalLimitValidator {

    /**
     * Determines the most restrictive limit across all policy levels and validates the transaction amount.
     */
    public void validateEffectiveLimit(BigDecimal amount, BigDecimal globalLimit, BigDecimal merchantLimit, BigDecimal customerLimit, BigDecimal railLimit) {
        
        BigDecimal effectiveLimit = globalLimit;

        if (merchantLimit != null && merchantLimit.compareTo(effectiveLimit) < 0) {
            effectiveLimit = merchantLimit;
        }

        if (customerLimit != null && customerLimit.compareTo(effectiveLimit) < 0) {
            effectiveLimit = customerLimit;
        }

        if (railLimit != null && railLimit.compareTo(effectiveLimit) < 0) {
            effectiveLimit = railLimit;
        }

        log.info("[POLICY ENGINE] Computed Effective Transaction Limit: {}", effectiveLimit);

        if (amount.compareTo(effectiveLimit) > 0) {
            throw new BusinessException(
                    ErrorCode.LIMIT_EXCEEDED, 
                    String.format("Payment amount of $%.2f exceeds the effective hierarchical limit of $%.2f", amount, effectiveLimit)
            );
        }
    }
}
