package com.company.banking.apigateway.application;

import com.company.banking.apigateway.api.dto.ApiKeyResponse;
import com.company.banking.apigateway.api.dto.CreateApiKeyRequest;
import com.company.banking.apigateway.application.port.in.CreateApiKeyUseCase;
import com.company.banking.apigateway.application.port.out.ApiKeyPersistencePort;
import com.company.banking.apigateway.domain.ApiKey;
import com.company.banking.account.application.port.out.AccountPersistencePort;
import com.company.banking.account.domain.Account;
import com.company.banking.merchant.application.port.out.MerchantPersistencePort;
import com.company.banking.merchant.domain.Merchant;
import com.company.banking.common.exception.BusinessException;
import com.company.banking.common.exception.ErrorCode;
import com.company.banking.common.exception.ForbiddenException;
import com.company.banking.common.exception.NotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.HexFormat;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class CreateApiKeyService implements CreateApiKeyUseCase {

    private final ApiKeyPersistencePort persistencePort;
    private final AccountPersistencePort accountPersistencePort;
    private final MerchantPersistencePort merchantPersistencePort;
    private final SecureRandom secureRandom = new SecureRandom();

    @Override
    @Transactional
    public ApiKeyResponse createApiKey(Long merchantId, CreateApiKeyRequest request) {
        String env = request.getEnvironment() != null && request.getEnvironment().equalsIgnoreCase("LIVE") ? "LIVE" : "SANDBOX";
        String prefix = env.equals("LIVE") ? "sk_live_" : "sk_test_";

        // 1. Resolve and Verify Authoritative Merchant Identity
        Merchant merchant = merchantPersistencePort.findById(merchantId)
                .orElseThrow(() -> new NotFoundException("Merchant with ID " + merchantId + " not found."));

        // 2. Strict Security Boundary for LIVE Credentials (BSP Open Finance & Merchant Acquiring Invariant)
        if (env.equals("LIVE")) {
            if (!"ACTIVE".equalsIgnoreCase(merchant.getStatus())) {
                throw new BusinessException(ErrorCode.FORBIDDEN, 
                        "LIVE production credentials require an ACTIVE, approved Merchant status. Current status: " + merchant.getStatus());
            }
            // Require non-temporary, verified legal registration number
            String brn = merchant.getBusinessRegistrationNumber();
            if (brn == null || brn.isBlank() || brn.startsWith("DEV-REG-") || brn.startsWith("DEV-")) {
                throw new BusinessException(ErrorCode.FORBIDDEN, 
                        "LIVE production credentials require a verified Business Registration Number (BIR TIN / BRN). Complete merchant onboarding before issuing LIVE credentials.");
            }
        }

        // 3. Granular Scopes Enforcement (Reject ambiguous or non-canonical scopes)
        if (request.getScopes() != null && request.getScopes().contains("API_ACCESS")) {
            throw new BusinessException(ErrorCode.INVALID_REQUEST, 
                    "Non-canonical scope 'API_ACCESS' is prohibited. Specify explicit granular scopes (e.g. accounts:read, payments:write).");
        }

        // 4. Account Scope Boundary Validation
        String resolvedAccount = request.getLinkedAccountId() != null ? request.getLinkedAccountId().trim() : null;
        if ((resolvedAccount == null || resolvedAccount.isEmpty()) && env.equals("LIVE")) {
            if (merchant.getSettlementAccount() != null && !merchant.getSettlementAccount().isBlank()) {
                resolvedAccount = merchant.getSettlementAccount();
            } else if (merchant.getOwnerId() != null) {
                List<Account> ownerAccounts = accountPersistencePort.findByCustomerId(merchant.getOwnerId());
                if (ownerAccounts != null && !ownerAccounts.isEmpty()) {
                    resolvedAccount = ownerAccounts.get(0).getAccountNumber();
                }
            }
            if (resolvedAccount == null || resolvedAccount.isEmpty()) {
                throw new BusinessException(ErrorCode.INVALID_REQUEST, 
                        "LIVE production credentials must be bound to a designated merchant settlement account.");
            }
        }
        final String effectiveLinkedAccount = resolvedAccount;
        Account boundAccount = null;

        if (effectiveLinkedAccount != null && !effectiveLinkedAccount.isEmpty()) {
            boundAccount = accountPersistencePort.findByAccountNumber(effectiveLinkedAccount)
                    .orElseThrow(() -> new NotFoundException("Account '" + effectiveLinkedAccount + "' not found."));

            // Never permit external binding to system GL accounts
            if (boundAccount.getAccountNumber().startsWith("SYS-") || boundAccount.getAccountNumber().startsWith("GL-")) {
                throw new ForbiddenException("Cannot bind external API credentials to internal system General Ledger accounts.");
            }

            boolean authorized = merchantId.equals(boundAccount.getMerchantId());
            if (!authorized && boundAccount.getCustomerId() != null) {
                authorized = boundAccount.getCustomerId().equals(merchant.getOwnerId());
            }
            if (!authorized) {
                throw new ForbiddenException(ErrorCode.ACCOUNT_NOT_AUTHORIZED, "Not authorized to bind API key to account [" + effectiveLinkedAccount + "].");
            }
        }

        // Authoritatively resolve customer identity owning this credential
        Long customerId = merchant.getOwnerId();
        if (customerId == null && boundAccount != null) {
            customerId = boundAccount.getCustomerId();
        }

        // 5. Cryptographic Key Generation (Entropy: 256-bit SecureRandom CSPRNG)
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

        // Application Identity
        String appId = request.getApplicationId() != null && !request.getApplicationId().isBlank()
                ? request.getApplicationId().trim()
                : "app_" + UUID.randomUUID().toString().substring(0, 8);
        String appName = request.getApplicationName() != null && !request.getApplicationName().isBlank()
                ? request.getApplicationName().trim()
                : request.getName();

        // Transaction Limits Defaults
        BigDecimal perTxLimit = request.getPerTransactionLimit() != null 
                ? request.getPerTransactionLimit() 
                : (env.equals("LIVE") ? new BigDecimal("100000.00") : new BigDecimal("50000.00"));
        BigDecimal dailyLimit = request.getDailyLimit() != null 
                ? request.getDailyLimit() 
                : (env.equals("LIVE") ? new BigDecimal("1000000.00") : new BigDecimal("500000.00"));

        ApiKey domain = ApiKey.builder()
                .keyPrefix(prefix)
                .merchantId(merchantId)
                .customerId(customerId)
                .keyHash(keyHash)
                .name(request.getName())
                .environment(env)
                .cidrWhitelist(cidr)
                .scopes(request.getScopes())
                .linkedAccountId(effectiveLinkedAccount)
                .applicationId(appId)
                .applicationName(appName)
                .perTransactionLimit(perTxLimit)
                .dailyLimit(dailyLimit)
                .expiresAt(expiresAt)
                .createdAt(LocalDateTime.now())
                .build();

        ApiKey saved = persistencePort.save(domain);

        return ApiKeyResponse.builder()
                .id(saved.getId())
                .customerId(saved.getCustomerId())
                .merchantId(saved.getMerchantId())
                .name(saved.getName())
                .environment(saved.getEnvironment())
                .keyPrefix(saved.getKeyPrefix())
                .maskedHash(maskedHash)
                .rawKey(rawKey)
                .cidrWhitelist(saved.getCidrWhitelist())
                .scopes(saved.getScopes())
                .linkedAccountId(saved.getLinkedAccountId())
                .applicationId(saved.getApplicationId())
                .applicationName(saved.getApplicationName())
                .perTransactionLimit(saved.getPerTransactionLimit())
                .dailyLimit(saved.getDailyLimit())
                .expiresAt(saved.getExpiresAt())
                .revokedAt(saved.getRevokedAt())
                .lastUsedAt(saved.getLastUsedAt())
                .createdAt(saved.getCreatedAt())
                .build();
    }

    @Override
    @Transactional(readOnly = true)
    public List<ApiKeyResponse> listApiKeys(Long merchantId) {
        return persistencePort.findByMerchantId(merchantId).stream().map(key ->
            ApiKeyResponse.builder()
                    .id(key.getId())
                    .customerId(key.getCustomerId())
                    .merchantId(key.getMerchantId())
                    .name(key.getName())
                    .environment(key.getEnvironment())
                    .keyPrefix(key.getKeyPrefix())
                    .maskedHash("************************" + key.getKeyHash().substring(Math.max(0, key.getKeyHash().length() - 4)))
                    .rawKey(null) // Security: Never expose raw key on listing
                    .cidrWhitelist(key.getCidrWhitelist())
                    .scopes(key.getScopes())
                    .linkedAccountId(key.getLinkedAccountId())
                    .applicationId(key.getApplicationId())
                    .applicationName(key.getApplicationName())
                    .perTransactionLimit(key.getPerTransactionLimit())
                    .dailyLimit(key.getDailyLimit())
                    .expiresAt(key.getExpiresAt())
                    .revokedAt(key.getRevokedAt())
                    .lastUsedAt(key.getLastUsedAt())
                    .createdAt(key.getCreatedAt())
                    .build()
        ).toList();
    }

    @Override
    @Transactional
    public void revokeApiKey(Long merchantId, Long id) {
        ApiKey key = persistencePort.findById(id)
                .orElseThrow(() -> new NotFoundException("API Key not found"));
        if (!key.getMerchantId().equals(merchantId)) {
            throw new ForbiddenException("Not authorized to access this API Key");
        }
        key.setRevokedAt(LocalDateTime.now());
        persistencePort.save(key);
    }

    @Override
    @Transactional
    public ApiKeyResponse rotateApiKey(Long merchantId, Long id) {
        ApiKey oldKey = persistencePort.findById(id)
                .orElseThrow(() -> new NotFoundException("API Key not found"));

        if (!oldKey.getMerchantId().equals(merchantId)) {
            throw new ForbiddenException("Not authorized to access this API Key");
        }

        // Re-verify the user has not lost access to the account since initial creation
        if (oldKey.getLinkedAccountId() != null && !oldKey.getLinkedAccountId().trim().isEmpty()) {
            Account account = accountPersistencePort.findByAccountNumber(oldKey.getLinkedAccountId().trim())
                    .orElseThrow(() -> new NotFoundException("Account '" + oldKey.getLinkedAccountId().trim() + "' not found."));
            
            Merchant merchant = merchantPersistencePort.findById(merchantId).orElse(null);
            boolean authorized = merchantId.equals(account.getMerchantId());
            if (!authorized && account.getCustomerId() != null && merchant != null) {
                authorized = account.getCustomerId().equals(merchant.getOwnerId());
            }
            if (!authorized) {
                throw new ForbiddenException("Not authorized to rotate API key bound to this account");
            }
        }

        // Revoke old key gracefully
        oldKey.setRevokedAt(LocalDateTime.now());
        persistencePort.save(oldKey);

        // Create new rotated key inheriting properties
        CreateApiKeyRequest req = new CreateApiKeyRequest();
        req.setName(oldKey.getName() + " (Rotated)");
        req.setEnvironment(oldKey.getEnvironment());
        req.setCidrWhitelist(oldKey.getCidrWhitelist());
        req.setScopes(oldKey.getScopes());
        req.setLinkedAccountId(oldKey.getLinkedAccountId());
        req.setApplicationId(oldKey.getApplicationId());
        req.setApplicationName(oldKey.getApplicationName());
        req.setPerTransactionLimit(oldKey.getPerTransactionLimit());
        req.setDailyLimit(oldKey.getDailyLimit());

        return createApiKey(merchantId, req);
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
