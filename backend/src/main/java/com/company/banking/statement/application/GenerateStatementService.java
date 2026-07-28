package com.company.banking.statement.application;

import com.company.banking.common.exception.NotFoundException;
import com.company.banking.statement.api.dto.StatementResponse;
import com.company.banking.statement.domain.Statement;
import com.company.banking.statement.application.port.in.StatementUseCase;
import com.company.banking.statement.application.port.out.StatementGeneratorPort;
import com.company.banking.statement.application.port.out.StatementPersistencePort;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class GenerateStatementService implements StatementUseCase {

    private final StatementPersistencePort statementPersistencePort;
    private final StatementGeneratorPort statementGeneratorPort;

    @Transactional
    public StatementResponse generateStatement(String accountNumber, LocalDate startDate, LocalDate endDate) {
        Statement statement = Statement.builder()
                .accountNumber(accountNumber)
                .startDate(startDate)
                .endDate(endDate)
                .pdfStoragePath("/storage/statements/" + accountNumber + "_" + startDate + "_" + endDate + ".pdf")
                .build();

        byte[] pdfBytes = statementGeneratorPort.generatePdf(statement);
        log.info("Generated PDF statement size: {} bytes", pdfBytes.length);

        Statement saved = statementPersistencePort.save(statement);
        return StatementResponse.fromEntity(saved);
    }

    @Transactional(readOnly = true)
    public List<StatementResponse> getAccountStatements(String accountNumber) {
        return statementPersistencePort.findByAccountNumber(accountNumber)
                .stream()
                .map(StatementResponse::fromEntity)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public Statement getStatementById(Long id) {
        return statementPersistencePort.findById(id)
                .orElseThrow(() -> new NotFoundException("Statement not found with id: " + id));
    }
}
