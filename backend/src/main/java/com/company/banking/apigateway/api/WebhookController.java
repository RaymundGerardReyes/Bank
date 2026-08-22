package com.company.banking.apigateway.api;

import com.company.banking.apigateway.application.WebhookManagementService;
import com.company.banking.apigateway.domain.WebhookEndpoint;
import com.company.banking.common.response.ApiResponse;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.slf4j.MDC;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import org.springframework.security.core.context.SecurityContextHolder;
import com.company.banking.customer.domain.Customer;

import java.util.List;

@RestController
@RequestMapping("/api/v1/webhooks")
@RequiredArgsConstructor
public class WebhookController {

    private final WebhookManagementService webhookManagementService;

    @PostMapping
    public ResponseEntity<ApiResponse<WebhookEndpoint>> createEndpoint(
            @RequestBody CreateWebhookRequest request) {
            
        Long merchantId = extractMerchantIdFromContext();
        
        WebhookEndpoint endpoint = webhookManagementService.createEndpoint(
                merchantId, request.getUrl(), request.getEnvironment(), request.getEvents()
        );
        
        return ResponseEntity.ok(ApiResponse.success(endpoint, "Webhook created successfully", MDC.get("correlationId")));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<WebhookEndpoint>>> getEndpoints() {
            
        Long merchantId = extractMerchantIdFromContext();
        List<WebhookEndpoint> endpoints = webhookManagementService.getEndpoints(merchantId);
        
        // Hide the secret hash in standard list views to prevent exposure
        endpoints.forEach(e -> e.setSecretHash("REDACTED"));
        
        return ResponseEntity.ok(ApiResponse.success(endpoints, "Webhooks retrieved successfully", MDC.get("correlationId")));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteEndpoint(
            @PathVariable Long id) {
            
        Long merchantId = extractMerchantIdFromContext();
        webhookManagementService.deleteEndpoint(merchantId, id);
        
        return ResponseEntity.ok(ApiResponse.success(null, "Webhook deleted successfully", MDC.get("correlationId")));
    }

    private Long extractMerchantIdFromContext() {
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        if (principal instanceof Customer customer) {
            return customer.getId();
        }
        // Fallback or explicit throw depending on architecture
        return 1L;
    }
}

@Data
class CreateWebhookRequest {
    private String url;
    private String environment;
    private String events;
}
