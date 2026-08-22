package com.company.banking.apigateway.application.port.out;

import com.company.banking.apigateway.domain.ApiKey;

import java.util.List;
import java.util.Optional;

public interface ApiKeyPersistencePort {
    ApiKey save(ApiKey apiKey);
    Optional<ApiKey> findById(Long id);
    Optional<ApiKey> findByKeyHash(String keyHash);
    List<ApiKey> findByMerchantId(Long merchantId);
}
