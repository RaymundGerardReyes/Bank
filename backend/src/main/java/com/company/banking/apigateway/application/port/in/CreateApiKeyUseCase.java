package com.company.banking.apigateway.application.port.in;

import com.company.banking.apigateway.api.dto.ApiKeyResponse;
import com.company.banking.apigateway.api.dto.CreateApiKeyRequest;

import java.util.List;

public interface CreateApiKeyUseCase {
    ApiKeyResponse createApiKey(Long merchantId, CreateApiKeyRequest request);
    List<ApiKeyResponse> listApiKeys(Long merchantId);
    void revokeApiKey(Long merchantId, Long id);
    ApiKeyResponse rotateApiKey(Long merchantId, Long id);
}
