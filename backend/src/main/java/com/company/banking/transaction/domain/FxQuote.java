package com.company.banking.transaction.domain;

import com.company.banking.common.exception.BusinessException;
import com.company.banking.common.exception.ErrorCode;

import java.math.BigDecimal;
import java.time.Instant;

public class FxQuote {
    private final CurrencyCode baseCurrency;
    private final CurrencyCode quoteCurrency;
    private final BigDecimal rate;
    private final Instant quotedAt;
    private final Instant expiresAt;
    private final String provider;
    private final String providerReference;

    public FxQuote(CurrencyCode baseCurrency, CurrencyCode quoteCurrency, BigDecimal rate, 
                   Instant quotedAt, Instant expiresAt, String provider, String providerReference) {
        if (baseCurrency == null || quoteCurrency == null) {
            throw new IllegalArgumentException("Base and quote currencies must not be null");
        }
        if (baseCurrency == quoteCurrency) {
            throw new IllegalArgumentException("Base and quote currencies must be different for an FX quote");
        }
        if (rate == null || rate.compareTo(BigDecimal.ZERO) <= 0) {
            throw new IllegalArgumentException("FX rate must be positive");
        }
        if (quotedAt == null || expiresAt == null || quotedAt.isAfter(expiresAt)) {
            throw new IllegalArgumentException("Valid quotedAt and expiresAt timestamps are required");
        }
        
        this.baseCurrency = baseCurrency;
        this.quoteCurrency = quoteCurrency;
        this.rate = rate;
        this.quotedAt = quotedAt;
        this.expiresAt = expiresAt;
        this.provider = provider;
        this.providerReference = providerReference;
    }

    public void validateNotExpired(Instant now) {
        if (now.isAfter(expiresAt)) {
            throw new BusinessException(ErrorCode.INVALID_REQUEST, "FX quote has expired");
        }
    }

    public CurrencyCode getBaseCurrency() { return baseCurrency; }
    public CurrencyCode getQuoteCurrency() { return quoteCurrency; }
    public BigDecimal getRate() { return rate; }
    public Instant getQuotedAt() { return quotedAt; }
    public Instant getExpiresAt() { return expiresAt; }
    public String getProvider() { return provider; }
    public String getProviderReference() { return providerReference; }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        FxQuote fxQuote = (FxQuote) o;
        return baseCurrency == fxQuote.baseCurrency &&
               quoteCurrency == fxQuote.quoteCurrency &&
               rate.compareTo(fxQuote.rate) == 0 &&
               java.util.Objects.equals(quotedAt, fxQuote.quotedAt) &&
               java.util.Objects.equals(expiresAt, fxQuote.expiresAt) &&
               java.util.Objects.equals(provider, fxQuote.provider) &&
               java.util.Objects.equals(providerReference, fxQuote.providerReference);
    }

    @Override
    public int hashCode() {
        return java.util.Objects.hash(baseCurrency, quoteCurrency, rate.doubleValue(), quotedAt, expiresAt, provider, providerReference);
    }
}
