package com.company.banking.apigateway.api;

import com.company.banking.apigateway.application.WebhookManagementService;
import com.company.banking.apigateway.domain.WebhookEndpoint;
import com.company.banking.apigateway.infrastructure.WebhookEndpointJpaRepository;
import com.company.banking.common.exception.ForbiddenException;
import com.company.banking.common.exception.NotFoundException;
import com.company.banking.common.response.ApiResponse;
import com.company.banking.customer.application.port.out.CustomerPersistencePort;
import com.company.banking.customer.domain.Customer;
import com.company.banking.merchant.domain.Merchant;
import com.company.banking.merchant.infrastructure.MerchantJpaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/webhooks")
@RequiredArgsConstructor
public class WebhookController {

    private final WebhookEndpointJpaRepository webhookRepository;
    private final WebhookManagementService webhookService;
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
    public ResponseEntity<ApiResponse<java.util.List<Map<String, Object>>>> getWebhooks(Authentication authentication) {
        List<Merchant> ownedMerchants = resolveOwnedMerchants(authentication);
        List<Long> merchantIds = ownedMerchants.stream().map(Merchant::getId).toList();

        java.util.List<Map<String, Object>> webhooks = merchantIds.stream()
                .flatMap(merchantId -> webhookRepository.findByMerchantId(merchantId).stream())
                .map(wh -> {
                    Map<String, Object> map = new java.util.HashMap<>();
                    map.put("id", wh.getId());
                    map.put("url", wh.getUrl());
                    map.put("environment", wh.getEnvironment());
                    map.put("status", wh.getStatus());
                    map.put("events", wh.getEvents());
                    map.put("createdAt", wh.getCreatedAt());
                    map.put("updatedAt", wh.getUpdatedAt());
                    return map;
                })
                .toList();
        return ResponseEntity.ok(ApiResponse.success(webhooks, "Webhooks retrieved successfully"));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<Map<String, Object>>> createWebhook(@RequestBody Map<String, String> request, Authentication authentication) {
        Merchant primaryMerchant = resolveOwnedMerchants(authentication).get(0);
        WebhookEndpoint endpoint = webhookService.createEndpoint(primaryMerchant.getId(), request.get("url"), request.get("environment"), request.get("events"));
        return ResponseEntity.ok(ApiResponse.success(Map.of("id", endpoint.getId()), "Webhook registered successfully"));
    }

    @DeleteMapping("/{webhookId}")
    public ResponseEntity<ApiResponse<Void>> deleteWebhook(@PathVariable Long webhookId, Authentication authentication) {
        List<Merchant> ownedMerchants = resolveOwnedMerchants(authentication);

        WebhookEndpoint endpoint = webhookRepository.findById(webhookId)
                .orElseThrow(() -> new NotFoundException("Webhook not found"));

        if (!isOwnedByCustomer(endpoint.getMerchantId(), ownedMerchants)) {
            throw new NotFoundException("Webhook not found");
        }
        
        webhookRepository.delete(endpoint);
        return ResponseEntity.ok(ApiResponse.success(null, "Webhook deleted successfully", null));
    }
}
