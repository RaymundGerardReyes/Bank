package com.company.banking.transaction.domain;

import com.company.banking.common.exception.BusinessException;
import com.company.banking.common.exception.ErrorCode;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.math.BigDecimal;
import java.time.Instant;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;

public class FxCalculationServiceTest {

    private FxCalculationService fxCalculationService;

    @BeforeEach
    void setUp() {
        fxCalculationService = new FxCalculationService();
    }

    @Test
    void calculateDestinationAmount_ValidQuote_ReturnsCorrectlyRoundedMoney() {
        Money sourceMoney = Money.of(new BigDecimal("100.00"), CurrencyCode.USD);
        // Rate: 1 USD = 58.2045 PHP
        FxQuote quote = new FxQuote(CurrencyCode.USD, CurrencyCode.PHP, new BigDecimal("58.2045"), Instant.now(), Instant.now().plusSeconds(600), "PROVIDER", "REF");

        Money destinationMoney = fxCalculationService.calculateDestinationAmount(sourceMoney, quote);

        assertEquals(CurrencyCode.PHP, destinationMoney.getCurrency());
        // 100 * 58.2045 = 5820.45. PHP has 2 decimal places.
        assertEquals(new BigDecimal("5820.45"), destinationMoney.getAmount());
    }

    @Test
    void calculateDestinationAmount_HalfEvenRounding_RoundsCorrectly() {
        Money sourceMoney = Money.of(new BigDecimal("100.00"), CurrencyCode.USD);
        // Rate: 1 USD = 149.505 JPY
        FxQuote quote = new FxQuote(CurrencyCode.USD, CurrencyCode.JPY, new BigDecimal("149.505"), Instant.now(), Instant.now().plusSeconds(600), "PROVIDER", "REF");

        Money destinationMoney = fxCalculationService.calculateDestinationAmount(sourceMoney, quote);

        assertEquals(CurrencyCode.JPY, destinationMoney.getCurrency());
        // 100 * 149.505 = 14950.5. JPY has 0 decimal places. HALF_EVEN rounds 14950.5 to nearest even integer -> 14950
        assertEquals(new BigDecimal("14950"), destinationMoney.getAmount());
    }

    @Test
    void calculateDestinationAmount_CurrencyMismatch_ThrowsException() {
        Money sourceMoney = Money.of(new BigDecimal("100.00"), CurrencyCode.EUR);
        // Quote is for USD -> PHP, but we are passing EUR
        FxQuote quote = new FxQuote(CurrencyCode.USD, CurrencyCode.PHP, new BigDecimal("58.20"), Instant.now(), Instant.now().plusSeconds(600), "PROVIDER", "REF");

        BusinessException ex = assertThrows(BusinessException.class, () -> {
            fxCalculationService.calculateDestinationAmount(sourceMoney, quote);
        });

        assertEquals(ErrorCode.INVALID_REQUEST, ex.getErrorCode());
    }
}
