package com.company.banking.transaction.domain;

import com.company.banking.common.exception.BusinessException;
import com.company.banking.common.exception.ErrorCode;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;

public class CurrencyCodeTest {

    @Test
    void fromString_ValidCode_ShouldReturnEnum() {
        assertEquals(CurrencyCode.USD, CurrencyCode.fromString("USD"));
        assertEquals(CurrencyCode.PHP, CurrencyCode.fromString("php"));
        assertEquals(CurrencyCode.EUR, CurrencyCode.fromString(" eUr "));
    }

    @Test
    void fromString_InvalidCode_ShouldThrowBusinessException() {
        BusinessException ex = assertThrows(BusinessException.class, () -> CurrencyCode.fromString("XYZ"));
        assertEquals(ErrorCode.INVALID_REQUEST, ex.getErrorCode());
    }

    @Test
    void fromString_NullCode_ShouldThrowBusinessException() {
        BusinessException ex = assertThrows(BusinessException.class, () -> CurrencyCode.fromString(null));
        assertEquals(ErrorCode.INVALID_REQUEST, ex.getErrorCode());
    }
}
