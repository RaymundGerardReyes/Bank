package com.company.banking.transaction.domain;

import com.company.banking.common.exception.BusinessException;
import com.company.banking.common.exception.ErrorCode;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.Objects;

public class Money {
    private final BigDecimal amount;
    private final CurrencyCode currency;

    public Money(BigDecimal amount, CurrencyCode currency) {
        if (amount == null || currency == null) {
            throw new IllegalArgumentException("Amount and currency must not be null");
        }
        this.currency = currency;
        this.amount = amount.setScale(currency.getMinorUnits(), RoundingMode.HALF_EVEN);
    }

    public static Money of(BigDecimal amount, CurrencyCode currency) {
        return new Money(amount, currency);
    }

    public static Money of(BigDecimal amount, String currencyCodeStr) {
        return new Money(amount, CurrencyCode.fromString(currencyCodeStr));
    }

    public BigDecimal getAmount() {
        return amount;
    }

    public CurrencyCode getCurrency() {
        return currency;
    }

    public Money add(Money other) {
        assertSameCurrency(other);
        return new Money(this.amount.add(other.amount), this.currency);
    }

    public Money subtract(Money other) {
        assertSameCurrency(other);
        return new Money(this.amount.subtract(other.amount), this.currency);
    }

    public int compareTo(Money other) {
        assertSameCurrency(other);
        return this.amount.compareTo(other.amount);
    }

    public boolean isLessThan(Money other) {
        return compareTo(other) < 0;
    }

    public boolean isGreaterThanOrEqual(Money other) {
        return compareTo(other) >= 0;
    }

    private void assertSameCurrency(Money other) {
        if (this.currency != other.currency) {
            throw new BusinessException(ErrorCode.CROSS_CURRENCY_NOT_SUPPORTED, 
                "Cannot perform arithmetic on different currencies: " + this.currency + " and " + other.currency);
        }
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Money money = (Money) o;
        return amount.compareTo(money.amount) == 0 && currency == money.currency;
    }

    @Override
    public int hashCode() {
        return Objects.hash(amount.doubleValue(), currency);
    }

    @Override
    public String toString() {
        return currency.name() + " " + amount.toPlainString();
    }
}
