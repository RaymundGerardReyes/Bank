package com.company.banking.common.response;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
@JsonInclude(JsonInclude.Include.NON_NULL)
public class ApiResponse<T> {
    private boolean success;
    private String message;
    private T data;
    private String errorCode;
    private String correlationId;
    private LocalDateTime timestamp;

    public static <T> ApiResponse<T> success(T data, String message, String correlationId) {
        return ApiResponse.<T>builder()
                .success(true)
                .message(message)
                .data(data)
                .correlationId(correlationId)
                .timestamp(LocalDateTime.now())
                .build();
    }

    public static <T> ApiResponse<T> success(T data, String correlationId) {
        return success(data, "Success", correlationId);
    }

    public static <T> ApiResponse<T> success(T data) {
        return success(data, "Success", null);
    }

    public static <T> ApiResponse<T> success(String message, T data) {
        return ApiResponse.<T>builder()
                .success(true)
                .message(message)
                .data(data)
                .timestamp(LocalDateTime.now())
                .build();
    }

    public static <T> ApiResponse<T> error(String message, String errorCode, String correlationId) {
        return ApiResponse.<T>builder()
                .success(false)
                .message(message)
                .errorCode(errorCode)
                .correlationId(correlationId)
                .timestamp(LocalDateTime.now())
                .build();
    }

    public static <T> ApiResponse<T> error(String message, String correlationId) {
        return error(message, "ERROR", correlationId);
    }

    public static <T> ApiResponse<T> error(String message) {
        return error(message, "ERROR", null);
    }
}
