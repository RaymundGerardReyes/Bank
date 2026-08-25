package com.company.banking.transaction.api;

import com.company.banking.common.response.ApiResponse;
import com.company.banking.transaction.api.dto.TransactionResponse;
import com.company.banking.transaction.application.TransactionAuthorizationService;
import com.company.banking.transaction.domain.AuthorizationAttempt;
import com.company.banking.transaction.domain.TransactionIntent;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import com.company.banking.customer.domain.Customer;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import jakarta.servlet.http.HttpServletRequest;
import java.math.BigDecimal;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/transactions/intents")
@RequiredArgsConstructor
public class TransactionIntentController {

    private final TransactionAuthorizationService authorizationService;

    @PostMapping
    public ResponseEntity<ApiResponse<TransactionIntent>> createIntent(@RequestBody TransactionIntent intent, Authentication authentication) {
        Long userId = ((Customer) authentication.getPrincipal()).getId();
        intent.setUserId(userId);
        TransactionIntent created = authorizationService.createIntent(intent, userId);
        return ResponseEntity.ok(ApiResponse.success(created, "Intent created successfully", null));
    }

    @PostMapping("/{intentId}/authorization/options")
    public ResponseEntity<ApiResponse<AuthorizationAttempt>> createAuthOptions(@PathVariable Long intentId, Authentication authentication) {
        Long userId = ((Customer) authentication.getPrincipal()).getId();
        AuthorizationAttempt attempt = authorizationService.createAuthorizationOptions(intentId, userId);
        return ResponseEntity.ok(ApiResponse.success(attempt, "Authorization options generated", null));
    }

    @PostMapping("/{intentId}/authorization/verify")
    public ResponseEntity<ApiResponse<Void>> verifyAuth(
            @PathVariable Long intentId, 
            @RequestBody WebAuthnVerificationRequest request,
            Authentication authentication) {
        
        Long userId = ((Customer) authentication.getPrincipal()).getId();
        authorizationService.verifyAuthorization(intentId, userId, request.getChallenge(), request.getAssertionPayload());
        return ResponseEntity.ok(ApiResponse.success(null, "Authorization verified successfully", null));
    }

    @PostMapping("/{intentId}/authorization/push-request")
    public ResponseEntity<ApiResponse<AuthorizationAttempt>> createPushAuth(
            @PathVariable Long intentId, 
            @RequestBody PushAuthRequest request,
            HttpServletRequest httpRequest,
            Authentication authentication) {
        
        Long userId = ((Customer) authentication.getPrincipal()).getId();
        
        // Extract IP address securely
        String ipAddress = httpRequest.getHeader("X-Forwarded-For");
        if (ipAddress == null || ipAddress.isEmpty()) {
            ipAddress = httpRequest.getRemoteAddr();
        }
        
        AuthorizationAttempt attempt = authorizationService.createPushAuthorization(
                intentId, userId, ipAddress, request.getAmount(), 
                request.getSourceAccount(), request.getDestinationAccount());
        
        return ResponseEntity.ok(ApiResponse.success(attempt, "Push authorization requested", null));
    }

    @GetMapping("/{intentId}/authorization/status")
    public ResponseEntity<ApiResponse<Map<String, String>>> getAuthStatus(
            @PathVariable Long intentId,
            Authentication authentication) {
        
        Long userId = ((Customer) authentication.getPrincipal()).getId();
        String status = authorizationService.getAuthorizationStatus(intentId, userId);
        return ResponseEntity.ok(ApiResponse.success(Map.of("status", status), "Status retrieved", null));
    }

    @PostMapping("/{intentId}/execute")
    public ResponseEntity<ApiResponse<TransactionResponse>> executeIntent(@PathVariable Long intentId, Authentication authentication) {
        Long userId = ((Customer) authentication.getPrincipal()).getId();
        TransactionResponse response = authorizationService.executeIntent(intentId, userId);
        return ResponseEntity.ok(ApiResponse.success(response, "Transaction executed successfully", null));
    }

    @Data
    public static class WebAuthnVerificationRequest {
        private String challenge;
        private String assertionPayload;
    }

    @Data
    public static class PushAuthRequest {
        private BigDecimal amount;
        private String sourceAccount;
        private String destinationAccount;
    }
}
