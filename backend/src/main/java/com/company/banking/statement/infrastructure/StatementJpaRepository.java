package com.company.banking.statement.infrastructure;

import com.company.banking.statement.domain.Statement;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface StatementJpaRepository extends JpaRepository<Statement, Long> {
    List<Statement> findByAccountNumber(String accountNumber);
}
