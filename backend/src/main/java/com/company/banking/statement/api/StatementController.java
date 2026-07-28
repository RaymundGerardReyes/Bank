package com.company.banking.statement.api;

import com.company.banking.common.response.ApiResponse;
import com.company.banking.statement.api.dto.StatementResponse;
import com.company.banking.statement.application.port.in.StatementUseCase;
import com.company.banking.web.filter.CorrelationIdFilter;
import lombok.RequiredArgsConstructor;
import org.slf4j.MDC;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/v1/statements")
@RequiredArgsConstructor
public class StatementController {

    private final StatementUseCase statementUseCase;

    @PostMapping("/generate")
    public ResponseEntity<ApiResponse<StatementResponse>> generateStatement(
            @RequestParam String accountNumber,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        
        String correlationId = MDC.get(CorrelationIdFilter.MDC_KEY);
        StatementResponse response = statementUseCase.generateStatement(accountNumber, startDate, endDate);
        return ResponseEntity.ok(ApiResponse.success(response, "Statement generated successfully", correlationId));
    }

    @GetMapping("/account/{accountNumber}")
    public ResponseEntity<ApiResponse<List<StatementResponse>>> getAccountStatements(@PathVariable String accountNumber) {
        String correlationId = MDC.get(CorrelationIdFilter.MDC_KEY);
        List<StatementResponse> response = statementUseCase.getAccountStatements(accountNumber);
        return ResponseEntity.ok(ApiResponse.success(response, correlationId));
    }
}
