package com.company.banking.transaction.api;

import com.company.banking.common.response.ApiResponse;
import com.company.banking.common.response.PagedResponse;
import com.company.banking.transaction.api.dto.DepositRequest;
import com.company.banking.transaction.api.dto.DisputeReasonRequest;
import com.company.banking.transaction.api.dto.ExternalPaymentRequest;
import com.company.banking.transaction.api.dto.ReceiptNotificationRequest;
import com.company.banking.transaction.api.dto.TransactionResponse;
import com.company.banking.transaction.api.dto.WithdrawRequest;
import com.company.banking.transaction.application.DisputeTransactionService;
import com.company.banking.transaction.application.port.in.DepositUseCase;
import com.company.banking.transaction.application.port.in.ExternalPaymentUseCase;
import com.company.banking.transaction.application.GetTransactionHistoryService;
import com.company.banking.transaction.application.port.in.TransactionUseCase;
import com.company.banking.transaction.application.port.in.WithdrawUseCase;
import com.company.banking.notification.application.SendTransactionAlertService;
import com.company.banking.web.filter.CorrelationIdFilter;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.slf4j.MDC;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/transactions")
@RequiredArgsConstructor
public class TransactionController {

    private final DepositUseCase depositUseCase;
    private final WithdrawUseCase withdrawUseCase;
    private final ExternalPaymentUseCase externalPaymentUseCase;
    private final GetTransactionHistoryService getTransactionHistoryService;
    private final TransactionUseCase transactionUseCase;
    private final DisputeTransactionService disputeTransactionService;
    
    // Inject the notification service for SMTP emails
    private final SendTransactionAlertService notificationService;

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

    @GetMapping("/history")
    public ResponseEntity<ApiResponse<PagedResponse<TransactionResponse>>> getTransactionHistory(
            @RequestParam String accountNumber,
            @RequestParam(defaultValue = "ALL") String direction,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        String correlationId = MDC.get(CorrelationIdFilter.MDC_KEY);
        PagedResponse<TransactionResponse> response = getTransactionHistoryService.getHistory(accountNumber, direction, page, size);
        return ResponseEntity.ok(ApiResponse.success(response, correlationId));
    }

    @GetMapping("/trace/{keyPrefix}")
    @PreAuthorize("hasAnyRole('ADMIN', 'TELLER')")
    public ResponseEntity<ApiResponse<TransactionResponse>> getByTraceKey(@PathVariable String keyPrefix) {
        String correlationId = MDC.get(CorrelationIdFilter.MDC_KEY);
        TransactionResponse response = transactionUseCase.getByIdempotencyKey(keyPrefix);
        return ResponseEntity.ok(ApiResponse.success(response, "Transaction retrieved by trace ref", correlationId));
    }

    @PostMapping("/{id}/dispute")
    public ResponseEntity<ApiResponse<TransactionResponse>> disputeTransaction(
            @PathVariable Long id,
            @Valid @RequestBody DisputeReasonRequest request) {
        String correlationId = MDC.get(CorrelationIdFilter.MDC_KEY);
        TransactionResponse response = disputeTransactionService.disputeTransaction(id, request);
        return ResponseEntity.ok(ApiResponse.success(response, "Transaction flagged for dispute", correlationId));
    }

    // ENTERPRISE RECEIPT ENDPOINT
    @PostMapping("/receipt/send")
    public ResponseEntity<ApiResponse<Void>> sendReceiptEmail(@RequestBody ReceiptNotificationRequest request) {
        String correlationId = MDC.get(CorrelationIdFilter.MDC_KEY);
        
        notificationService.sendTransferReceipt(
                request.getSourceEmail(), 
                request.getRecipientEmail(), 
                request.getTransactionReference(), 
                request.getAmount(), 
                request.getDate()
        );
        
        return ResponseEntity.ok(ApiResponse.success(null, "Receipts dispatched via SMTP", correlationId));
    }
}