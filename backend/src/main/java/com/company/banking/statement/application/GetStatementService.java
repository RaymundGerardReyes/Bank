package com.company.banking.statement.application;

import com.company.banking.common.exception.NotFoundException;
import com.company.banking.statement.domain.Statement;
import com.company.banking.statement.infrastructure.StatementJpaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class GetStatementService {

    private final StatementJpaRepository statementJpaRepository;

    @Transactional(readOnly = true)
    public Statement getStatement(Long id) {
        return statementJpaRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Statement not found"));
    }
}
