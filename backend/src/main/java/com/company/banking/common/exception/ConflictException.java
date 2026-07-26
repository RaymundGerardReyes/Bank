package com.company.banking.common.exception;

public class ConflictException extends BusinessException {
    public ConflictException(String message) {
        super(ErrorCode.DUPLICATE_TRANSACTION, message);
    }
}
