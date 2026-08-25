package com.company.banking.transaction.api;

import com.company.banking.common.response.ApiResponse;
import com.company.banking.customer.domain.Customer;
import com.company.banking.transaction.application.TransactionAuthorizationService;
import com.company.banking.transaction.domain.AuthorizationAttempt;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/mobile/authorizations")
@RequiredArgsConstructor
public class MobileAuthorizationController {

    private final TransactionAuthorizationService authorizationService;

    @GetMapping("/pending")
    public ResponseEntity<ApiResponse<List<AuthorizationAttempt>>> getPendingAuthorizations(Authentication authentication) {
        Long userId = ((Customer) authentication.getPrincipal()).getId();
        List<AuthorizationAttempt> pending = authorizationService.getPendingMobileAuthorizations(userId);
        return ResponseEntity.ok(ApiResponse.success(pending, "Pending mobile authorizations retrieved", null));
    }

    @PostMapping("/{intentId}/approve")
    public ResponseEntity<ApiResponse<Void>> approveAuthorization(@PathVariable Long intentId, Authentication authentication) {
        Long userId = ((Customer) authentication.getPrincipal()).getId();
        authorizationService.approveMobileAuthorization(intentId, userId);
        return ResponseEntity.ok(ApiResponse.success(null, "Authorization approved via mobile device", null));
    }
}
