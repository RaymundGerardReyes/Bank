package com.company.banking.transaction.infrastructure;

import com.company.banking.common.exception.BusinessException;
import com.company.banking.common.exception.ErrorCode;
import com.company.banking.transaction.application.port.out.FxRateProviderPort;
import com.company.banking.transaction.domain.CurrencyCode;
import com.company.banking.transaction.domain.FxQuote;
import com.company.banking.transaction.domain.Money;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.temporal.ChronoUnit;

@Component
@ConditionalOnProperty(name = "fx.provider.type", havingValue = "fake", matchIfMissing = true)
public class FakeFxRateProviderAdapter implements FxRateProviderPort {

    @Override
    public FxQuote getQuote(CurrencyCode sourceCurrency, CurrencyCode destinationCurrency, Money sourceAmount) {
        BigDecimal rate;

        // Deterministic test fixtures
        if (sourceCurrency == CurrencyCode.USD && destinationCurrency == CurrencyCode.PHP) {
            rate = new BigDecimal("58.20");
        } else if (sourceCurrency == CurrencyCode.PHP && destinationCurrency == CurrencyCode.USD) {
            rate = new BigDecimal("0.017182");
        } else {
            throw new BusinessException(ErrorCode.FX_UNSUPPORTED_PAIR, 
                "Fake provider does not support " + sourceCurrency + " to " + destinationCurrency);
        }

        // Return an immutable quote valid for 15 minutes
        return new FxQuote(
                sourceCurrency,
                destinationCurrency,
                rate,
                Instant.now(),
                Instant.now().plus(15, ChronoUnit.MINUTES),
                "FAKE_INTERNAL_TEST_PROVIDER",
                "REF-" + Instant.now().toEpochMilli()
        );
    }
}
