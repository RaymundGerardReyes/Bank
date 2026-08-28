package com.company.banking.transaction.infrastructure.fx;

import com.company.banking.common.exception.BusinessException;
import com.company.banking.common.exception.ErrorCode;
import com.company.banking.transaction.application.port.out.FxRateProviderPort;
import com.company.banking.transaction.domain.CurrencyCode;
import com.company.banking.transaction.domain.FxQuote;
import com.company.banking.transaction.domain.Money;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.boot.web.client.RestTemplateBuilder;
import org.springframework.stereotype.Component;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestTemplate;

import java.math.BigDecimal;
import java.time.Clock;
import java.time.Duration;
import java.time.Instant;
import java.time.temporal.ChronoUnit;

@Component
@ConditionalOnProperty(name = "fx.provider.type", havingValue = "frankfurter")
@Slf4j
public class FrankfurterFxRateProviderAdapter implements FxRateProviderPort {

    private final RestTemplate restTemplate;
    private final String providerUrl;
    private final long ttlMinutes;
    private final Clock clock;

    @SuppressWarnings("removal")
    public FrankfurterFxRateProviderAdapter(
            RestTemplateBuilder restTemplateBuilder,
            @Value("${fx.provider.url:https://api.frankfurter.app}") String providerUrl,
            @Value("${fx.provider.timeout-ms:3000}") int timeoutMs,
            @Value("${fx.provider.ttl-minutes:15}") long ttlMinutes) {
        
        this.restTemplate = restTemplateBuilder
                .setConnectTimeout(Duration.ofMillis(timeoutMs))
                .setReadTimeout(Duration.ofMillis(timeoutMs))
                .build();
        this.providerUrl = providerUrl;
        this.ttlMinutes = ttlMinutes;
        this.clock = Clock.systemUTC();
    }

    // visible for testing
    protected FrankfurterFxRateProviderAdapter(
            RestTemplate restTemplate,
            String providerUrl,
            long ttlMinutes,
            Clock clock) {
        this.restTemplate = restTemplate;
        this.providerUrl = providerUrl;
        this.ttlMinutes = ttlMinutes;
        this.clock = clock;
    }

    @Override
    public FxQuote getQuote(CurrencyCode sourceCurrency, CurrencyCode destinationCurrency, Money sourceAmount) {
        String url = String.format("%s/v2/rate/%s/%s", 
                providerUrl, sourceCurrency.name(), destinationCurrency.name());
        
        FrankfurterRateResponse response;
        try {
            response = restTemplate.getForObject(url, FrankfurterRateResponse.class);
        } catch (HttpClientErrorException e) {
            if (e.getStatusCode().value() == 404) {
                log.warn("Unsupported currency pair {} to {}: {}", sourceCurrency, destinationCurrency, e.getMessage());
                throw new BusinessException(ErrorCode.FX_UNSUPPORTED_PAIR, "The requested currency pair is not supported by the FX provider");
            }
            log.error("HTTP error from Frankfurter API: {}", e.getMessage());
            throw new BusinessException(ErrorCode.FX_PROVIDER_UNAVAILABLE, "External FX provider is unavailable or timed out");
        } catch (RestClientException e) {
            log.error("Failed to connect to Frankfurter API: {}", e.getMessage());
            throw new BusinessException(ErrorCode.FX_PROVIDER_UNAVAILABLE, "External FX provider is unavailable or timed out");
        }

        if (response == null || response.getRates() == null || !response.getRates().containsKey(destinationCurrency.name())) {
            throw new BusinessException(ErrorCode.FX_PROVIDER_INVALID_RESPONSE, "External FX provider returned an invalid or missing rate");
        }

        BigDecimal rate = response.getRates().get(destinationCurrency.name());
        
        if (rate == null || rate.compareTo(BigDecimal.ZERO) <= 0) {
            throw new BusinessException(ErrorCode.FX_QUOTE_INVALID, "Invalid or non-positive FX rate received");
        }

        Instant now = clock.instant();
        Instant expiresAt = now.plus(ttlMinutes, ChronoUnit.MINUTES);
        
        // Use a generated reference for auditability
        String reference = "FRK-" + now.toEpochMilli();

        return new FxQuote(
                sourceCurrency,
                destinationCurrency,
                rate,
                now,
                expiresAt,
                "FRANKFURTER",
                reference
        );
    }
}
