package com.company.banking.common.exception;

import com.company.banking.common.response.ApiResponse;
import com.company.banking.web.filter.CorrelationIdFilter;
import org.slf4j.MDC;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(BusinessException.class)
    public ResponseEntity<ApiResponse<Void>> handleBusinessException(BusinessException ex) {
        String correlationId = MDC.get(CorrelationIdFilter.MDC_KEY);
        ErrorCode errorCode = ex.getErrorCode();
        ApiResponse<Void> response = ApiResponse.error(ex.getMessage(), errorCode.getCode(), correlationId);
        return new ResponseEntity<>(response, errorCode.getHttpStatus());
    }

    @ExceptionHandler(org.springframework.security.core.AuthenticationException.class)
    public ResponseEntity<ApiResponse<Void>> handleAuthenticationException(org.springframework.security.core.AuthenticationException ex) {
        String correlationId = MDC.get(CorrelationIdFilter.MDC_KEY);
        ApiResponse<Void> response = ApiResponse.error("Invalid email or password", "ERR_401", correlationId);
        return new ResponseEntity<>(response, HttpStatus.UNAUTHORIZED);
    }

    @ExceptionHandler(org.springframework.web.bind.MethodArgumentNotValidException.class)
    public ResponseEntity<ApiResponse<Void>> handleValidationException(org.springframework.web.bind.MethodArgumentNotValidException ex) {
        String correlationId = MDC.get(CorrelationIdFilter.MDC_KEY);
        String message = ex.getBindingResult().getFieldErrors().stream()
                .map(error -> error.getDefaultMessage())
                .findFirst()
                .orElse("Validation failed");
        ApiResponse<Void> response = ApiResponse.error(message, "ERR_400", correlationId);
        return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(org.springframework.http.converter.HttpMessageNotReadableException.class)
    public ResponseEntity<ApiResponse<Void>> handleHttpMessageNotReadable(org.springframework.http.converter.HttpMessageNotReadableException ex) {
        String correlationId = MDC.get(CorrelationIdFilter.MDC_KEY);
        ApiResponse<Void> response = ApiResponse.error("Malformed or invalid JSON payload", "ERR_400", correlationId);
        return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(org.springframework.web.HttpRequestMethodNotSupportedException.class)
    public ResponseEntity<ApiResponse<Void>> handleMethodNotSupported(org.springframework.web.HttpRequestMethodNotSupportedException ex) {
        String correlationId = MDC.get(CorrelationIdFilter.MDC_KEY);
        ApiResponse<Void> response = ApiResponse.error("HTTP method not supported", "ERR_405", correlationId);
        return new ResponseEntity<>(response, HttpStatus.METHOD_NOT_ALLOWED);
    }

    @ExceptionHandler(org.springframework.dao.DataIntegrityViolationException.class)
    public ResponseEntity<ApiResponse<Void>> handleDataIntegrityViolation(
            org.springframework.dao.DataIntegrityViolationException ex, 
            jakarta.servlet.http.HttpServletRequest request) {
        
        String correlationId = MDC.get(CorrelationIdFilter.MDC_KEY);
        String path = request.getRequestURI();
        
        if (path.contains("/webhooks/")) {
            ApiResponse<Void> response = ApiResponse.<Void>success(null, "Duplicate webhook acknowledged.");
            return ResponseEntity.ok(response);
        }

        ApiResponse<Void> response = ApiResponse.error("A transaction with this Idempotency Key is already processing.", "CONFLICT", correlationId);
        return ResponseEntity.status(HttpStatus.CONFLICT).body(response);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiResponse<Void>> handleGenericException(Exception ex) {
        String correlationId = MDC.get(CorrelationIdFilter.MDC_KEY);
        // Log the exception to the console so it's not silently hidden
        ex.printStackTrace();
        ApiResponse<Void> response = ApiResponse.error("An internal error occurred", ErrorCode.INTERNAL_SERVER_ERROR.getCode(), correlationId);
        return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
    }
}
