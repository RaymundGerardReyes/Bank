package com.company.banking.transaction.domain;

import com.company.banking.common.exception.BusinessException;
import com.company.banking.common.exception.ErrorCode;
import org.junit.jupiter.api.Test;

import java.math.BigDecimal;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.junit.jupiter.api.Assertions.assertFalse;

public class MoneyTest {

    @Test
    void constructor_ShouldSetCorrectScale() {
        Money usd = Money.of(new BigDecimal("100.125"), CurrencyCode.USD);
        assertEquals(new BigDecimal("100.12"), usd.getAmount()); // HALF_EVEN rounding

        Money jpy = Money.of(new BigDecimal("100.9"), CurrencyCode.JPY);
        assertEquals(new BigDecimal("101"), jpy.getAmount()); // JPY has 0 minor units
    }

    @Test
    void add_SameCurrency_ShouldSucceed() {
        Money m1 = Money.of(new BigDecimal("50.00"), CurrencyCode.USD);
        Money m2 = Money.of(new BigDecimal("25.50"), CurrencyCode.USD);
        
        Money result = m1.add(m2);
        assertEquals(new BigDecimal("75.50"), result.getAmount());
        assertEquals(CurrencyCode.USD, result.getCurrency());
    }

    @Test
    void add_DifferentCurrency_ShouldThrowException() {
        Money m1 = Money.of(new BigDecimal("50.00"), CurrencyCode.USD);
        Money m2 = Money.of(new BigDecimal("25.50"), CurrencyCode.PHP);
        
        BusinessException ex = assertThrows(BusinessException.class, () -> m1.add(m2));
        assertEquals(ErrorCode.CROSS_CURRENCY_NOT_SUPPORTED, ex.getErrorCode());
    }

    @Test
    void subtract_SameCurrency_ShouldSucceed() {
        Money m1 = Money.of(new BigDecimal("50.00"), CurrencyCode.USD);
        Money m2 = Money.of(new BigDecimal("25.50"), CurrencyCode.USD);
        
        Money result = m1.subtract(m2);
        assertEquals(new BigDecimal("24.50"), result.getAmount());
    }

    @Test
    void compareTo_DifferentCurrency_ShouldThrowException() {
        Money m1 = Money.of(new BigDecimal("50.00"), CurrencyCode.USD);
        Money m2 = Money.of(new BigDecimal("25.50"), CurrencyCode.PHP);
        
        BusinessException ex = assertThrows(BusinessException.class, () -> m1.compareTo(m2));
        assertEquals(ErrorCode.CROSS_CURRENCY_NOT_SUPPORTED, ex.getErrorCode());
    }

    @Test
    void isLessThan_SameCurrency_ShouldWork() {
        Money m1 = Money.of(new BigDecimal("25.50"), CurrencyCode.USD);
        Money m2 = Money.of(new BigDecimal("50.00"), CurrencyCode.USD);
        
        assertTrue(m1.isLessThan(m2));
        assertFalse(m2.isLessThan(m1));
    }

    @Test
    void stringConstructor_ShouldParseCorrectly() {
        Money m = Money.of(new BigDecimal("10.00"), "php");
        assertEquals(CurrencyCode.PHP, m.getCurrency());
    }
}
