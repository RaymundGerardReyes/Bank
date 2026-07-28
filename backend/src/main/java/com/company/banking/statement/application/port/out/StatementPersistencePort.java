package com.company.banking.statement.application.port.out;

import com.company.banking.statement.domain.Statement;
import java.util.List;
import java.util.Optional;

public interface StatementPersistencePort {
    Statement save(Statement statement);
    List<Statement> findByAccountNumber(String accountNumber);
    Optional<Statement> findById(Long id);
}
