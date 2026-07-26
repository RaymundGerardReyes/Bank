package com.company.banking.reporting.api;

import com.company.banking.common.response.ApiResponse;
import com.company.banking.reporting.application.GenerateMonthlyReportService;
import com.company.banking.reporting.domain.ReportRequest;
import com.company.banking.web.filter.CorrelationIdFilter;
import lombok.RequiredArgsConstructor;
import org.slf4j.MDC;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.concurrent.CompletableFuture;

@RestController
@RequestMapping("/api/v1/reporting")
@RequiredArgsConstructor
public class ReportingController {

    private final GenerateMonthlyReportService generateMonthlyReportService;

    @PostMapping("/generate")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<String>> generateReport(@RequestBody ReportRequest request) {
        String correlationId = MDC.get(CorrelationIdFilter.MDC_KEY);
        
        // Fire and forget for async report generation
        CompletableFuture<String> futureReport = generateMonthlyReportService.generate(request);
        
        return ResponseEntity.accepted().body(
            ApiResponse.success("Report generation triggered asynchronously", "Report requested", correlationId)
        );
    }
}
