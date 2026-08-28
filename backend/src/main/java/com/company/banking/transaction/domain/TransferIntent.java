package com.company.banking.transaction.domain;

import java.util.Optional;

public class TransferIntent {
    private final Money sourceMoney;
    private final Money destinationMoney;
    private final FxQuote fxQuote;

    private TransferIntent(Money sourceMoney, Money destinationMoney, FxQuote fxQuote) {
        if (sourceMoney == null || destinationMoney == null) {
            throw new IllegalArgumentException("Source and destination money must not be null");
        }
        this.sourceMoney = sourceMoney;
        this.destinationMoney = destinationMoney;
        this.fxQuote = fxQuote;
    }

    public static TransferIntent sameCurrency(Money amount) {
        return new TransferIntent(amount, amount, null);
    }

    public static TransferIntent crossCurrency(Money sourceMoney, Money destinationMoney, FxQuote fxQuote) {
        if (fxQuote == null) {
            throw new IllegalArgumentException("FX Quote is strictly required for cross-currency transfers");
        }
        if (sourceMoney.getCurrency() == destinationMoney.getCurrency()) {
            throw new IllegalArgumentException("Cross-currency transfer must have different source and destination currencies");
        }
        return new TransferIntent(sourceMoney, destinationMoney, fxQuote);
    }

    public Money getSourceMoney() {
        return sourceMoney;
    }

    public Money getDestinationMoney() {
        return destinationMoney;
    }

    public Optional<FxQuote> getFxQuote() {
        return Optional.ofNullable(fxQuote);
    }
    
    public TransferType getType() {
        return fxQuote == null ? TransferType.SAME_CURRENCY : TransferType.CROSS_CURRENCY;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        TransferIntent that = (TransferIntent) o;
        return java.util.Objects.equals(sourceMoney, that.sourceMoney) &&
               java.util.Objects.equals(destinationMoney, that.destinationMoney) &&
               java.util.Objects.equals(fxQuote, that.fxQuote);
    }

    @Override
    public int hashCode() {
        return java.util.Objects.hash(sourceMoney, destinationMoney, fxQuote);
    }
}
