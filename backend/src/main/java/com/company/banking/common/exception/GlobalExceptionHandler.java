package com.company.banking.common.exception;

import com.company.banking.common.response.ApiResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ApiResponse<Void>> handleValidationErrors(MethodArgumentNotValidException ex) {
        String correlationId = org.slf4j.MDC.get(com.company.banking.web.filter.CorrelationIdFilter.MDC_KEY);
        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(ApiResponse.error(400, "Missing or invalid required fields", "ERR_400_VALIDATION", correlationId));
    }

    @ExceptionHandler(HttpMessageNotReadableException.class)
    public ResponseEntity<ApiResponse<Void>> handleTypeConfusion(HttpMessageNotReadableException ex) {
        String correlationId = org.slf4j.MDC.get(com.company.banking.web.filter.CorrelationIdFilter.MDC_KEY);
        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(ApiResponse.error(400, "Malformed JSON payload or type mismatch", "ERR_400_MALFORMED", correlationId));
    }

    @ExceptionHandler(org.springframework.web.servlet.NoHandlerFoundException.class)
    public ResponseEntity<ApiResponse<Void>> handleNoHandlerFoundException(org.springframework.web.servlet.NoHandlerFoundException ex) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(ApiResponse.error(404, "Route not found", "ERR_404", null));
    }

    @ExceptionHandler(BusinessException.class)
    public ResponseEntity<ApiResponse<Void>> handleBusinessException(BusinessException ex) {
        HttpStatus status = (ex.getErrorCode() != null && ex.getErrorCode().getHttpStatus() != null)
                ? ex.getErrorCode().getHttpStatus()
                : HttpStatus.BAD_REQUEST;

        String mappedErrorCode = ex.getErrorCode() != null ? ex.getErrorCode().name() : "ERROR";
        if (ex.getErrorCode() == ErrorCode.NOT_FOUND || ex.getErrorCode() == ErrorCode.RESOURCE_NOT_FOUND) {
            mappedErrorCode = "ERR_404";
        } else if (ex.getErrorCode() == ErrorCode.CONFLICT || ex.getErrorCode() == ErrorCode.DUPLICATE_TRANSACTION) {
            mappedErrorCode = "ERR_409";
        }
        
        String correlationId = org.slf4j.MDC.get(com.company.banking.web.filter.CorrelationIdFilter.MDC_KEY);
        return ResponseEntity.status(status)
                .body(ApiResponse.error(status.value(), ex.getMessage(), mappedErrorCode, correlationId));
    }

    @ExceptionHandler(org.springframework.security.access.AccessDeniedException.class)
    public ResponseEntity<ApiResponse<Void>> handleAccessDeniedException(org.springframework.security.access.AccessDeniedException ex) {
        String correlationId = org.slf4j.MDC.get(com.company.banking.web.filter.CorrelationIdFilter.MDC_KEY);
        return ResponseEntity.status(HttpStatus.FORBIDDEN)
                .body(ApiResponse.error(ex.getMessage() != null ? ex.getMessage() : "Access denied", "FORBIDDEN", correlationId));
    }

    @ExceptionHandler(org.springframework.dao.DataIntegrityViolationException.class)
    public ResponseEntity<ApiResponse<Void>> handleDataIntegrityViolationException(org.springframework.dao.DataIntegrityViolationException ex) {
        String correlationId = org.slf4j.MDC.get(com.company.banking.web.filter.CorrelationIdFilter.MDC_KEY);
        String message = "A database constraint violation occurred (resource already exists).";
        String rootMsg = ex.getRootCause() != null ? ex.getRootCause().getMessage() : ex.getMessage();
        if (rootMsg != null) {
            if (rootMsg.contains("merchants_merchant_code_key")) {
                message = "The preferred routing code / merchant code is already in use. Please choose a different code or leave empty to auto-generate.";
            } else if (rootMsg.contains("merchants_business_registration_number_key")) {
                message = "The Business Registration Number is already registered.";
            }
        }
        return ResponseEntity.status(HttpStatus.CONFLICT)
                .body(ApiResponse.error(message, "ERR_409", correlationId));
    }
}
