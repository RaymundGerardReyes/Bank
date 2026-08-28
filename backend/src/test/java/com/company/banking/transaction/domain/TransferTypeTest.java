package com.company.banking.transaction.domain;

import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;

public class TransferTypeTest {

    @Test
    void from_SameCurrency_ReturnsSameCurrency() {
        assertEquals(TransferType.SAME_CURRENCY, TransferType.from(CurrencyCode.USD, CurrencyCode.USD));
        assertEquals(TransferType.SAME_CURRENCY, TransferType.from(CurrencyCode.PHP, CurrencyCode.PHP));
    }

    @Test
    void from_DifferentCurrencies_ReturnsCrossCurrency() {
        assertEquals(TransferType.CROSS_CURRENCY, TransferType.from(CurrencyCode.USD, CurrencyCode.PHP));
        assertEquals(TransferType.CROSS_CURRENCY, TransferType.from(CurrencyCode.EUR, CurrencyCode.USD));
    }

    @Test
    void from_NullArguments_ThrowsException() {
        assertThrows(IllegalArgumentException.class, () -> TransferType.from(null, CurrencyCode.USD));
        assertThrows(IllegalArgumentException.class, () -> TransferType.from(CurrencyCode.USD, null));
    }
}
