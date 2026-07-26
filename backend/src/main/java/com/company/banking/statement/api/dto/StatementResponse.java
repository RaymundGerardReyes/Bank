package com.company.banking.statement.api.dto;

import com.company.banking.statement.domain.Statement;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Builder
public class StatementResponse {
    private Long id;
    private String accountNumber;
    private LocalDate startDate;
    private LocalDate endDate;
    private String pdfUrl;
    private LocalDateTime generatedAt;

    public static StatementResponse fromEntity(Statement statement) {
        return StatementResponse.builder()
                .id(statement.getId())
                .accountNumber(statement.getAccountNumber())
                .startDate(statement.getStartDate())
                .endDate(statement.getEndDate())
                .pdfUrl("/api/v1/statements/download/" + statement.getId())
                .generatedAt(statement.getGeneratedAt())
                .build();
    }
}
