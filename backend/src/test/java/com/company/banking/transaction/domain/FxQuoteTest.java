package com.company.banking.transaction.domain;

import com.company.banking.common.exception.BusinessException;
import org.junit.jupiter.api.Test;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.temporal.ChronoUnit;

import static org.junit.jupiter.api.Assertions.assertDoesNotThrow;
import static org.junit.jupiter.api.Assertions.assertThrows;

public class FxQuoteTest {

    @Test
    void constructor_ValidInputs_ShouldSucceed() {
        assertDoesNotThrow(() -> new FxQuote(
                CurrencyCode.USD, 
                CurrencyCode.PHP, 
                new BigDecimal("58.20"), 
                Instant.now(), 
                Instant.now().plus(10, ChronoUnit.MINUTES), 
                "PROVIDER_A", 
                "REF-123"
        ));
    }

    @Test
    void constructor_SameCurrency_ShouldThrowException() {
        assertThrows(IllegalArgumentException.class, () -> new FxQuote(
                CurrencyCode.USD, 
                CurrencyCode.USD, 
                new BigDecimal("1.0"), 
                Instant.now(), 
                Instant.now().plus(10, ChronoUnit.MINUTES), 
                "PROVIDER_A", 
                "REF-123"
        ));
    }

    @Test
    void validateNotExpired_ExpiredQuote_ShouldThrowException() {
        FxQuote quote = new FxQuote(
                CurrencyCode.USD, 
                CurrencyCode.PHP, 
                new BigDecimal("58.20"), 
                Instant.now().minus(20, ChronoUnit.MINUTES), 
                Instant.now().minus(10, ChronoUnit.MINUTES), 
                "PROVIDER_A", 
                "REF-123"
        );

        assertThrows(BusinessException.class, () -> quote.validateNotExpired(Instant.now()));
    }
}
