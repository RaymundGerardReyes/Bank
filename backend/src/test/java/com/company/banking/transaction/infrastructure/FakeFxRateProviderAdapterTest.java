package com.company.banking.transaction.infrastructure;

import com.company.banking.common.exception.BusinessException;
import com.company.banking.common.exception.ErrorCode;
import com.company.banking.transaction.domain.CurrencyCode;
import com.company.banking.transaction.domain.FxCalculationService;
import com.company.banking.transaction.domain.FxQuote;
import com.company.banking.transaction.domain.Money;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.math.BigDecimal;
import java.math.RoundingMode;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

class FakeFxRateProviderAdapterTest {

    private FakeFxRateProviderAdapter adapter;
    private FxCalculationService calculationService;

    @BeforeEach
    void setUp() {
        adapter = new FakeFxRateProviderAdapter();
        calculationService = new FxCalculationService();
    }

    @Test
    @DisplayName("USD to PHP benchmark rate must match 62.6280 and convert $122,074.00 to ₱7,645,250.47")
    void shouldReturnAccurateMidMarketRateForUsdToPhp() {
        Money usdAmount = Money.of(new BigDecimal("122074.00"), CurrencyCode.USD);

        FxQuote quote = adapter.getQuote(CurrencyCode.USD, CurrencyCode.PHP, usdAmount);

        assertThat(quote).isNotNull();
        assertThat(quote.getBaseCurrency()).isEqualTo(CurrencyCode.USD);
        assertThat(quote.getQuoteCurrency()).isEqualTo(CurrencyCode.PHP);
        assertThat(quote.getRate()).isEqualByComparingTo(new BigDecimal("62.628000"));
        assertThat(quote.getExpiresAt()).isAfter(java.time.Instant.now());

        // Calculate converted PHP destination amount
        Money phpConverted = calculationService.calculateDestinationAmount(usdAmount, quote);

        // 122,074.00 * 62.6280 = 7,645,250.472 -> rounds HALF_EVEN to 7,645,250.47
        assertThat(phpConverted.getAmount()).isEqualByComparingTo(new BigDecimal("7645250.47"));
        assertThat(phpConverted.getCurrency()).isEqualTo(CurrencyCode.PHP);
    }

    @Test
    @DisplayName("PHP to USD inverse rate must equal 1 / 62.6280 (0.015967)")
    void shouldReturnInverseRateForPhpToUsd() {
        Money phpAmount = Money.of(new BigDecimal("1000000.00"), CurrencyCode.PHP);

        FxQuote quote = adapter.getQuote(CurrencyCode.PHP, CurrencyCode.USD, phpAmount);

        BigDecimal expectedInverse = BigDecimal.ONE.divide(new BigDecimal("62.6280"), 6, RoundingMode.HALF_UP);
        assertThat(quote.getRate()).isEqualByComparingTo(expectedInverse);

        Money usdConverted = calculationService.calculateDestinationAmount(phpAmount, quote);
        assertThat(usdConverted.getCurrency()).isEqualTo(CurrencyCode.USD);
        assertThat(usdConverted.getAmount()).isPositive();
    }

    @Test
    @DisplayName("Multi-currency quotes (EUR, GBP, JPY, CAD, SGD) should resolve with high precision")
    void shouldReturnMultiCurrencyQuotes() {
        Money dummyAmount = Money.of(BigDecimal.TEN, CurrencyCode.EUR);

        FxQuote eurQuote = adapter.getQuote(CurrencyCode.EUR, CurrencyCode.PHP, dummyAmount);
        assertThat(eurQuote.getRate()).isEqualByComparingTo(new BigDecimal("63.500000"));

        FxQuote gbpQuote = adapter.getQuote(CurrencyCode.GBP, CurrencyCode.PHP, dummyAmount);
        assertThat(gbpQuote.getRate()).isEqualByComparingTo(new BigDecimal("74.800000"));

        FxQuote jpyQuote = adapter.getQuote(CurrencyCode.JPY, CurrencyCode.PHP, dummyAmount);
        assertThat(jpyQuote.getRate()).isEqualByComparingTo(new BigDecimal("0.380000"));
    }

    @Test
    @DisplayName("Cross-currency pairs without PHP should correctly triangulate via base rates")
    void shouldReturnCrossCurrencyPairTriangulation() {
        Money usdAmount = Money.of(new BigDecimal("100.00"), CurrencyCode.USD);

        FxQuote quote = adapter.getQuote(CurrencyCode.USD, CurrencyCode.EUR, usdAmount);

        // USD (62.6280) / EUR (63.50) = 0.986268
        BigDecimal expectedRate = new BigDecimal("62.6280").divide(new BigDecimal("63.50"), 6, RoundingMode.HALF_UP);
        assertThat(quote.getRate()).isEqualByComparingTo(expectedRate);

        Money converted = calculationService.calculateDestinationAmount(usdAmount, quote);
        assertThat(converted.getCurrency()).isEqualTo(CurrencyCode.EUR);
    }

    @Test
    @DisplayName("Dynamic runtime rate updates should immediately reflect in new quotes")
    void shouldAllowDynamicRateUpdateAtRuntime() {
        BigDecimal newRate = new BigDecimal("63.1500");
        adapter.setRate(CurrencyCode.USD, newRate);

        assertThat(adapter.getRateToPhp(CurrencyCode.USD)).isEqualByComparingTo(newRate);

        Money usdAmount = Money.of(new BigDecimal("122074.00"), CurrencyCode.USD);
        FxQuote updatedQuote = adapter.getQuote(CurrencyCode.USD, CurrencyCode.PHP, usdAmount);

        assertThat(updatedQuote.getRate()).isEqualByComparingTo(newRate.setScale(6, RoundingMode.HALF_UP));

        Money newPhpAmount = calculationService.calculateDestinationAmount(usdAmount, updatedQuote);
        // 122,074 * 63.1500 = 7,708,973.10
        assertThat(newPhpAmount.getAmount()).isEqualByComparingTo(new BigDecimal("7708973.10"));
    }

    @Test
    @DisplayName("Constructor with property-injected rate should set initial USD rate")
    void shouldSupportCustomInjectedRateViaConstructor() {
        FakeFxRateProviderAdapter customAdapter = new FakeFxRateProviderAdapter(new BigDecimal("62.5000"));
        assertThat(customAdapter.getRateToPhp(CurrencyCode.USD)).isEqualByComparingTo(new BigDecimal("62.5000"));
    }

    @Test
    @DisplayName("Null currencies must throw BusinessException(INVALID_REQUEST)")
    void shouldRejectNullCurrencies() {
        Money money = Money.of(BigDecimal.ONE, CurrencyCode.USD);

        assertThatThrownBy(() -> adapter.getQuote(null, CurrencyCode.PHP, money))
                .isInstanceOf(BusinessException.class)
                .hasFieldOrPropertyWithValue("errorCode", ErrorCode.INVALID_REQUEST);

        assertThatThrownBy(() -> adapter.getQuote(CurrencyCode.USD, null, money))
                .isInstanceOf(BusinessException.class)
                .hasFieldOrPropertyWithValue("errorCode", ErrorCode.INVALID_REQUEST);
    }

    @Test
    @DisplayName("Same currency exchange must throw BusinessException(INVALID_REQUEST)")
    void shouldRejectSameCurrency() {
        Money money = Money.of(BigDecimal.ONE, CurrencyCode.USD);

        assertThatThrownBy(() -> adapter.getQuote(CurrencyCode.USD, CurrencyCode.USD, money))
                .isInstanceOf(BusinessException.class)
                .hasFieldOrPropertyWithValue("errorCode", ErrorCode.INVALID_REQUEST);
    }

    @Test
    @DisplayName("Setting non-positive rates must throw BusinessException(INVALID_REQUEST)")
    void shouldRejectNonPositiveRateUpdate() {
        assertThatThrownBy(() -> adapter.setRate(CurrencyCode.USD, BigDecimal.ZERO))
                .isInstanceOf(BusinessException.class)
                .hasFieldOrPropertyWithValue("errorCode", ErrorCode.INVALID_REQUEST);

        assertThatThrownBy(() -> adapter.setRate(CurrencyCode.USD, new BigDecimal("-1.50")))
                .isInstanceOf(BusinessException.class)
                .hasFieldOrPropertyWithValue("errorCode", ErrorCode.INVALID_REQUEST);
    }
}

