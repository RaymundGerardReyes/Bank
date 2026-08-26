package com.company.banking.statement;

import com.company.banking.account.application.port.out.AccountPersistencePort;
import com.company.banking.account.domain.Account;
import com.company.banking.common.enums.AccountStatus;
import com.company.banking.config.BaseIntegrationTest;
import com.company.banking.statement.api.dto.StatementResponse;
import com.company.banking.statement.application.GenerateStatementService;
import com.company.banking.statement.application.port.out.StatementGeneratorPort;
import com.company.banking.statement.infrastructure.StatementJpaRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.bean.override.mockito.MockitoBean;

import java.math.BigDecimal;
import java.time.LocalDate;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@SpringBootTest
@ActiveProfiles("test")
public class StatementGenerationPathIT extends BaseIntegrationTest {

    @Autowired
    private GenerateStatementService generateStatementService;

    @Autowired
    private StatementJpaRepository statementRepository;

    @Autowired
    private AccountPersistencePort accountPersistencePort;

    @MockitoBean
    private StatementGeneratorPort statementGeneratorPort;

    private Account validAccount;
    private final Long USER_ID = 101L;

    @BeforeEach
    public void setup() {
        statementRepository.deleteAll();

        validAccount = accountPersistencePort.findByAccountNumber("STMT-ACC-1001")
            .orElseGet(() -> accountPersistencePort.save(Account.builder()
                .accountNumber("STMT-ACC-1001")
                .customerId(USER_ID)
                .balance(new BigDecimal("1500.00"))
                .currency("PHP")
                .status(AccountStatus.ACTIVE)
                .build()));
    }

    @Test
    @DisplayName("P01: Valid request successfully generates and persists a statement")
    public void p01_ValidStatementRequest_ShouldGenerateAndPersist() {
        LocalDate startDate = LocalDate.now().minusDays(30);
        LocalDate endDate = LocalDate.now();
        byte[] mockPdfBytes = "%PDF-1.4 Mock Document".getBytes();

        when(statementGeneratorPort.generatePdf(any())).thenReturn(mockPdfBytes);

        StatementResponse statement = generateStatementService.generateStatement(
            validAccount.getAccountNumber(), 
            startDate, 
            endDate
        );

        assertNotNull(statement.getId(), "Statement must be persisted to the database");
        assertEquals(validAccount.getAccountNumber(), statement.getAccountNumber());
        
        verify(statementGeneratorPort, times(1)).generatePdf(any());
    }

    @Test
    @DisplayName("P05: PDF Engine crash gracefully aborts operation without persisting a broken statement")
    public void p05_PdfEngineCrash_ShouldRollbackAndThrow() {
        LocalDate startDate = LocalDate.now().minusDays(30);
        LocalDate endDate = LocalDate.now();

        when(statementGeneratorPort.generatePdf(any()))
            .thenThrow(new RuntimeException("Out of Memory Error during PDF generation"));

        assertThrows(RuntimeException.class, () -> {
            generateStatementService.generateStatement(
                validAccount.getAccountNumber(), 
                startDate, 
                endDate
            );
        });

        assertEquals(0, statementRepository.count(), "Statement persistence must rollback if generation fails");
    }
}
