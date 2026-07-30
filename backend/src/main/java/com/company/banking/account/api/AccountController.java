package com.company.banking.account.api;

import com.company.banking.account.api.dto.AccountResponse;
import com.company.banking.account.api.dto.AccountSummaryResponse;
import com.company.banking.account.application.port.in.OpenAccountUseCase;
import com.company.banking.account.api.dto.OpenAccountRequest;
import jakarta.validation.Valid;
import com.company.banking.account.application.port.in.GetAccountDetailsUseCase;
import com.company.banking.account.application.port.in.ListCustomerAccountsUseCase;
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
    
    // Inject the customer port so we can resolve the JWT email to a Customer ID
    private final CustomerPersistencePort customerPersistencePort;

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
}