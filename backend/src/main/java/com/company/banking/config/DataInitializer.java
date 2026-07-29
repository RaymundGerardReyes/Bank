package com.company.banking.config;

import com.company.banking.account.domain.Account;
import com.company.banking.account.infrastructure.AccountJpaRepository;
import com.company.banking.common.enums.AccountStatus;
import com.company.banking.common.enums.RoleType;
import com.company.banking.customer.domain.Customer;
import com.company.banking.customer.infrastructure.CustomerJpaRepository;
import com.company.banking.transaction.application.port.out.LedgerPersistencePort;
import com.company.banking.transaction.domain.Transaction;
import com.company.banking.transaction.domain.TransactionStatus;
import com.company.banking.statement.application.port.out.StatementPersistencePort;
import com.company.banking.statement.domain.Statement;
import com.company.banking.admin.application.port.out.AuditLogPersistencePort;
import com.company.banking.common.audit.AuditLogRecord;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.UUID;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataInitializer implements CommandLineRunner {

    private final CustomerJpaRepository customerJpaRepository;
    private final AccountJpaRepository accountJpaRepository;
    private final PasswordEncoder passwordEncoder;
    private final LedgerPersistencePort ledgerPersistencePort;
    private final StatementPersistencePort statementPersistencePort;
    private final AuditLogPersistencePort auditLogPersistencePort;

    // Defined standard ISO PANs for seeding
    private final String MOCK_SOURCE_PAN = "4859220013371001";
    private final String MOCK_RECIPIENT_PAN = "4859220013379999";

    @Override
    public void run(String... args) {
        String sourceEmail = "user@example.com";
        String recipientEmail = "recipient@example.com";

        // 1. SEED SOURCE ACCOUNT
        if (customerJpaRepository.findByEmail(sourceEmail).isEmpty()) {
            log.info("Seeding initial Source Customer: {}", sourceEmail);
            Customer sourceCustomer = Customer.builder()
                    .email(sourceEmail)
                    .password(passwordEncoder.encode("Password123!"))
                    .firstName("Raymund")
                    .lastName("Reyes")
                    .role(RoleType.CUSTOMER)
                    .build();
            Customer savedSource = customerJpaRepository.save(sourceCustomer);

            Account sourceAccount = Account.builder()
                    .accountNumber(MOCK_SOURCE_PAN)
                    .customerId(savedSource.getId())
                    .balance(new BigDecimal("5000.00"))
                    .currency("USD")
                    .status(AccountStatus.ACTIVE)
                    .swiftCode("NOVBUS33XXX")
                    .cardExpiry("12/29")
                    .cardCvv("482")
                    .build();
            accountJpaRepository.save(sourceAccount);

            Transaction tx = Transaction.builder()
                    .transactionReference("DEP-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase())
                    .idempotencyKey(UUID.randomUUID().toString())
                    .sourceAccountNumber("CASH")
                    .destinationAccountNumber(sourceAccount.getAccountNumber())
                    .amount(new BigDecimal("5000.00"))
                    .currency("USD")
                    .status(TransactionStatus.COMPLETED)
                    .description("Initial Branch Deposit")
                    .build();
            ledgerPersistencePort.save(tx);

            Statement stmt = Statement.builder()
                    .accountNumber(sourceAccount.getAccountNumber())
                    .startDate(LocalDate.now().minusMonths(1).withDayOfMonth(1))
                    .endDate(LocalDate.now().minusMonths(1).withDayOfMonth(28))
                    .pdfStoragePath("/storage/statements/" + sourceAccount.getAccountNumber() + "_prev_month.pdf")
                    .build();
            statementPersistencePort.save(stmt);

            log.info("Seeded Source Account: [{}] with $5000.00 and History", MOCK_SOURCE_PAN);

            auditLogPersistencePort.saveAuditLog(AuditLogRecord.builder()
                    .action("New Device Sign-In Detected")
                    .actor(sourceEmail)
                    .ipAddress("10.0.2.2")
                    .resourceId("req-8f92a10b-33c4-4b11-9e2d")
                    .details("Authorized login detected from Android SM-G998B. Correlation ID attached to session.")
                    .createdAt(java.time.LocalDateTime.now().minusMinutes(5))
                    .build());

            auditLogPersistencePort.saveAuditLog(AuditLogRecord.builder()
                    .action("Internal Transfer Completed")
                    .actor(sourceEmail)
                    .ipAddress("192.168.1.45")
                    .resourceId("req-4c19d28e-71fa-4001-a12e")
                    .details(String.format("$5,000.00 transferred to %s. Settled via LedgerPersistencePort.", MOCK_RECIPIENT_PAN))
                    .createdAt(java.time.LocalDateTime.now().minusHours(1))
                    .build());

            auditLogPersistencePort.saveAuditLog(AuditLogRecord.builder()
                    .action("Monthly Statement Published")
                    .actor(sourceEmail)
                    .ipAddress("System")
                    .resourceId("req-1a2b3c4d-5e6f-7a8b-9c0d")
                    .details("July 2026 PDF statement generated by PdfStatementGenerator service.")
                    .createdAt(java.time.LocalDateTime.now().minusDays(1))
                    .build());

            auditLogPersistencePort.saveAuditLog(AuditLogRecord.builder()
                    .action("Audit Investigation Logged")
                    .actor(sourceEmail)
                    .ipAddress("10.0.2.2")
                    .resourceId("req-77a88b99-00c1-22d3-44e5")
                    .details("Dispute request #DSP-4011 recorded in ReviewAuditLogService.")
                    .createdAt(java.time.LocalDateTime.now().minusDays(4))
                    .build());
        }

        // 2. SEED RECIPIENT ACCOUNT
        if (customerJpaRepository.findByEmail(recipientEmail).isEmpty()) {
            log.info("Seeding initial Recipient Customer: {}", recipientEmail);
            Customer recipientCustomer = Customer.builder()
                    .email(recipientEmail)
                    .password(passwordEncoder.encode("Password123!"))
                    .firstName("John")
                    .lastName("Doe")
                    .role(RoleType.CUSTOMER)
                    .build();
            Customer savedRecipient = customerJpaRepository.save(recipientCustomer);

            Account recipientAccount = Account.builder()
                    .accountNumber(MOCK_RECIPIENT_PAN)
                    .customerId(savedRecipient.getId())
                    .balance(new BigDecimal("0.00"))
                    .currency("USD")
                    .status(AccountStatus.ACTIVE)
                    .swiftCode("NOVBUS33XXX")
                    .cardExpiry("12/29")
                    .cardCvv("891")
                    .build();
            accountJpaRepository.save(recipientAccount);
            log.info("Seeded Recipient Account: [{}] with $0.00", MOCK_RECIPIENT_PAN);
        }
    }
}