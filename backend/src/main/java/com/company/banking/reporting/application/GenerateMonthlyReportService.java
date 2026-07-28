package com.company.banking.reporting.application;

import com.company.banking.reporting.domain.ReportRequest;
import com.company.banking.reporting.application.port.in.ReportingUseCase;
import com.company.banking.reporting.application.port.out.ReportingPersistencePort;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.concurrent.CompletableFuture;

@Service
@Slf4j
@RequiredArgsConstructor
public class GenerateMonthlyReportService implements ReportingUseCase {

    private final ReportingPersistencePort reportingPersistencePort;

    public CompletableFuture<String> generate(ReportRequest request) {
        log.info("Starting asynchronous generation of {} report from {} to {}", 
                 request.getReportType(), request.getStartDate(), request.getEndDate());
                 
        return reportingPersistencePort.generateAggregatedReport(request).thenApply(reportUrl -> {
            log.info("Report generation complete: {}", reportUrl);
            return reportUrl;
        });
    }
}
