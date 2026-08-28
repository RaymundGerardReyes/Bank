package com.company.banking.transaction.domain;

import org.junit.jupiter.api.Test;
import java.math.BigDecimal;
import java.time.Instant;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;

public class TransferIntentTest {

    @Test
    void sameCurrency_ShouldCreateCorrectIntent() {
        Money amount = Money.of(new BigDecimal("100.00"), CurrencyCode.USD);
        TransferIntent intent = TransferIntent.sameCurrency(amount);

        assertEquals(TransferType.SAME_CURRENCY, intent.getType());
        assertEquals(amount, intent.getSourceMoney());
        assertEquals(amount, intent.getDestinationMoney());
        assertFalse(intent.getFxQuote().isPresent());
    }

    @Test
    void crossCurrency_WithMissingQuote_ShouldThrowException() {
        Money source = Money.of(new BigDecimal("100.00"), CurrencyCode.USD);
        Money dest = Money.of(new BigDecimal("5800.00"), CurrencyCode.PHP);
        
        assertThrows(IllegalArgumentException.class, () -> TransferIntent.crossCurrency(source, dest, null));
    }

    @Test
    void crossCurrency_WithSameCurrency_ShouldThrowException() {
        Money source = Money.of(new BigDecimal("100.00"), CurrencyCode.USD);
        Money dest = Money.of(new BigDecimal("100.00"), CurrencyCode.USD);
        FxQuote quote = new FxQuote(CurrencyCode.USD, CurrencyCode.PHP, new BigDecimal("58.0"), Instant.now(), Instant.now().plusSeconds(60), "PROVIDER", "REF");

        assertThrows(IllegalArgumentException.class, () -> TransferIntent.crossCurrency(source, dest, quote));
    }
}
