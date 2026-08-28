package com.company.banking.transaction.domain;

import com.company.banking.common.exception.BusinessException;
import com.company.banking.common.exception.ErrorCode;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;

/**
 * A pure domain service responsible for cross-currency calculations.
 * This service is stateless and isolates FX math from application orchestration.
 */
@Service
public class FxCalculationService {

    /**
     * Applies an approved FX quote to a source monetary amount.
     * 
     * @param sourceMoney The amount and currency being transferred.
     * @param quote The validated exchange rate quote.
     * @return A new Money object representing the converted destination amount.
     */
    public Money calculateDestinationAmount(Money sourceMoney, FxQuote quote) {
        
        // 1. Enforce Currency Alignment
        if (sourceMoney.getCurrency() != quote.getBaseCurrency()) {
            throw new BusinessException(
                ErrorCode.INVALID_REQUEST, 
                String.format("Currency mismatch: Cannot apply a %s/%s quote to a %s balance.", 
                    quote.getBaseCurrency(), quote.getQuoteCurrency(), sourceMoney.getCurrency())
            );
        }

        // 2. Perform the FX Multiplication
        BigDecimal convertedAmount = sourceMoney.getAmount().multiply(quote.getRate());
        
        // 3. Enforce ISO 4217 Rounding
        return Money.of(convertedAmount, quote.getQuoteCurrency());
    }
}
