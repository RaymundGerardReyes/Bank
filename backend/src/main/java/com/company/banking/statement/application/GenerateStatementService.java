package com.company.banking.statement.application;

import com.company.banking.common.exception.NotFoundException;
import com.company.banking.statement.api.dto.StatementResponse;
import com.company.banking.statement.domain.Statement;
import com.company.banking.statement.infrastructure.StatementJpaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class GenerateStatementService {

    private final StatementJpaRepository statementJpaRepository;

    @Transactional
    public StatementResponse generateStatement(String accountNumber, LocalDate startDate, LocalDate endDate) {
        Statement statement = Statement.builder()
                .accountNumber(accountNumber)
                .startDate(startDate)
                .endDate(endDate)
                .pdfStoragePath("/storage/statements/" + accountNumber + "_" + startDate + "_" + endDate + ".pdf")
                .build();

        Statement saved = statementJpaRepository.save(statement);
        return StatementResponse.fromEntity(saved);
    }

    @Transactional(readOnly = true)
    public List<StatementResponse> getAccountStatements(String accountNumber) {
        return statementJpaRepository.findByAccountNumber(accountNumber)
                .stream()
                .map(StatementResponse::fromEntity)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public Statement getStatementById(Long id) {
        return statementJpaRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Statement not found with id: " + id));
    }
}
