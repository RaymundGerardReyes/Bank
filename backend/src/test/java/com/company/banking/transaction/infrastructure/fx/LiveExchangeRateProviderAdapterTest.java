package com.company.banking.transaction.infrastructure.fx;

import com.company.banking.common.exception.BusinessException;
import com.company.banking.common.exception.ErrorCode;
import com.company.banking.transaction.domain.CurrencyCode;
import com.company.banking.transaction.domain.FxCalculationService;
import com.company.banking.transaction.domain.FxQuote;
import com.company.banking.transaction.domain.Money;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestTemplate;

import java.math.BigDecimal;
import java.time.Clock;
import java.time.Instant;
import java.time.ZoneId;
import java.util.Map;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@DisplayName("LiveExchangeRateProviderAdapter Unit & Resiliency Tests")
class LiveExchangeRateProviderAdapterTest {

    @Mock
    private RestTemplate restTemplate;

    private LiveExchangeRateProviderAdapter adapter;
    private FxCalculationService calculationService;
    private Instant initialTime;
    private MutableClock clock;

    private static class MutableClock extends Clock {
        private Instant currentInstant;
        private final ZoneId zone;

        MutableClock(Instant instant, ZoneId zone) {
            this.currentInstant = instant;
            this.zone = zone;
        }

        void advanceMinutes(long minutes) {
            this.currentInstant = currentInstant.plusSeconds(minutes * 60);
        }

        @Override public ZoneId getZone() { return zone; }
        @Override public Clock withZone(ZoneId zone) { return new MutableClock(currentInstant, zone); }
        @Override public Instant instant() { return currentInstant; }
    }

    @BeforeEach
    void setUp() {
        initialTime = Instant.parse("2026-09-23T12:00:00Z");
        clock = new MutableClock(initialTime, ZoneId.of("UTC"));
        adapter = new LiveExchangeRateProviderAdapter(
                restTemplate,
                "https://open.er-api.com/v6/latest",
                15,
                clock
        );
        calculationService = new FxCalculationService();
    }

    @Test
    @DisplayName("Should fetch live exchange rate from external API and convert $122,074.00 to exactly ₱7,645,250.47")
    void shouldFetchLiveExchangeRateAndReturnAccurateQuote() {
        ExchangeRateApiResponse apiResponse = new ExchangeRateApiResponse();
        apiResponse.setResult("success");
        apiResponse.setBaseCode("USD");
        apiResponse.setRates(Map.of("PHP", new BigDecimal("62.6280"), "EUR", new BigDecimal("0.8950")));

        when(restTemplate.getForObject("https://open.er-api.com/v6/latest/USD", ExchangeRateApiResponse.class))
                .thenReturn(apiResponse);

        Money usdAmount = Money.of(new BigDecimal("122074.00"), CurrencyCode.USD);

        FxQuote quote = adapter.getQuote(CurrencyCode.USD, CurrencyCode.PHP, usdAmount);

        assertThat(quote).isNotNull();
        assertThat(quote.getBaseCurrency()).isEqualTo(CurrencyCode.USD);
        assertThat(quote.getQuoteCurrency()).isEqualTo(CurrencyCode.PHP);
        assertThat(quote.getRate()).isEqualByComparingTo(new BigDecimal("62.628000"));
        assertThat(quote.getProvider()).isEqualTo("LIVE_OPEN_EXCHANGE_RATES");
        assertThat(quote.getExpiresAt()).isEqualTo(initialTime.plusSeconds(15 * 60));

        Money phpConverted = calculationService.calculateDestinationAmount(usdAmount, quote);
        // 122,074.00 * 62.6280 = 7,645,250.472 -> rounds to 7,645,250.47
        assertThat(phpConverted.getAmount()).isEqualByComparingTo(new BigDecimal("7645250.47"));
        assertThat(phpConverted.getCurrency()).isEqualTo(CurrencyCode.PHP);

        verify(restTemplate, times(1)).getForObject(anyString(), eq(ExchangeRateApiResponse.class));
    }

    @Test
    @DisplayName("Should serve consecutive requests within 15-minute TTL from memory cache without external HTTP call")
    void shouldServeFromTtlCacheWithoutCallingExternalApiTwice() {
        ExchangeRateApiResponse apiResponse = new ExchangeRateApiResponse();
        apiResponse.setResult("success");
        apiResponse.setBaseCode("USD");
        apiResponse.setRates(Map.of("PHP", new BigDecimal("62.6280")));

        when(restTemplate.getForObject("https://open.er-api.com/v6/latest/USD", ExchangeRateApiResponse.class))
                .thenReturn(apiResponse);

        Money usdAmount = Money.of(new BigDecimal("100.00"), CurrencyCode.USD);

        // First call - triggers network fetch
        FxQuote firstQuote = adapter.getQuote(CurrencyCode.USD, CurrencyCode.PHP, usdAmount);
        assertThat(firstQuote.getRate()).isEqualByComparingTo(new BigDecimal("62.628000"));

        // Advance clock by 5 minutes (still well within 15m TTL)
        clock.advanceMinutes(5);

        // Second call - should hit in-memory cache
        FxQuote cachedQuote = adapter.getQuote(CurrencyCode.USD, CurrencyCode.PHP, usdAmount);
        assertThat(cachedQuote.getRate()).isEqualByComparingTo(new BigDecimal("62.628000"));

        // Ensure RestTemplate was only called once
        verify(restTemplate, times(1)).getForObject(anyString(), eq(ExchangeRateApiResponse.class));
    }

    @Test
    @DisplayName("Should re-query external provider after TTL expires")
    void shouldEvictAndRefreshAfterTtlExpires() {
        ExchangeRateApiResponse apiResponse1 = new ExchangeRateApiResponse();
        apiResponse1.setRates(Map.of("PHP", new BigDecimal("62.6280")));

        ExchangeRateApiResponse apiResponse2 = new ExchangeRateApiResponse();
        apiResponse2.setRates(Map.of("PHP", new BigDecimal("62.7500")));

        when(restTemplate.getForObject("https://open.er-api.com/v6/latest/USD", ExchangeRateApiResponse.class))
                .thenReturn(apiResponse1)
                .thenReturn(apiResponse2);

        Money usdAmount = Money.of(new BigDecimal("100.00"), CurrencyCode.USD);

        // First call
        FxQuote quote1 = adapter.getQuote(CurrencyCode.USD, CurrencyCode.PHP, usdAmount);
        assertThat(quote1.getRate()).isEqualByComparingTo(new BigDecimal("62.628000"));

        // Advance clock past 15-minute TTL (16 minutes)
        clock.advanceMinutes(16);

        // Second call should refresh from external provider
        FxQuote quote2 = adapter.getQuote(CurrencyCode.USD, CurrencyCode.PHP, usdAmount);
        assertThat(quote2.getRate()).isEqualByComparingTo(new BigDecimal("62.750000"));

        verify(restTemplate, times(2)).getForObject(anyString(), eq(ExchangeRateApiResponse.class));
    }

    @Test
    @DisplayName("Should fall back to resilient benchmark rate when external provider is unavailable")
    void shouldFallbackGracefullyWhenExternalApiThrowsException() {
        when(restTemplate.getForObject(anyString(), eq(ExchangeRateApiResponse.class)))
                .thenThrow(new RestClientException("Connection timed out"));

        Money usdAmount = Money.of(new BigDecimal("122074.00"), CurrencyCode.USD);

        // Should not throw, should use resilient fallback rate 62.6280
        FxQuote fallbackQuote = adapter.getQuote(CurrencyCode.USD, CurrencyCode.PHP, usdAmount);

        assertThat(fallbackQuote).isNotNull();
        assertThat(fallbackQuote.getRate()).isEqualByComparingTo(new BigDecimal("62.628000"));

        Money phpConverted = calculationService.calculateDestinationAmount(usdAmount, fallbackQuote);
        assertThat(phpConverted.getAmount()).isEqualByComparingTo(new BigDecimal("7645250.47"));
    }

    @Test
    @DisplayName("Should reject null currencies with INVALID_REQUEST")
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
    @DisplayName("Should reject same currency pair with INVALID_REQUEST")
    void shouldRejectSameCurrencyPair() {
        Money money = Money.of(BigDecimal.ONE, CurrencyCode.USD);

        assertThatThrownBy(() -> adapter.getQuote(CurrencyCode.USD, CurrencyCode.USD, money))
                .isInstanceOf(BusinessException.class)
                .hasFieldOrPropertyWithValue("errorCode", ErrorCode.INVALID_REQUEST);
    }
}

