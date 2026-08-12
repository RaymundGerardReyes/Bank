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
    DUPLICATE_TRANSACTION("ERR_BANK_003", "Duplicate transaction detected via idempotency check", HttpStatus.CONFLICT),
    FRAUD_DETECTED("ERR_BANK_004", "Transaction flagged as fraudulent", HttpStatus.FORBIDDEN),
    PAYMENT_GATEWAY_ERROR("ERR_BANK_005", "External payment gateway rejected the transaction", HttpStatus.BAD_GATEWAY),
    TRANSFER_VELOCITY_EXCEEDED("ERR_BANK_006", "Daily cumulative transfer limit or velocity threshold exceeded", HttpStatus.BAD_REQUEST),
    IP_NOT_WHITELISTED("ERR_GATEWAY_001", "IP address not allowed by API key CIDR whitelist", HttpStatus.FORBIDDEN),
    INSUFFICIENT_API_SCOPE("ERR_GATEWAY_002", "API key lacks required scope for endpoint", HttpStatus.FORBIDDEN),
    ENDPOINT_NOT_SCOPED("ERR_GATEWAY_003", "Endpoint not mapped to a required scope", HttpStatus.FORBIDDEN),
    VAM_DESTINATION_NOT_PERMITTED("ERR_BANK_007", "Destination account is outside the permitted VAM hierarchy", HttpStatus.FORBIDDEN),
    NOT_FOUND("ERR_NF_001", "Requested resource was not found", HttpStatus.NOT_FOUND),
    CONFLICT("ERR_409", "Resource already exists or is in a conflicting state", HttpStatus.CONFLICT),
    SERVICE_UNAVAILABLE("ERR_503", "Downstream service or participant is temporarily unavailable", HttpStatus.SERVICE_UNAVAILABLE),
    LIMIT_EXCEEDED("ERR_BANK_008", "Transaction amount exceeds the effective hierarchical policy limit", HttpStatus.BAD_REQUEST),
    SYSTEM_ERROR("ERR_SYS_001", "System configuration or administrative error", HttpStatus.INTERNAL_SERVER_ERROR);

    private final String code;
    private final String defaultMessage;
    private final HttpStatus httpStatus;
}
