package com.company.banking.account.api;

import com.company.banking.account.api.dto.AccountResponse;
import com.company.banking.account.api.dto.AccountSummaryResponse;
import com.company.banking.account.application.port.in.OpenAccountUseCase;
import com.company.banking.account.api.dto.OpenAccountRequest;
import jakarta.validation.Valid;
import com.company.banking.account.application.port.in.GetAccountDetailsUseCase;
import com.company.banking.account.application.port.in.ListCustomerAccountsUseCase;
import com.company.banking.account.application.port.out.AccountPersistencePort;
import com.company.banking.account.domain.Account;
import com.company.banking.common.exception.ForbiddenException;
import com.company.banking.common.exception.NotFoundException;
import com.company.banking.common.response.ApiResponse;
import com.company.banking.customer.application.port.out.CustomerPersistencePort;
import com.company.banking.customer.domain.Customer;
import com.company.banking.web.filter.CorrelationIdFilter;

import lombok.RequiredArgsConstructor;
import org.slf4j.MDC;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/accounts")
@RequiredArgsConstructor
public class AccountController {

    private final ListCustomerAccountsUseCase listCustomerAccountsUseCase;
    private final GetAccountDetailsUseCase getAccountDetailsUseCase;
    private final OpenAccountUseCase openAccountUseCase;
    private final com.company.banking.account.application.port.in.UpdateAccountSettingsUseCase updateAccountSettingsUseCase;
    
    // Inject the customer port so we can resolve the JWT email to a Customer ID
    private final CustomerPersistencePort customerPersistencePort;
    private final AccountPersistencePort accountPersistencePort;

    @GetMapping
    public ResponseEntity<ApiResponse<List<AccountSummaryResponse>>> getCustomerAccounts() {
        String correlationId = MDC.get(CorrelationIdFilter.MDC_KEY);
        
        // 1. Extract the currently authenticated user's email directly from the JWT Security Context
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();
        
        // 2. Look up the secure Customer ID from the database
        Customer customer = customerPersistencePort.findByEmail(email)
                .orElseThrow(() -> new NotFoundException("Authenticated user profile not found"));
                
        // 3. Fetch the live accounts strictly linked to this customer
        List<AccountSummaryResponse> accounts = listCustomerAccountsUseCase.listAccounts(customer.getId());
        
        return ResponseEntity.ok(ApiResponse.success(accounts, "Accounts retrieved successfully", correlationId));
    }

    @GetMapping("/{accountNumber}")
    public ResponseEntity<ApiResponse<AccountResponse>> getAccountDetails(@PathVariable String accountNumber) {
        String correlationId = MDC.get(CorrelationIdFilter.MDC_KEY);

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.isAuthenticated()) {
            if (authentication instanceof com.company.banking.apigateway.security.ApiKeyAuthenticationToken apiToken) {
                if (!apiToken.canAccessAccount(accountNumber)) {
                    throw new ForbiddenException(com.company.banking.common.exception.ErrorCode.ACCOUNT_NOT_AUTHORIZED,
                            "API Key Policy: Not authorized to access account [" + accountNumber + "]. Bound account scope: " + apiToken.getLinkedAccountId());
                }
            } else {
                boolean isPrivileged = authentication.getAuthorities().stream()
                        .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN") 
                                || a.getAuthority().equals("ROLE_TELLER"));
                if (!isPrivileged) {
                    String email = authentication.getName();
                    Customer customer = customerPersistencePort.findByEmail(email)
                            .orElseThrow(() -> new NotFoundException("Authenticated user profile not found"));
                    Account account = accountPersistencePort.findByAccountNumber(accountNumber)
                            .orElseThrow(() -> new NotFoundException("Account not found: " + accountNumber));
                    if (!customer.getId().equals(account.getCustomerId())) {
                        throw new ForbiddenException("Access denied: You do not own this account");
                    }
                }
            }
        }

        AccountResponse response = getAccountDetailsUseCase.getAccountDetails(accountNumber);
        return ResponseEntity.ok(ApiResponse.success(response, "Account details retrieved successfully", correlationId));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<AccountResponse>> openAccount(@Valid @RequestBody OpenAccountRequest request) {
        String correlationId = MDC.get(CorrelationIdFilter.MDC_KEY);
        
        // Securely bind the new account to the authenticated user's ID
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();
        Customer customer = customerPersistencePort.findByEmail(email)
                .orElseThrow(() -> new NotFoundException("Authenticated user profile not found"));
                
        request.setCustomerId(customer.getId());
        
        AccountResponse response = openAccountUseCase.openAccount(request);
        return ResponseEntity.ok(ApiResponse.success(response, "Virtual Account provisioned successfully", correlationId));
    }

    @PatchMapping("/{accountNumber}/settings")
    public ResponseEntity<ApiResponse<AccountResponse>> updateSettings(
            @PathVariable String accountNumber,
            @Valid @RequestBody com.company.banking.account.api.dto.UpdateAccountSettingsRequest request) {
        String correlationId = MDC.get(CorrelationIdFilter.MDC_KEY);

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();
        Customer customer = customerPersistencePort.findByEmail(email)
                .orElseThrow(() -> new NotFoundException("Authenticated user profile not found"));

        AccountResponse response = updateAccountSettingsUseCase.updateSettings(accountNumber, request, customer.getId());
        return ResponseEntity.ok(ApiResponse.success(response, "Account settings updated safely", correlationId));
    }
}