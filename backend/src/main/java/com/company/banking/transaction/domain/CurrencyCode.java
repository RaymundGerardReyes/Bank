package com.company.banking.transaction.domain;

import com.company.banking.common.exception.BusinessException;
import com.company.banking.common.exception.ErrorCode;

public enum CurrencyCode {
    USD(2),
    PHP(2),
    EUR(2),
    GBP(2),
    JPY(0),
    SGD(2);

    private final int minorUnits;

    CurrencyCode(int minorUnits) {
        this.minorUnits = minorUnits;
    }

    public int getMinorUnits() {
        return minorUnits;
    }

    public static CurrencyCode fromString(String code) {
        if (code == null) {
            throw new BusinessException(ErrorCode.INVALID_REQUEST, "Currency code cannot be null");
        }
        try {
            return CurrencyCode.valueOf(code.trim().toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new BusinessException(ErrorCode.INVALID_REQUEST, "Unsupported or invalid currency code: " + code);
        }
    }
}
