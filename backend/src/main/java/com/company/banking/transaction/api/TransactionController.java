package com.company.banking.transaction.api;

import com.company.banking.common.response.ApiResponse;
import com.company.banking.common.response.PagedResponse;
import com.company.banking.transaction.api.dto.DepositRequest;
import com.company.banking.transaction.api.dto.ExternalPaymentRequest;
import com.company.banking.transaction.api.dto.TransactionResponse;
import com.company.banking.transaction.api.dto.WithdrawRequest;
import com.company.banking.transaction.application.port.in.DepositUseCase;
import com.company.banking.transaction.application.port.in.ExternalPaymentUseCase;
import com.company.banking.transaction.application.port.in.GetTransactionHistoryUseCase;
import com.company.banking.transaction.application.port.in.WithdrawUseCase;
import com.company.banking.web.filter.CorrelationIdFilter;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.slf4j.MDC;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/transactions")
@RequiredArgsConstructor
public class TransactionController {

    private final DepositUseCase depositUseCase;
    private final WithdrawUseCase withdrawUseCase;
    private final ExternalPaymentUseCase externalPaymentUseCase;
    private final GetTransactionHistoryUseCase getTransactionHistoryUseCase;

    @PostMapping("/deposit")
    public ResponseEntity<ApiResponse<TransactionResponse>> deposit(@Valid @RequestBody DepositRequest request) {
        String correlationId = MDC.get(CorrelationIdFilter.MDC_KEY);
        TransactionResponse response = depositUseCase.deposit(request);
        return ResponseEntity.ok(ApiResponse.success(response, "Deposit processed successfully", correlationId));
    }

    @PostMapping("/withdraw")
    public ResponseEntity<ApiResponse<TransactionResponse>> withdraw(@Valid @RequestBody WithdrawRequest request) {
        String correlationId = MDC.get(CorrelationIdFilter.MDC_KEY);
        TransactionResponse response = withdrawUseCase.withdraw(request);
        return ResponseEntity.ok(ApiResponse.success(response, "Withdrawal processed successfully", correlationId));
    }

    @PostMapping("/external-payment")
    public ResponseEntity<ApiResponse<TransactionResponse>> externalPayment(@Valid @RequestBody ExternalPaymentRequest request) {
        String correlationId = MDC.get(CorrelationIdFilter.MDC_KEY);
        TransactionResponse response = externalPaymentUseCase.processPayment(request);
        return ResponseEntity.ok(ApiResponse.success(response, "External payment processed successfully", correlationId));
    }

    @GetMapping("/history/{accountNumber}")
    public ResponseEntity<ApiResponse<PagedResponse<TransactionResponse>>> getHistory(
            @PathVariable String accountNumber,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        String correlationId = MDC.get(CorrelationIdFilter.MDC_KEY);
        PagedResponse<TransactionResponse> response = getTransactionHistoryUseCase.getHistory(accountNumber, page, size);
        return ResponseEntity.ok(ApiResponse.success(response, correlationId));
    }
}
