package com.company.banking.apigateway.application;

import com.company.banking.apigateway.api.dto.ApiKeyResponse;
import com.company.banking.apigateway.api.dto.CreateApiKeyRequest;
import com.company.banking.apigateway.application.port.in.CreateApiKeyUseCase;
import com.company.banking.apigateway.application.port.out.ApiKeyPersistencePort;
import com.company.banking.apigateway.domain.ApiKey;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.HexFormat;
import java.util.List;

@Service
@RequiredArgsConstructor
public class CreateApiKeyService implements CreateApiKeyUseCase {

    private final ApiKeyPersistencePort persistencePort;
    private final SecureRandom secureRandom = new SecureRandom();

    @Override
    @Transactional
    public ApiKeyResponse createApiKey(CreateApiKeyRequest request) {
        String env = request.getEnvironment() != null && request.getEnvironment().equalsIgnoreCase("LIVE") ? "LIVE" : "SANDBOX";
        String prefix = env.equals("LIVE") ? "sk_live_" : "sk_test_";

        byte[] randomBytes = new byte[32];
        secureRandom.nextBytes(randomBytes);
        String rawSecret = HexFormat.of().formatHex(randomBytes);
        String rawKey = prefix + rawSecret;
        String keyHash = hashKey(rawKey);
        String maskedHash = "************************" + rawSecret.substring(rawSecret.length() - 4);

        int expiryDays = env.equals("LIVE") ? 90 : 365;
        LocalDateTime expiresAt = LocalDateTime.now().plusDays(expiryDays);
        String cidr = request.getCidrWhitelist() != null && !request.getCidrWhitelist().trim().isEmpty()
                ? request.getCidrWhitelist().trim()
                : "0.0.0.0/0";

        ApiKey domain = ApiKey.builder()
                .keyPrefix(prefix)
                .keyHash(keyHash)
                .name(request.getName())
                .environment(env)
                .cidrWhitelist(cidr)
                .scopes(request.getScopes())
                .expiresAt(expiresAt)
                .createdAt(LocalDateTime.now())
                .build();

        ApiKey saved = persistencePort.save(domain);

        return ApiKeyResponse.builder()
                .id(saved.getId())
                .name(saved.getName())
                .environment(saved.getEnvironment())
                .keyPrefix(saved.getKeyPrefix())
                .maskedHash(maskedHash)
                .rawKey(rawKey)
                .cidrWhitelist(saved.getCidrWhitelist())
                .scopes(saved.getScopes())
                .expiresAt(saved.getExpiresAt())
                .revokedAt(saved.getRevokedAt())
                .lastUsedAt(saved.getLastUsedAt())
                .createdAt(saved.getCreatedAt())
                .build();
    }

    @Override
    @Transactional(readOnly = true)
    public List<ApiKeyResponse> listApiKeys() {
        return persistencePort.findAll().stream().map(key ->
            ApiKeyResponse.builder()
                    .id(key.getId())
                    .name(key.getName())
                    .environment(key.getEnvironment())
                    .keyPrefix(key.getKeyPrefix())
                    .maskedHash("************************" + key.getKeyHash().substring(Math.max(0, key.getKeyHash().length() - 4)))
                    .rawKey(null) // Never expose raw key on listing
                    .cidrWhitelist(key.getCidrWhitelist())
                    .scopes(key.getScopes())
                    .expiresAt(key.getExpiresAt())
                    .revokedAt(key.getRevokedAt())
                    .lastUsedAt(key.getLastUsedAt())
                    .createdAt(key.getCreatedAt())
                    .build()
        ).toList();
    }

    @Override
    @Transactional
    public void revokeApiKey(Long id) {
        persistencePort.findById(id).ifPresent(key -> {
            key.setRevokedAt(LocalDateTime.now());
            persistencePort.save(key);
        });
    }

    @Override
    @Transactional
    public ApiKeyResponse rotateApiKey(Long id) {
        ApiKey oldKey = persistencePort.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("API Key not found with ID: " + id));

        // Revoke old key gracefully
        oldKey.setRevokedAt(LocalDateTime.now());
        persistencePort.save(oldKey);

        // Create new rotated key inheriting properties
        CreateApiKeyRequest req = new CreateApiKeyRequest();
        req.setName(oldKey.getName() + " (Rotated)");
        req.setEnvironment(oldKey.getEnvironment());
        req.setCidrWhitelist(oldKey.getCidrWhitelist());
        req.setScopes(oldKey.getScopes());

        return createApiKey(req);
    }

    public static String hashKey(String rawKey) {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] hash = digest.digest(rawKey.getBytes(StandardCharsets.UTF_8));
            return HexFormat.of().formatHex(hash);
        } catch (NoSuchAlgorithmException e) {
            throw new RuntimeException("SHA-256 algorithm not available", e);
        }
    }
}
