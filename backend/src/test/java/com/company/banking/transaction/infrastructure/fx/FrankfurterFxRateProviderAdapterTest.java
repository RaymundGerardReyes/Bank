package com.company.banking.transaction.infrastructure.fx;

import com.company.banking.common.exception.BusinessException;
import com.company.banking.common.exception.ErrorCode;
import com.company.banking.transaction.domain.CurrencyCode;
import com.company.banking.transaction.domain.FxQuote;
import com.company.banking.transaction.domain.Money;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestTemplate;
import org.springframework.http.HttpStatus;

import java.math.BigDecimal;
import java.time.Clock;
import java.time.Instant;
import java.time.ZoneId;
import java.util.Map;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class FrankfurterFxRateProviderAdapterTest {

    @Mock
    private RestTemplate restTemplate;

    private FrankfurterFxRateProviderAdapter adapter;
    private final Clock fixedClock = Clock.fixed(Instant.parse("2026-01-01T10:00:00Z"), ZoneId.of("UTC"));

    @BeforeEach
    void setUp() {
        adapter = new FrankfurterFxRateProviderAdapter(
                restTemplate,
                "https://api.frankfurter.app",
                15,
                fixedClock
        );
    }

    @Test
    void shouldReturnValidQuoteOnSuccessfulResponse() {
        // Given
        FrankfurterRateResponse mockResponse = new FrankfurterRateResponse();
        mockResponse.setBase("USD");
        mockResponse.setRates(Map.of("PHP", new BigDecimal("58.20")));
        
        when(restTemplate.getForObject(anyString(), eq(FrankfurterRateResponse.class)))
                .thenReturn(mockResponse);

        Money sourceAmount = Money.of(new BigDecimal("100.00"), CurrencyCode.USD);

        // When
        FxQuote quote = adapter.getQuote(CurrencyCode.USD, CurrencyCode.PHP, sourceAmount);

        // Then
        assertThat(quote).isNotNull();
        assertThat(quote.getBaseCurrency()).isEqualTo(CurrencyCode.USD);
        assertThat(quote.getQuoteCurrency()).isEqualTo(CurrencyCode.PHP);
        assertThat(quote.getRate()).isEqualTo(new BigDecimal("58.20"));
        assertThat(quote.getProvider()).isEqualTo("FRANKFURTER");
        assertThat(quote.getProviderReference()).startsWith("FRK-");
        assertThat(quote.getQuotedAt()).isEqualTo(fixedClock.instant());
        assertThat(quote.getExpiresAt()).isEqualTo(fixedClock.instant().plusSeconds(15 * 60));
    }

    @Test
    void shouldThrowExceptionWhenProviderIsUnavailable() {
        // Given
        when(restTemplate.getForObject(anyString(), eq(FrankfurterRateResponse.class)))
                .thenThrow(new RestClientException("Connection timed out"));

        Money sourceAmount = Money.of(new BigDecimal("100.00"), CurrencyCode.USD);

        // When/Then
        assertThatThrownBy(() -> adapter.getQuote(CurrencyCode.USD, CurrencyCode.PHP, sourceAmount))
                .isInstanceOf(BusinessException.class)
                .hasFieldOrPropertyWithValue("errorCode", ErrorCode.FX_PROVIDER_UNAVAILABLE);
    }

    @Test
    void shouldThrowExceptionWhenProviderReturns404() {
        // Given
        when(restTemplate.getForObject(anyString(), eq(FrankfurterRateResponse.class)))
                .thenThrow(new HttpClientErrorException(HttpStatus.NOT_FOUND));

        Money sourceAmount = Money.of(new BigDecimal("100.00"), CurrencyCode.USD);

        // When/Then
        assertThatThrownBy(() -> adapter.getQuote(CurrencyCode.USD, CurrencyCode.PHP, sourceAmount))
                .isInstanceOf(BusinessException.class)
                .hasFieldOrPropertyWithValue("errorCode", ErrorCode.FX_UNSUPPORTED_PAIR);
    }

    @Test
    void shouldThrowExceptionWhenResponseIsNull() {
        // Given
        when(restTemplate.getForObject(anyString(), eq(FrankfurterRateResponse.class)))
                .thenReturn(null);

        Money sourceAmount = Money.of(new BigDecimal("100.00"), CurrencyCode.USD);

        // When/Then
        assertThatThrownBy(() -> adapter.getQuote(CurrencyCode.USD, CurrencyCode.PHP, sourceAmount))
                .isInstanceOf(BusinessException.class)
                .hasFieldOrPropertyWithValue("errorCode", ErrorCode.FX_PROVIDER_INVALID_RESPONSE);
    }

    @Test
    void shouldThrowExceptionWhenRateIsMissing() {
        // Given
        FrankfurterRateResponse mockResponse = new FrankfurterRateResponse();
        mockResponse.setBase("USD");
        mockResponse.setRates(Map.of("EUR", new BigDecimal("0.90"))); // Missing PHP
        
        when(restTemplate.getForObject(anyString(), eq(FrankfurterRateResponse.class)))
                .thenReturn(mockResponse);

        Money sourceAmount = Money.of(new BigDecimal("100.00"), CurrencyCode.USD);

        // When/Then
        assertThatThrownBy(() -> adapter.getQuote(CurrencyCode.USD, CurrencyCode.PHP, sourceAmount))
                .isInstanceOf(BusinessException.class)
                .hasFieldOrPropertyWithValue("errorCode", ErrorCode.FX_PROVIDER_INVALID_RESPONSE);
    }

    @Test
    void shouldThrowExceptionWhenRateIsZeroOrNegative() {
        // Given
        FrankfurterRateResponse mockResponse = new FrankfurterRateResponse();
        mockResponse.setBase("USD");
        mockResponse.setRates(Map.of("PHP", BigDecimal.ZERO)); 
        
        when(restTemplate.getForObject(anyString(), eq(FrankfurterRateResponse.class)))
                .thenReturn(mockResponse);

        Money sourceAmount = Money.of(new BigDecimal("100.00"), CurrencyCode.USD);

        // When/Then
        assertThatThrownBy(() -> adapter.getQuote(CurrencyCode.USD, CurrencyCode.PHP, sourceAmount))
                .isInstanceOf(BusinessException.class)
                .hasFieldOrPropertyWithValue("errorCode", ErrorCode.FX_QUOTE_INVALID);
    }
}
