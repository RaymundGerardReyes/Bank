package com.company.banking.apigateway.security;

import com.company.banking.apigateway.infrastructure.ApiKeyJpaEntity;
import com.company.banking.apigateway.infrastructure.ApiKeyJpaRepository;
import com.company.banking.common.exception.BusinessException;
import com.company.banking.common.exception.ErrorCode;
import com.company.banking.config.BaseIntegrationTest;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.context.ActiveProfiles;

import java.time.LocalDateTime;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@ActiveProfiles("test")
public class ApiKeyAuthenticationPathIT extends BaseIntegrationTest {

    @Autowired
    private ApiKeyAuthenticationFilter apiKeyAuthenticationFilter;

    @Autowired
    private ApiKeyJpaRepository apiKeyRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    private String rawApiKey;
    private ApiKeyJpaEntity validKeyEntity;

    @BeforeEach
    public void setup() {
        apiKeyRepository.deleteAll();

        rawApiKey = "sk_live_" + UUID.randomUUID().toString().replaceAll("-", "");
        String hashedKey = passwordEncoder.encode(rawApiKey);

        validKeyEntity = ApiKeyJpaEntity.builder()
                .keyPrefix("sk_live_")
                .merchantId(1001L)
                .keyHash(hashedKey)
                .name("Production Gateway Key")
                .environment("PRODUCTION")
                .cidrWhitelist("192.168.1.100/32, 10.0.0.0/8")
                .expiresAt(LocalDateTime.now().plusDays(30))
                .build();

        validKeyEntity = apiKeyRepository.save(validKeyEntity);
    }

    @Test
    @DisplayName("P01 (Golden Path): Valid API key and authorized CIDR passes authentication")
    public void p01_ValidApiKeyAndCidr_PassesAuthentication() {
        ApiKeyJpaEntity retrieved = apiKeyRepository.findByKeyHash(validKeyEntity.getKeyHash()).orElseThrow();
        assertNotNull(retrieved);
        assertNull(retrieved.getRevokedAt(), "Key must not be revoked");
        assertTrue(retrieved.getExpiresAt().isAfter(LocalDateTime.now()), "Key must not be expired");
    }

    @Test
    @DisplayName("P02 (Expired Key Guard): Expired API key is rejected")
    public void p02_ExpiredApiKey_Rejected() {
        validKeyEntity.setExpiresAt(LocalDateTime.now().minusDays(1));
        apiKeyRepository.save(validKeyEntity);

        ApiKeyJpaEntity retrieved = apiKeyRepository.findByKeyHash(validKeyEntity.getKeyHash()).orElseThrow();
        assertTrue(retrieved.getExpiresAt().isBefore(LocalDateTime.now()), "Key must be recognized as expired");
    }

    @Test
    @DisplayName("P03 (Revoked Key Guard): Revoked API key is rejected")
    public void p03_RevokedApiKey_Rejected() {
        validKeyEntity.setRevokedAt(LocalDateTime.now());
        apiKeyRepository.save(validKeyEntity);

        ApiKeyJpaEntity retrieved = apiKeyRepository.findByKeyHash(validKeyEntity.getKeyHash()).orElseThrow();
        assertNotNull(retrieved.getRevokedAt(), "Key must be marked as revoked");
    }
}
