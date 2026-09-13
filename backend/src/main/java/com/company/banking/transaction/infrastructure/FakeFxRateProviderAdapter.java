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

    public static final java.util.Map<CurrencyCode, BigDecimal> RATES_TO_PHP = java.util.Map.of(
            CurrencyCode.PHP, new BigDecimal("1.00"),
            CurrencyCode.USD, new BigDecimal("58.20"),
            CurrencyCode.EUR, new BigDecimal("63.50"),
            CurrencyCode.GBP, new BigDecimal("74.80"),
            CurrencyCode.CAD, new BigDecimal("42.80"),
            CurrencyCode.SGD, new BigDecimal("44.50"),
            CurrencyCode.JPY, new BigDecimal("0.38")
    );

    @Override
    public FxQuote getQuote(CurrencyCode sourceCurrency, CurrencyCode destinationCurrency, Money sourceAmount) {
        if (sourceCurrency == null || destinationCurrency == null) {
            throw new BusinessException(ErrorCode.INVALID_REQUEST, "Source and destination currencies cannot be null");
        }

        if (sourceCurrency == destinationCurrency) {
            throw new BusinessException(ErrorCode.INVALID_REQUEST, "Source and destination currencies must be different for FX conversion");
        }

        BigDecimal rate;
        if (destinationCurrency == CurrencyCode.PHP) {
            BigDecimal toPhp = RATES_TO_PHP.get(sourceCurrency);
            if (toPhp == null) {
                throw new BusinessException(ErrorCode.FX_UNSUPPORTED_PAIR, "Unsupported currency: " + sourceCurrency);
            }
            rate = toPhp.setScale(6, java.math.RoundingMode.HALF_UP);
        } else if (sourceCurrency == CurrencyCode.PHP) {
            BigDecimal toPhp = RATES_TO_PHP.get(destinationCurrency);
            if (toPhp == null) {
                throw new BusinessException(ErrorCode.FX_UNSUPPORTED_PAIR, "Unsupported currency: " + destinationCurrency);
            }
            rate = BigDecimal.ONE.divide(toPhp, 6, java.math.RoundingMode.HALF_UP);
        } else {
            BigDecimal srcToPhp = RATES_TO_PHP.get(sourceCurrency);
            BigDecimal dstToPhp = RATES_TO_PHP.get(destinationCurrency);
            if (srcToPhp == null || dstToPhp == null) {
                throw new BusinessException(ErrorCode.FX_UNSUPPORTED_PAIR, 
                    "Unsupported pair: " + sourceCurrency + " to " + destinationCurrency);
            }
            rate = srcToPhp.divide(dstToPhp, 6, java.math.RoundingMode.HALF_UP);
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
