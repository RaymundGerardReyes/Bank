package com.company.banking.apigateway.api;

import com.company.banking.apigateway.api.dto.ApiKeyResponse;
import com.company.banking.apigateway.api.dto.CreateApiKeyRequest;
import com.company.banking.apigateway.application.port.in.CreateApiKeyUseCase;
import com.company.banking.apigateway.application.port.out.ApiKeyPersistencePort;
import com.company.banking.apigateway.domain.ApiKey;
import com.company.banking.common.exception.ForbiddenException;
import com.company.banking.common.exception.NotFoundException;
import com.company.banking.common.response.ApiResponse;
import com.company.banking.customer.application.port.out.CustomerPersistencePort;
import com.company.banking.customer.domain.Customer;
import com.company.banking.merchant.application.port.out.MerchantPersistencePort;
import com.company.banking.merchant.domain.Merchant;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/apikeys")
@RequiredArgsConstructor
public class ApiKeyController {

    private final ApiKeyPersistencePort apiKeyPersistencePort;
    private final CreateApiKeyUseCase apiKeyUseCase;
    private final CustomerPersistencePort customerPersistencePort;
    private final MerchantPersistencePort merchantPersistencePort;

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
        List<Merchant> merchants = merchantPersistencePort.findByOwnerId(customerId);
        if (merchants == null || merchants.isEmpty()) {
            Customer customer = customerPersistencePort.findById(customerId).orElse(null);
            String ownerName = (customer != null && customer.getFirstName() != null)
                    ? (customer.getFirstName() + " " + customer.getLastName()).trim()
                    : "Developer " + customerId;
            String devCode = "DEV-" + customerId;
            Merchant defaultWorkspace = Merchant.builder()
                    .legalName(ownerName + " Workspace")
                    .merchantCode(devCode)
                    .businessRegistrationNumber("DEV-REG-" + customerId + "-" + System.currentTimeMillis())
                    .ownerId(customerId)
                    .status("ACTIVE")
                    .build();
            defaultWorkspace = merchantPersistencePort.save(defaultWorkspace);
            return List.of(defaultWorkspace);
        }
        return merchants;
    }

    private boolean isOwnedByCustomer(Long targetMerchantId, List<Merchant> ownedMerchants) {
        return ownedMerchants.stream().anyMatch(m -> m.getId().equals(targetMerchantId));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<ApiKeyResponse>>> getApiKeys(Authentication authentication) {
        List<Merchant> ownedMerchants = resolveOwnedMerchants(authentication);
        
        // Fetch API keys for ALL merchants owned by this customer
        List<Long> merchantIds = ownedMerchants.stream().map(Merchant::getId).toList();
        
        List<ApiKeyResponse> responses = merchantIds.stream()
                .flatMap(merchantId -> apiKeyPersistencePort.findByMerchantId(merchantId).stream())
                .map(key -> ApiKeyResponse.builder()
                        .id(key.getId())
                        .name(key.getName())
                        .environment(key.getEnvironment())
                        .keyPrefix(key.getKeyPrefix())
                        .maskedHash(key.getKeyHash() != null && key.getKeyHash().length() >= 8 
                                ? key.getKeyHash().substring(0, 8) + "..." : null)
                        .rawKey(null) // Security: never return raw keys on GET
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
                        .build())
                .toList();
        return ResponseEntity.ok(ApiResponse.success(responses, "API Keys retrieved successfully"));
    }

    @GetMapping("/merchant-status")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getMerchantStatus(Authentication authentication) {
        Long customerId = resolveCustomerId(authentication);
        List<Merchant> merchants = merchantPersistencePort.findByOwnerId(customerId);

        // Find primary verified merchant or default
        Merchant primary = (merchants != null && !merchants.isEmpty()) ? merchants.get(0) : null;
        boolean hasVerifiedMerchant = primary != null 
                && "ACTIVE".equalsIgnoreCase(primary.getStatus())
                && primary.getBusinessRegistrationNumber() != null
                && !primary.getBusinessRegistrationNumber().startsWith("DEV-REG-")
                && !primary.getBusinessRegistrationNumber().startsWith("DEV-");

        Map<String, Object> statusMap = Map.of(
                "hasMerchant", primary != null,
                "isVerified", hasVerifiedMerchant,
                "merchantId", primary != null ? primary.getId() : 0,
                "legalName", primary != null ? primary.getLegalName() : "",
                "businessRegistrationNumber", (primary != null && primary.getBusinessRegistrationNumber() != null) ? primary.getBusinessRegistrationNumber() : "",
                "settlementAccount", (primary != null && primary.getSettlementAccount() != null) ? primary.getSettlementAccount() : "",
                "status", primary != null ? primary.getStatus() : "NOT_REGISTERED"
        );
        return ResponseEntity.ok(ApiResponse.success(statusMap, "Merchant status resolved"));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<ApiKeyResponse>> createApiKey(
            @RequestBody CreateApiKeyRequest request,
            Authentication authentication) {
        
        // By default, create the key for the primary (first) merchant workspace
        Merchant primaryMerchant = resolveOwnedMerchants(authentication).get(0);
        
        ApiKeyResponse response = apiKeyUseCase.createApiKey(primaryMerchant.getId(), request);
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.success(response, "API Key created successfully"));
    }

    @PostMapping("/{keyId}/revoke")
    public ResponseEntity<ApiResponse<Void>> revokeApiKey(@PathVariable Long keyId, Authentication authentication) {
        List<Merchant> ownedMerchants = resolveOwnedMerchants(authentication);
        
        ApiKey key = apiKeyPersistencePort.findById(keyId)
                .orElseThrow(() -> new NotFoundException("API Key not found"));
        
        // Enforce Server-Side Object-Level Authorization
        if (!isOwnedByCustomer(key.getMerchantId(), ownedMerchants)) {
            throw new NotFoundException("API Key not found"); // Prevents revealing existence to attackers
        }
        
        apiKeyUseCase.revokeApiKey(key.getMerchantId(), keyId);
        return ResponseEntity.ok(ApiResponse.success(null, "API Key revoked", null));
    }

    @PostMapping("/{keyId}/rotate")
    public ResponseEntity<ApiResponse<ApiKeyResponse>> rotateApiKey(@PathVariable Long keyId, Authentication authentication) {
        List<Merchant> ownedMerchants = resolveOwnedMerchants(authentication);
        
        ApiKey key = apiKeyPersistencePort.findById(keyId)
                .orElseThrow(() -> new NotFoundException("API Key not found"));
        
        // Enforce Server-Side Object-Level Authorization
        if (!isOwnedByCustomer(key.getMerchantId(), ownedMerchants)) {
            throw new NotFoundException("API Key not found");
        }
        
        ApiKeyResponse newKey = apiKeyUseCase.rotateApiKey(key.getMerchantId(), keyId);
        return ResponseEntity.ok(ApiResponse.success(newKey, "API Key rotated"));
    }

    @DeleteMapping("/{keyId}")
    public ResponseEntity<Void> deleteApiKey(@PathVariable Long keyId, Authentication authentication) {
        List<Merchant> ownedMerchants = resolveOwnedMerchants(authentication);

        ApiKey key = apiKeyPersistencePort.findById(keyId)
                .orElseThrow(() -> new NotFoundException("API Key not found"));

        // Enforce Server-Side Object-Level Authorization
        if (!isOwnedByCustomer(key.getMerchantId(), ownedMerchants)) {
            throw new NotFoundException("API Key not found");
        }
        
        apiKeyPersistencePort.deleteById(keyId);
        return ResponseEntity.noContent().build();
    }
}
