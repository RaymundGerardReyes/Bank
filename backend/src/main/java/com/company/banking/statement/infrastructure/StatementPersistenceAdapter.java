package com.company.banking.statement.infrastructure;

import com.company.banking.statement.application.port.out.StatementPersistencePort;
import com.company.banking.statement.domain.Statement;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Optional;

@Component
@RequiredArgsConstructor
public class StatementPersistenceAdapter implements StatementPersistencePort {

    private final StatementJpaRepository statementJpaRepository;

    @Override
    public Statement save(Statement statement) {
        return statementJpaRepository.save(statement);
    }

    @Override
    public List<Statement> findByAccountNumber(String accountNumber) {
        return statementJpaRepository.findByAccountNumber(accountNumber);
    }

    @Override
    public Optional<Statement> findById(Long id) {
        return statementJpaRepository.findById(id);
    }
}
