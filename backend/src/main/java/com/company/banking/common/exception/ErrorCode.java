package com.company.banking.common.exception;

import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;

@Getter
@RequiredArgsConstructor
public enum ErrorCode {
    INTERNAL_SERVER_ERROR("ERR_500", "An unexpected error occurred", HttpStatus.INTERNAL_SERVER_ERROR),
    RESOURCE_NOT_FOUND("ERR_404", "Requested resource was not found", HttpStatus.NOT_FOUND),
    INVALID_REQUEST("ERR_400", "Invalid request parameter or body", HttpStatus.BAD_REQUEST),
    UNAUTHORIZED("ERR_401", "Authentication required", HttpStatus.UNAUTHORIZED),
    FORBIDDEN("ERR_403", "Access denied", HttpStatus.FORBIDDEN),
    INSUFFICIENT_FUNDS("ERR_BANK_001", "Insufficient account balance for transaction", HttpStatus.BAD_REQUEST),
    ACCOUNT_SUSPENDED("ERR_BANK_002", "Account is suspended or inactive", HttpStatus.BAD_REQUEST),
    DUPLICATE_TRANSACTION("ERR_BANK_003", "Duplicate transaction detected via idempotency check", HttpStatus.CONFLICT);

    private final String code;
    private final String defaultMessage;
    private final HttpStatus httpStatus;
}
