package com.company.banking.statement.infrastructure;

import com.company.banking.statement.domain.Statement;
import org.springframework.stereotype.Component;

@Component
public class PdfStatementGenerator {

    public byte[] generatePdf(Statement statement) {
        // Mock PDF generation logic
        String content = "Statement for account " + statement.getAccountNumber() + 
                         " from " + statement.getStartDate() + 
                         " to " + statement.getEndDate();
        return content.getBytes();
    }
}
