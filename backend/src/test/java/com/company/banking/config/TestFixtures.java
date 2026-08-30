package com.company.banking.config;

import com.company.banking.merchant.domain.Merchant;
import com.company.banking.merchant.infrastructure.MerchantJpaRepository;
import com.company.banking.apigateway.domain.ApiKey;
import com.company.banking.apigateway.application.port.out.ApiKeyPersistencePort;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;
import org.springframework.context.event.EventListener;
import org.springframework.transaction.annotation.Transactional;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;

@Slf4j
@Configuration
@Profile("test")
@RequiredArgsConstructor
public class TestFixtures {

    private final MerchantJpaRepository merchantJpaRepository;
    private final ApiKeyPersistencePort apiKeyPersistencePort;
    
    @PersistenceContext
    private EntityManager entityManager;

    @EventListener(ApplicationReadyEvent.class)
    @Transactional
    public void seedTestFixtures() {
        if (!merchantJpaRepository.existsById(999L)) {
            log.info("Seeding test Merchant 999");
            entityManager.createNativeQuery(
                "INSERT INTO merchants (id, merchant_code, legal_name, business_registration_number, status, owner_id, created_at) " +
                "VALUES (999, 'M-DEFAULT', 'Fallback Default Merchant', 'BRN-999999', 'ACTIVE', 1, CURRENT_TIMESTAMP)"
            ).executeUpdate();
        }
        
        if (!merchantJpaRepository.existsById(1001L)) {
            log.info("Seeding test Merchant 1001");
            entityManager.createNativeQuery(
                "INSERT INTO merchants (id, merchant_code, legal_name, business_registration_number, status, owner_id, created_at) " +
                "VALUES (1001, 'M-1001', 'Test Client Merchant', 'BRN-100100', 'ACTIVE', 1, CURRENT_TIMESTAMP)"
            ).executeUpdate();
        }

        String mockApiKeyRaw = "sk_test_mock_123456789";
        String mockKeyHash = com.company.banking.apigateway.application.CreateApiKeyService.hashKey(mockApiKeyRaw);
        if (apiKeyPersistencePort.findByKeyHash(mockKeyHash).isEmpty()) {
            log.info("Seeding test API key for gateway integration tests");
            entityManager.createNativeQuery(
                "INSERT INTO api_keys (key_prefix, key_hash, merchant_id, name, environment, cidr_whitelist, scopes, linked_account_id, expires_at, created_at) " +
                "VALUES ('sk_test_', :keyHash, 999, 'Default Integration Test Key', 'TEST', '0.0.0.0/0', 'payments:write,payments:read,accounts:write,accounts:read,payroll:write,payroll:read,routing:write,routing:read', 'MERCHANT-SETTLEMENT-123', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)"
            ).setParameter("keyHash", mockKeyHash).executeUpdate();
        }
    }
}
