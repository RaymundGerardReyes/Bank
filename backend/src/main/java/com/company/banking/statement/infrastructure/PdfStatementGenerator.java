package com.company.banking.statement.infrastructure;

import com.company.banking.statement.application.port.out.StatementGeneratorPort;
import com.company.banking.statement.domain.Statement;
import org.springframework.stereotype.Component;

@Component
public class PdfStatementGenerator implements StatementGeneratorPort {

    @Override
    public byte[] generatePdf(Statement statement) {
        // Mock PDF generation logic
        String content = "Statement for account " + statement.getAccountNumber() + 
                         " from " + statement.getStartDate() + 
                         " to " + statement.getEndDate();
        return content.getBytes();
    }
}
