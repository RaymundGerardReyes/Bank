package com.company.banking.apigateway.api;

import com.company.banking.apigateway.api.dto.ApiKeyResponse;
import com.company.banking.apigateway.api.dto.CreateApiKeyRequest;
import com.company.banking.apigateway.application.port.in.CreateApiKeyUseCase;
import com.company.banking.common.response.ApiResponse;
import com.company.banking.web.filter.CorrelationIdFilter;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.slf4j.MDC;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/apikeys")
@RequiredArgsConstructor
public class ApiKeyController {

    private final CreateApiKeyUseCase apiKeyUseCase;

    @PostMapping
    public ResponseEntity<ApiResponse<ApiKeyResponse>> createApiKey(@Valid @RequestBody CreateApiKeyRequest request) {
        String correlationId = MDC.get(CorrelationIdFilter.MDC_KEY);
        ApiKeyResponse response = apiKeyUseCase.createApiKey(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.success(response, "API key created successfully", correlationId));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<ApiKeyResponse>>> listApiKeys() {
        String correlationId = MDC.get(CorrelationIdFilter.MDC_KEY);
        List<ApiKeyResponse> list = apiKeyUseCase.listApiKeys();
        return ResponseEntity.ok(ApiResponse.success(list, "API keys retrieved successfully", correlationId));
    }

    @PostMapping("/{id}/revoke")
    public ResponseEntity<ApiResponse<Void>> revokeApiKey(@PathVariable Long id) {
        String correlationId = MDC.get(CorrelationIdFilter.MDC_KEY);
        apiKeyUseCase.revokeApiKey(id);
        return ResponseEntity.ok(ApiResponse.success(null, "API key revoked successfully", correlationId));
    }

    @PostMapping("/{id}/rotate")
    public ResponseEntity<ApiResponse<ApiKeyResponse>> rotateApiKey(@PathVariable Long id) {
        String correlationId = MDC.get(CorrelationIdFilter.MDC_KEY);
        ApiKeyResponse rotated = apiKeyUseCase.rotateApiKey(id);
        return ResponseEntity.ok(ApiResponse.success(rotated, "API key rotated successfully", correlationId));
    }
}
