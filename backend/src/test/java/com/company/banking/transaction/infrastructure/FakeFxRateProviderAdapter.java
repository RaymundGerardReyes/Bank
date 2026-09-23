package com.company.banking.transaction.infrastructure;

import com.company.banking.common.exception.BusinessException;
import com.company.banking.common.exception.ErrorCode;
import com.company.banking.transaction.application.port.out.FxRateProviderPort;
import com.company.banking.transaction.domain.CurrencyCode;
import com.company.banking.transaction.domain.FxQuote;
import com.company.banking.transaction.domain.Money;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Component
@ConditionalOnProperty(name = "fx.provider.type", havingValue = "fake", matchIfMissing = false)
public class FakeFxRateProviderAdapter implements FxRateProviderPort {

    public static final Map<CurrencyCode, BigDecimal> DEFAULT_RATES_TO_PHP = Map.of(
            CurrencyCode.PHP, new BigDecimal("1.00"),
            CurrencyCode.USD, new BigDecimal("62.6280"),
            CurrencyCode.EUR, new BigDecimal("63.50"),
            CurrencyCode.GBP, new BigDecimal("74.80"),
            CurrencyCode.CAD, new BigDecimal("42.80"),
            CurrencyCode.SGD, new BigDecimal("44.50"),
            CurrencyCode.JPY, new BigDecimal("0.38")
    );

    // Backward-compatible alias
    public static final Map<CurrencyCode, BigDecimal> RATES_TO_PHP = DEFAULT_RATES_TO_PHP;

    private final Map<CurrencyCode, BigDecimal> ratesToPhp = new ConcurrentHashMap<>(DEFAULT_RATES_TO_PHP);

    public FakeFxRateProviderAdapter() {
        this(new BigDecimal("62.6280"));
    }

    public FakeFxRateProviderAdapter(@Value("${fx.rates.usd-php:62.6280}") BigDecimal usdToPhpRate) {
        if (usdToPhpRate != null && usdToPhpRate.compareTo(BigDecimal.ZERO) > 0) {
            ratesToPhp.put(CurrencyCode.USD, usdToPhpRate);
        }
    }

    public void setRate(CurrencyCode currency, BigDecimal rateToPhp) {
        if (currency == null || rateToPhp == null || rateToPhp.compareTo(BigDecimal.ZERO) <= 0) {
            throw new BusinessException(ErrorCode.INVALID_REQUEST, "Rate must be strictly positive");
        }
        ratesToPhp.put(currency, rateToPhp);
    }

    public BigDecimal getRateToPhp(CurrencyCode currency) {
        return ratesToPhp.get(currency);
    }

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
            BigDecimal toPhp = ratesToPhp.get(sourceCurrency);
            if (toPhp == null) {
                throw new BusinessException(ErrorCode.FX_UNSUPPORTED_PAIR, "Unsupported currency: " + sourceCurrency);
            }
            rate = toPhp.setScale(6, RoundingMode.HALF_UP);
        } else if (sourceCurrency == CurrencyCode.PHP) {
            BigDecimal toPhp = ratesToPhp.get(destinationCurrency);
            if (toPhp == null) {
                throw new BusinessException(ErrorCode.FX_UNSUPPORTED_PAIR, "Unsupported currency: " + destinationCurrency);
            }
            rate = BigDecimal.ONE.divide(toPhp, 6, RoundingMode.HALF_UP);
        } else {
            BigDecimal srcToPhp = ratesToPhp.get(sourceCurrency);
            BigDecimal dstToPhp = ratesToPhp.get(destinationCurrency);
            if (srcToPhp == null || dstToPhp == null) {
                throw new BusinessException(ErrorCode.FX_UNSUPPORTED_PAIR, 
                    "Unsupported pair: " + sourceCurrency + " to " + destinationCurrency);
            }
            rate = srcToPhp.divide(dstToPhp, 6, RoundingMode.HALF_UP);
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
