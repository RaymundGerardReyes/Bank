package com.company.banking.transaction.api;

import com.company.banking.common.response.ApiResponse;
import com.company.banking.common.response.PagedResponse;
import com.company.banking.transaction.api.dto.DepositRequest;
import com.company.banking.transaction.api.dto.ExternalPaymentRequest;
import com.company.banking.transaction.api.dto.TransactionResponse;
import com.company.banking.transaction.api.dto.WithdrawRequest;
import com.company.banking.transaction.application.DepositService;
import com.company.banking.transaction.application.ExternalPaymentService;
import com.company.banking.transaction.application.GetTransactionHistoryService;
import com.company.banking.transaction.application.WithdrawService;
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

    private final DepositService depositService;
    private final WithdrawService withdrawService;
    private final ExternalPaymentService externalPaymentService;
    private final GetTransactionHistoryService getTransactionHistoryService;

    @PostMapping("/deposit")
    public ResponseEntity<ApiResponse<TransactionResponse>> deposit(@Valid @RequestBody DepositRequest request) {
        String correlationId = MDC.get(CorrelationIdFilter.MDC_KEY);
        TransactionResponse response = depositService.deposit(request);
        return ResponseEntity.ok(ApiResponse.success(response, "Deposit processed successfully", correlationId));
    }

    @PostMapping("/withdraw")
    public ResponseEntity<ApiResponse<TransactionResponse>> withdraw(@Valid @RequestBody WithdrawRequest request) {
        String correlationId = MDC.get(CorrelationIdFilter.MDC_KEY);
        TransactionResponse response = withdrawService.withdraw(request);
        return ResponseEntity.ok(ApiResponse.success(response, "Withdrawal processed successfully", correlationId));
    }

    @PostMapping("/external-payment")
    public ResponseEntity<ApiResponse<TransactionResponse>> externalPayment(@Valid @RequestBody ExternalPaymentRequest request) {
        String correlationId = MDC.get(CorrelationIdFilter.MDC_KEY);
        TransactionResponse response = externalPaymentService.processPayment(request);
        return ResponseEntity.ok(ApiResponse.success(response, "External payment processed successfully", correlationId));
    }

    @GetMapping("/history/{accountNumber}")
    public ResponseEntity<ApiResponse<PagedResponse<TransactionResponse>>> getHistory(
            @PathVariable String accountNumber,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        String correlationId = MDC.get(CorrelationIdFilter.MDC_KEY);
        PagedResponse<TransactionResponse> response = getTransactionHistoryService.getHistory(accountNumber, page, size);
        return ResponseEntity.ok(ApiResponse.success(response, correlationId));
    }
}
