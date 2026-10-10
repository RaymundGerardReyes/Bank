package com.company.banking.transaction.api;

import com.company.banking.common.response.ApiResponse;
import com.company.banking.transaction.api.dto.ExternalPaymentRequest;
import com.company.banking.transaction.application.port.in.ExternalPaymentUseCase;
import com.company.banking.transaction.api.dto.InternalTransferRequest;
import com.company.banking.transaction.api.dto.TransactionResponse;
import com.company.banking.transaction.application.port.in.TransactionUseCase;
import com.company.banking.web.filter.CorrelationIdFilter;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.slf4j.MDC;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/transfers")
@RequiredArgsConstructor
public class TransferController {

    private final TransactionUseCase transactionUseCase;
    private final ExternalPaymentUseCase externalPaymentUseCase;
    private final com.company.banking.transaction.application.port.in.GetPaymentParticipantsUseCase getPaymentParticipantsUseCase;

    @org.springframework.web.bind.annotation.GetMapping({"/institutions", "/institutions/", "/banks", "/banks/"})
    public ResponseEntity<ApiResponse<java.util.List<com.company.banking.transaction.api.dto.InstitutionResponse>>> getInstitutions(
            @org.springframework.web.bind.annotation.RequestParam(required = false) String rail) {
        String correlationId = MDC.get(CorrelationIdFilter.MDC_KEY);
        java.util.List<com.company.banking.transaction.api.dto.InstitutionResponse> institutions = getPaymentParticipantsUseCase.getActiveInstitutions(rail);
        return ResponseEntity.ok(ApiResponse.success(institutions, "Active financial institutions retrieved successfully", correlationId));
    }

    @PostMapping({"", "/", "/internal", "/internal/"})
    public ResponseEntity<ApiResponse<TransactionResponse>> transferInternal(
            @org.springframework.web.bind.annotation.RequestHeader(value = "Idempotency-Key", required = false) String idempotencyKeyHeader,
            @Valid @RequestBody InternalTransferRequest request) {
        if ((request.getIdempotencyKey() == null || request.getIdempotencyKey().isBlank()) && idempotencyKeyHeader != null && !idempotencyKeyHeader.isBlank()) {
            request.setIdempotencyKey(idempotencyKeyHeader);
        }
        if (request.getIdempotencyKey() == null || request.getIdempotencyKey().isBlank()) {
            request.setIdempotencyKey("idem-auto-" + java.util.UUID.randomUUID());
        }
        String correlationId = MDC.get(CorrelationIdFilter.MDC_KEY);
        TransactionResponse response = transactionUseCase.processInternalTransfer(request);
        return ResponseEntity.ok(ApiResponse.success(response, "Transfer completed successfully", correlationId));
    }

    @PostMapping({"/external", "/external/"})
    public ResponseEntity<ApiResponse<TransactionResponse>> transferExternal(
            @org.springframework.web.bind.annotation.RequestHeader(value = "Idempotency-Key", required = false) String idempotencyKeyHeader,
            @Valid @RequestBody ExternalPaymentRequest request) {
        if ((request.getIdempotencyKey() == null || request.getIdempotencyKey().isBlank()) && idempotencyKeyHeader != null && !idempotencyKeyHeader.isBlank()) {
            request.setIdempotencyKey(idempotencyKeyHeader);
        }
        if (request.getIdempotencyKey() == null || request.getIdempotencyKey().isBlank()) {
            request.setIdempotencyKey("idem-auto-" + java.util.UUID.randomUUID());
        }
        String correlationId = MDC.get(CorrelationIdFilter.MDC_KEY);
        TransactionResponse response = externalPaymentUseCase.processPayment(request);
        return ResponseEntity.ok(ApiResponse.success(response, "External payment initiated successfully", correlationId));
    }

}
