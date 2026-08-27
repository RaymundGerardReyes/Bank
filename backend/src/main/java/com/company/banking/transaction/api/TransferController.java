package com.company.banking.transaction.api;

import com.company.banking.common.response.ApiResponse;
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

    @PostMapping({"/internal", "/internal/"})
    public ResponseEntity<ApiResponse<TransactionResponse>> transferInternal(@Valid @RequestBody InternalTransferRequest request) {
        String correlationId = MDC.get(CorrelationIdFilter.MDC_KEY);
        TransactionResponse response = transactionUseCase.processInternalTransfer(request);
        return ResponseEntity.ok(ApiResponse.success(response, "Transfer completed successfully", correlationId));
    }
}
