package com.company.banking.reporting.application.port.out;

import com.company.banking.reporting.domain.ReportRequest;
import java.util.concurrent.CompletableFuture;

public interface ReportingPersistencePort {
    CompletableFuture<String> generateAggregatedReport(ReportRequest request);
}
