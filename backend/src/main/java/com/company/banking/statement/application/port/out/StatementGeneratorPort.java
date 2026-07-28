package com.company.banking.statement.application.port.out;

import com.company.banking.statement.domain.Statement;

public interface StatementGeneratorPort {
    byte[] generatePdf(Statement statement);
}
