package com.company.banking.reporting.infrastructure;

import com.company.banking.reporting.application.port.out.ReportingPersistencePort;
import com.company.banking.reporting.domain.ReportRequest;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Component;

import java.util.concurrent.CompletableFuture;

@Component
@Slf4j
public class ReportingPersistenceAdapter implements ReportingPersistencePort {

    @Async
    @Override
    public CompletableFuture<String> generateAggregatedReport(ReportRequest request) {
        log.info("Simulating heavy aggregation query for {} report in persistence adapter...", request.getReportType());
        
        try {
            Thread.sleep(2000);
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        }
        
        String reportUrl = "https://s3.aws.com/banking-reports/" + request.getReportType() + "-" + System.currentTimeMillis() + ".csv";
        return CompletableFuture.completedFuture(reportUrl);
    }
}
