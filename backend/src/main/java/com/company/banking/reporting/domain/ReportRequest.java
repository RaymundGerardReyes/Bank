package com.company.banking.reporting.domain;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDate;

@Data
@Builder
public class ReportRequest {
    private String reportType;
    private LocalDate startDate;
    private LocalDate endDate;
    private String format;
}
