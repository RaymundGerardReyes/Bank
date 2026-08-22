package com.company.banking.apigateway.infrastructure;

import com.company.banking.apigateway.application.port.out.ApiKeyPersistencePort;
import com.company.banking.apigateway.domain.ApiKey;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

@Component
@RequiredArgsConstructor
public class ApiKeyJpaAdapter implements ApiKeyPersistencePort {

    private final ApiKeyJpaRepository repository;

    @Override
    public ApiKey save(ApiKey apiKey) {
        ApiKeyJpaEntity entity = mapToEntity(apiKey);
        ApiKeyJpaEntity saved = repository.save(entity);
        return mapToDomain(saved);
    }

    @Override
    public Optional<ApiKey> findById(Long id) {
        return repository.findById(id).map(this::mapToDomain);
    }

    @Override
    public Optional<ApiKey> findByKeyHash(String keyHash) {
        return repository.findByKeyHash(keyHash).map(this::mapToDomain);
    }

    @Override
    public List<ApiKey> findByMerchantId(Long merchantId) {
        return repository.findByMerchantId(merchantId).stream().map(this::mapToDomain).toList();
    }

    private ApiKeyJpaEntity mapToEntity(ApiKey domain) {
        String scopesStr = domain.getScopes() != null ? String.join(",", domain.getScopes()) : "";
        return ApiKeyJpaEntity.builder()
                .id(domain.getId())
                .keyPrefix(domain.getKeyPrefix())
                .merchantId(domain.getMerchantId())
                .keyHash(domain.getKeyHash())
                .name(domain.getName())
                .environment(domain.getEnvironment())
                .cidrWhitelist(domain.getCidrWhitelist())
                .scopes(scopesStr)
                .linkedAccountId(domain.getLinkedAccountId()) // <-- MAP IT
                .expiresAt(domain.getExpiresAt())
                .revokedAt(domain.getRevokedAt())
                .lastUsedAt(domain.getLastUsedAt())
                .createdAt(domain.getCreatedAt())
                .build();
    }

    private ApiKey mapToDomain(ApiKeyJpaEntity entity) {
        java.util.Set<String> scopesSet = new java.util.HashSet<>();
        if (entity.getScopes() != null && !entity.getScopes().trim().isEmpty()) {
            scopesSet.addAll(Arrays.asList(entity.getScopes().split(",")));
        }
        return ApiKey.builder()
                .id(entity.getId())
                .keyPrefix(entity.getKeyPrefix())
                .merchantId(entity.getMerchantId())
                .keyHash(entity.getKeyHash())
                .name(entity.getName())
                .environment(entity.getEnvironment())
                .cidrWhitelist(entity.getCidrWhitelist())
                .scopes(scopesSet)
                .linkedAccountId(entity.getLinkedAccountId()) // <-- MAP IT BACK
                .expiresAt(entity.getExpiresAt())
                .revokedAt(entity.getRevokedAt())
                .lastUsedAt(entity.getLastUsedAt())
                .createdAt(entity.getCreatedAt())
                .build();
    }
}
