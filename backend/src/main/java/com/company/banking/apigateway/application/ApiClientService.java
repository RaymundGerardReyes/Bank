package com.company.banking.apigateway.application;

import com.company.banking.apigateway.domain.ApiClient;
import com.company.banking.apigateway.infrastructure.ApiClientJpaRepository;
import com.company.banking.common.audit.AuditEventPublisher;
import com.company.banking.common.exception.BusinessException;
import com.company.banking.common.exception.ErrorCode;
import com.company.banking.merchant.domain.Merchant;
import com.company.banking.merchant.infrastructure.MerchantJpaRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.SecureRandom;
import java.util.Base64;
import java.util.UUID;
import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
@Slf4j
public class ApiClientService {

    private final ApiClientJpaRepository apiClientJpaRepository;
    private final MerchantJpaRepository merchantJpaRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuditEventPublisher auditEventPublisher;

    @Transactional
    public ApiCredentialsResponse provisionClient(Long merchantId, String environment, String scopes) {
        Merchant merchant = merchantJpaRepository.findById(merchantId)
                .orElseThrow(() -> new BusinessException(ErrorCode.NOT_FOUND, "Merchant not found"));

        if (!"ACTIVE".equals(merchant.getStatus())) {
            throw new BusinessException(ErrorCode.FORBIDDEN, "Cannot provision API keys for a non-active merchant");
        }

        String clientId = "client_" + UUID.randomUUID().toString().replace("-", "");
        String clientSecret = generateSecureSecret();
        String clientSecretHash = passwordEncoder.encode(clientSecret);

        ApiClient apiClient = ApiClient.builder()
                .clientId(clientId)
                .clientSecretHash(clientSecretHash)
                .merchantId(merchantId)
                .environment(environment.toUpperCase())
                .scopes(scopes)
                .status("ACTIVE")
                .build();

        apiClientJpaRepository.save(apiClient);

        log.info("API CLIENT PROVISIONED: Merchant {}, Environment {}", merchant.getLegalName(), environment);
        auditEventPublisher.publishEvent("API_CLIENT_CREATED", "SYSTEM", 
            "Created " + environment + " API Client for Merchant ID " + merchantId, "CLIENT-" + clientId);

        // This is the ONLY time the raw secret is returned to the client
        return new ApiCredentialsResponse(clientId, clientSecret, environment);
    }

    @Transactional
    public void revokeClient(String clientId) {
        ApiClient client = apiClientJpaRepository.findByClientId(clientId)
                .orElseThrow(() -> new BusinessException(ErrorCode.NOT_FOUND, "API Client not found"));

        client.setStatus("REVOKED");
        client.setRevokedAt(LocalDateTime.now());
        apiClientJpaRepository.save(client);

        log.warn("API CLIENT REVOKED: ClientId {}", clientId);
        auditEventPublisher.publishEvent("API_CLIENT_REVOKED", "SYSTEM", 
            "API Client revoked permanently", "CLIENT-" + clientId);
    }

    private String generateSecureSecret() {
        SecureRandom random = new SecureRandom();
        byte[] secretBytes = new byte[32]; // 256-bit secret
        random.nextBytes(secretBytes);
        return "secret_" + Base64.getUrlEncoder().withoutPadding().encodeToString(secretBytes);
    }

    // DTO for returning credentials once
    public static class ApiCredentialsResponse {
        public final String clientId;
        public final String clientSecret;
        public final String environment;

        public ApiCredentialsResponse(String clientId, String clientSecret, String environment) {
            this.clientId = clientId;
            this.clientSecret = clientSecret;
            this.environment = environment;
        }
    }
}
