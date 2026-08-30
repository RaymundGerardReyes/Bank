package com.company.banking.apigateway.api;

import com.company.banking.apigateway.api.dto.ApiKeyResponse;
import com.company.banking.apigateway.api.dto.CreateApiKeyRequest;
import com.company.banking.apigateway.application.CreateApiKeyService;
import com.company.banking.apigateway.infrastructure.ApiKeyJpaEntity;
import com.company.banking.apigateway.infrastructure.ApiKeyJpaRepository;
import com.company.banking.common.exception.ForbiddenException;
import com.company.banking.common.exception.NotFoundException;
import com.company.banking.common.response.ApiResponse;
import com.company.banking.customer.application.port.out.CustomerPersistencePort;
import com.company.banking.customer.domain.Customer;
import com.company.banking.merchant.domain.Merchant;
import com.company.banking.merchant.infrastructure.MerchantJpaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/apikeys")
@RequiredArgsConstructor
public class ApiKeyController {

    private final ApiKeyJpaRepository apiKeyRepository;
    private final CreateApiKeyService apiKeyService;
    private final CustomerPersistencePort customerPersistencePort;
    private final MerchantJpaRepository merchantRepository;

    private Long resolveCustomerId(Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new ForbiddenException("Authentication is required");
        }
        Object principal = authentication.getPrincipal();
        if (principal instanceof Long) {
            return (Long) principal;
        }
        String name = authentication.getName();
        try {
            return Long.parseLong(name);
        } catch (NumberFormatException e) {
            return customerPersistencePort.findByEmail(name)
                    .map(Customer::getId)
                    .orElseThrow(() -> new ForbiddenException("Authenticated customer not found in database"));
        }
    }

    private List<Merchant> resolveOwnedMerchants(Authentication authentication) {
        Long customerId = resolveCustomerId(authentication);
        List<Merchant> merchants = merchantRepository.findByOwnerId(customerId);
        if (merchants == null || merchants.isEmpty()) {
            throw new NotFoundException("User is not a registered merchant");
        }
        return merchants;
    }

    private boolean isOwnedByCustomer(Long targetMerchantId, List<Merchant> ownedMerchants) {
        return ownedMerchants.stream().anyMatch(m -> m.getId().equals(targetMerchantId));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<java.util.List<ApiKeyResponse>>> getApiKeys(Authentication authentication) {
        List<Merchant> ownedMerchants = resolveOwnedMerchants(authentication);
        
        // Fetch API keys for ALL merchants owned by this customer
        List<Long> merchantIds = ownedMerchants.stream().map(Merchant::getId).toList();
        
        java.util.List<ApiKeyResponse> responses = merchantIds.stream()
                .flatMap(merchantId -> apiKeyRepository.findByMerchantId(merchantId).stream())
                .map(key -> ApiKeyResponse.builder()
                        .id(key.getId())
                        .name(key.getName())
                        .environment(key.getEnvironment())
                        .keyPrefix(key.getKeyPrefix())
                        .maskedHash(key.getKeyHash() != null && key.getKeyHash().length() >= 8 
                                ? key.getKeyHash().substring(0, 8) + "..." : null)
                        .rawKey(null) // Security: never return raw keys on GET
                        .cidrWhitelist(key.getCidrWhitelist())
                        .scopes(key.getScopes() != null && !key.getScopes().isBlank() 
                                ? new java.util.HashSet<>(java.util.Arrays.asList(key.getScopes().split(","))) 
                                : new java.util.HashSet<>())
                        .linkedAccountId(key.getLinkedAccountId())
                        .expiresAt(key.getExpiresAt())
                        .revokedAt(key.getRevokedAt())
                        .lastUsedAt(key.getLastUsedAt())
                        .createdAt(key.getCreatedAt())
                        .build())
                .toList();
        return ResponseEntity.ok(ApiResponse.success(responses, "API Keys retrieved successfully"));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<ApiKeyResponse>> createApiKey(
            @RequestBody CreateApiKeyRequest request,
            Authentication authentication) {
        
        // By default, create the key for the primary (first) merchant workspace
        Merchant primaryMerchant = resolveOwnedMerchants(authentication).get(0);
        
        ApiKeyResponse response = apiKeyService.createApiKey(primaryMerchant.getId(), request);
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.success(response, "API Key created successfully"));
    }

    @PostMapping("/{keyId}/revoke")
    public ResponseEntity<ApiResponse<Void>> revokeApiKey(@PathVariable Long keyId, Authentication authentication) {
        List<Merchant> ownedMerchants = resolveOwnedMerchants(authentication);
        
        ApiKeyJpaEntity key = apiKeyRepository.findById(keyId)
                .orElseThrow(() -> new NotFoundException("API Key not found"));
        
        // Enforce Server-Side Object-Level Authorization
        if (!isOwnedByCustomer(key.getMerchantId(), ownedMerchants)) {
            throw new NotFoundException("API Key not found"); // Prevents revealing existence to attackers
        }
        
        apiKeyService.revokeApiKey(key.getMerchantId(), keyId);
        return ResponseEntity.ok(ApiResponse.success(null, "API Key revoked", null));
    }

    @PostMapping("/{keyId}/rotate")
    public ResponseEntity<ApiResponse<ApiKeyResponse>> rotateApiKey(@PathVariable Long keyId, Authentication authentication) {
        List<Merchant> ownedMerchants = resolveOwnedMerchants(authentication);
        
        ApiKeyJpaEntity key = apiKeyRepository.findById(keyId)
                .orElseThrow(() -> new NotFoundException("API Key not found"));
        
        // Enforce Server-Side Object-Level Authorization
        if (!isOwnedByCustomer(key.getMerchantId(), ownedMerchants)) {
            throw new NotFoundException("API Key not found");
        }
        
        ApiKeyResponse newKey = apiKeyService.rotateApiKey(key.getMerchantId(), keyId);
        return ResponseEntity.ok(ApiResponse.success(newKey, "API Key rotated"));
    }

    @DeleteMapping("/{keyId}")
    public ResponseEntity<Void> deleteApiKey(@PathVariable Long keyId, Authentication authentication) {
        List<Merchant> ownedMerchants = resolveOwnedMerchants(authentication);

        ApiKeyJpaEntity key = apiKeyRepository.findById(keyId)
                .orElseThrow(() -> new NotFoundException("API Key not found"));

        // Enforce Server-Side Object-Level Authorization
        if (!isOwnedByCustomer(key.getMerchantId(), ownedMerchants)) {
            throw new NotFoundException("API Key not found");
        }
        
        apiKeyRepository.delete(key);
        return ResponseEntity.noContent().build();
    }
}
