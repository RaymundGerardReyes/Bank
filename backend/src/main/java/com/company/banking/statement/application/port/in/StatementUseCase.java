package com.company.banking.statement.application.port.in;

import com.company.banking.statement.api.dto.StatementResponse;
import com.company.banking.statement.domain.Statement;
import java.time.LocalDate;
import java.util.List;

public interface StatementUseCase {
    StatementResponse generateStatement(String accountNumber, LocalDate startDate, LocalDate endDate);
    List<StatementResponse> getAccountStatements(String accountNumber);
    Statement getStatementById(Long id);
}
