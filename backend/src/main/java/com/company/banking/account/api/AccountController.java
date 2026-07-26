package com.company.banking.account.api;

import com.company.banking.account.api.dto.AccountResponse;
import com.company.banking.account.api.dto.OpenAccountRequest;
import com.company.banking.account.application.port.in.AccountUseCase;
import com.company.banking.common.response.ApiResponse;
import com.company.banking.web.filter.CorrelationIdFilter;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.slf4j.MDC;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/accounts")
@RequiredArgsConstructor
public class AccountController {

    private final AccountUseCase accountUseCase;

    @PostMapping
    public ResponseEntity<ApiResponse<AccountResponse>> openAccount(@Valid @RequestBody OpenAccountRequest request) {
        String correlationId = MDC.get(CorrelationIdFilter.MDC_KEY);
        AccountResponse response = accountUseCase.openAccount(request);
        return new ResponseEntity<>(ApiResponse.success(response, "Account opened successfully", correlationId), HttpStatus.CREATED);
    }

    @GetMapping("/{accountNumber}")
    public ResponseEntity<ApiResponse<AccountResponse>> getAccountDetails(@PathVariable String accountNumber) {
        String correlationId = MDC.get(CorrelationIdFilter.MDC_KEY);
        AccountResponse response = accountUseCase.getAccountDetails(accountNumber);
        return ResponseEntity.ok(ApiResponse.success(response, correlationId));
    }

    @GetMapping("/customer/{customerId}")
    public ResponseEntity<ApiResponse<List<AccountResponse>>> listCustomerAccounts(@PathVariable Long customerId) {
        String correlationId = MDC.get(CorrelationIdFilter.MDC_KEY);
        List<AccountResponse> response = accountUseCase.listCustomerAccounts(customerId);
        return ResponseEntity.ok(ApiResponse.success(response, correlationId));
    }
}
