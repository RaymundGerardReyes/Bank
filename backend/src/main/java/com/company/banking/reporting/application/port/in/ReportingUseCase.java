package com.company.banking.reporting.application.port.in;

import com.company.banking.reporting.domain.ReportRequest;
import java.util.concurrent.CompletableFuture;

public interface ReportingUseCase {
    CompletableFuture<String> generate(ReportRequest request);
}
