package com.company.banking.statement.api;

import com.company.banking.account.application.port.out.AccountPersistencePort;
import com.company.banking.account.domain.Account;
import com.company.banking.common.exception.ForbiddenException;
import com.company.banking.common.exception.NotFoundException;
import com.company.banking.common.response.ApiResponse;
import com.company.banking.customer.application.port.out.CustomerPersistencePort;
import com.company.banking.customer.domain.Customer;
import com.company.banking.statement.api.dto.StatementResponse;
import com.company.banking.statement.application.port.in.StatementUseCase;
import com.company.banking.web.filter.CorrelationIdFilter;
import lombok.RequiredArgsConstructor;
import org.slf4j.MDC;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/v1/statements")
@RequiredArgsConstructor
public class StatementController {

    private final StatementUseCase statementUseCase;
    private final CustomerPersistencePort customerPersistencePort;
    private final AccountPersistencePort accountPersistencePort;

    private void validateAccountOwnership(String accountNumber) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.isAuthenticated()) {
            boolean isPrivileged = authentication.getAuthorities().stream()
                    .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN") 
                            || a.getAuthority().equals("ROLE_TELLER") 
                            || a.getAuthority().equals("ROLE_MERCHANT_API"));
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

    @PostMapping("/generate")
    public ResponseEntity<ApiResponse<StatementResponse>> generateStatement(
            @RequestParam String accountNumber,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        
        validateAccountOwnership(accountNumber);
        String correlationId = MDC.get(CorrelationIdFilter.MDC_KEY);
        StatementResponse response = statementUseCase.generateStatement(accountNumber, startDate, endDate);
        return ResponseEntity.ok(ApiResponse.success(response, "Statement generated successfully", correlationId));
    }

    @GetMapping("/account/{accountNumber}")
    public ResponseEntity<ApiResponse<List<StatementResponse>>> getAccountStatements(@PathVariable String accountNumber) {
        validateAccountOwnership(accountNumber);
        String correlationId = MDC.get(CorrelationIdFilter.MDC_KEY);
        List<StatementResponse> response = statementUseCase.getAccountStatements(accountNumber);
        return ResponseEntity.ok(ApiResponse.success(response, correlationId));
    }
}
