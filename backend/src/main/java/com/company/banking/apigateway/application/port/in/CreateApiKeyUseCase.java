package com.company.banking.apigateway.application.port.in;

import com.company.banking.apigateway.api.dto.ApiKeyResponse;
import com.company.banking.apigateway.api.dto.CreateApiKeyRequest;

import java.util.List;

public interface CreateApiKeyUseCase {
    ApiKeyResponse createApiKey(CreateApiKeyRequest request);
    List<ApiKeyResponse> listApiKeys();
    void revokeApiKey(Long id);
    ApiKeyResponse rotateApiKey(Long id);
}
