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
import com.company.banking.orchestration.domain.PaymentRailConfiguration;
import com.company.banking.orchestration.infrastructure.PaymentRailConfigurationJpaRepository;
import com.company.banking.merchant.infrastructure.MerchantJpaRepository;
import com.company.banking.merchant.domain.Merchant;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
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
    private final PaymentRailConfigurationJpaRepository paymentRailConfigurationJpaRepository;
    private final MerchantJpaRepository merchantJpaRepository;
    private final com.company.banking.apigateway.infrastructure.ApiKeyJpaRepository apiKeyJpaRepository;
    private final jakarta.persistence.EntityManager entityManager;

    // Defined standard ISO PANs for seeding
    private final String MOCK_SOURCE_PAN = "4859220013371001";
    private final String MOCK_VAM_SUB_PAN = "4859220013371002";
    private final String MOCK_SUSPENDED_PAN = "4859220013371999";
    private final String MOCK_PHP_SOURCE_PAN = "4859220013372001";
    private final String MOCK_PHP_DEST_PAN = "4859220013372002";
    private final String MOCK_RECIPIENT_PAN = "4859220013379999";

    @Override
    @jakarta.transaction.Transactional
    public void run(String... args) {
        // Seed payment rails if not present
        if (paymentRailConfigurationJpaRepository.count() == 0) {
            log.info("Seeding Payment Rail Configurations (SWIFT, INSTAPAY, PESONET, FEDWIRE, ACH)");
            paymentRailConfigurationJpaRepository.saveAll(List.of(
                PaymentRailConfiguration.builder().railName("SWIFT").processingType("REAL_TIME").maxAmountPerTx(new BigDecimal("1000000.00")).active(true).build(),
                PaymentRailConfiguration.builder().railName("INSTAPAY").processingType("REAL_TIME").maxAmountPerTx(new BigDecimal("50000.00")).active(true).build(),
                PaymentRailConfiguration.builder().railName("PESONET").processingType("BATCH").maxAmountPerTx(new BigDecimal("500000.00")).active(true).build(),
                PaymentRailConfiguration.builder().railName("FEDWIRE").processingType("REAL_TIME").maxAmountPerTx(new BigDecimal("1000000.00")).active(true).build(),
                PaymentRailConfiguration.builder().railName("ACH").processingType("BATCH").maxAmountPerTx(new BigDecimal("1000000.00")).active(true).build()
            ));
        }
        // DEV NOTE: This is the primary seeded test account.
        // To test forgot-password, register or use this exact email in the form.
        String sourceEmail = "user@example.com";
        String recipientEmail = "recipient@example.com";

        // 1. SEED SOURCE ACCOUNT
        if (customerJpaRepository.findByEmailIgnoreCase(sourceEmail).isEmpty()) {
            log.info("Seeding initial Source Customer: {}", sourceEmail);
            Customer sourceCustomer = Customer.builder()
                    .email(sourceEmail)
                    .password(passwordEncoder.encode("Password123!"))
                    .firstName("Raymund")
                    .lastName("Reyes")
                    .role(RoleType.CUSTOMER)
                    .kycStatus("ACTIVE")
                    .riskProfile("LOW")
                    .locked(false)
                    .build();
            Customer savedSource = customerJpaRepository.save(sourceCustomer);

            Account sourceAccount = Account.builder()
                    .accountNumber(MOCK_SOURCE_PAN)
                    .customerId(savedSource.getId())
                    .balance(new BigDecimal("5000.00"))
                    .balance(new BigDecimal("100000.00"))
                    .currency("USD")
                    .status(AccountStatus.ACTIVE)
                    .swiftCode("NOVBUS33XXX")
                    .cardExpiry("12/29")
                    .cardCvv("482")
                    .allowIncoming(true)
                    .allowOutgoing(true)
                    .build();
            accountJpaRepository.save(sourceAccount);

            Account vamSubAccount = Account.builder()
                    .accountNumber(MOCK_VAM_SUB_PAN)
                    .customerId(savedSource.getId())
                    .parentAccountId(MOCK_SOURCE_PAN)
                    .accountType("VAM_SUB")
                    .balance(new BigDecimal("1000.00"))
                    .balance(new BigDecimal("10000.00"))
                    .currency("USD")
                    .status(AccountStatus.ACTIVE)
                    .swiftCode("NOVBUS33XXX")
                    .cardExpiry("12/29")
                    .cardCvv("483")
                    .allowIncoming(true)
                    .allowOutgoing(true)
                    .build();
            accountJpaRepository.save(vamSubAccount);
            log.info("Seeded secondary VAM Sub-Account: [{}] with $1000.00", MOCK_VAM_SUB_PAN);
            log.info("Seeded secondary VAM Sub-Account: [{}] with $10000.00", MOCK_VAM_SUB_PAN);

            Account suspendedAccount = Account.builder()
                    .accountNumber(MOCK_SUSPENDED_PAN)
                    .customerId(savedSource.getId())
                    .balance(new BigDecimal("250.00"))
                    .currency("USD")
                    .status(AccountStatus.SUSPENDED)
                    .swiftCode("NOVBUS33XXX")
                    .cardExpiry("12/29")
                    .cardCvv("999")
                    .allowIncoming(false)
                    .allowOutgoing(false)
                    .build();
            accountJpaRepository.save(suspendedAccount);
            log.info("Seeded Suspended Account: [{}]", MOCK_SUSPENDED_PAN);

            Account phpSourceAccount = Account.builder()
                    .accountNumber(MOCK_PHP_SOURCE_PAN)
                    .customerId(savedSource.getId())
                    .balance(new BigDecimal("100000.00"))
                    .currency("PHP")
                    .status(AccountStatus.ACTIVE)
                    .swiftCode("NOVBUS33XXX")
                    .cardExpiry("12/29")
                    .cardCvv("201")
                    .allowIncoming(true)
                    .allowOutgoing(true)
                    .build();
            accountJpaRepository.save(phpSourceAccount);

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

            // Seed verified Merchant profile for Source Customer so LIVE API credentials can be issued
            if (merchantJpaRepository.findByOwnerId(savedSource.getId()).isEmpty()) {
                Merchant verifiedMerchant = Merchant.builder()
                        .ownerId(savedSource.getId())
                        .legalName("Raymund Reyes FinTech Solutions")
                        .merchantCode("MERCH-RAYMUND-01")
                        .businessRegistrationNumber("2026-BIR-1002")
                        .settlementAccount(MOCK_SOURCE_PAN)
                        .status("ACTIVE")
                        .build();
                merchantJpaRepository.save(verifiedMerchant);
                log.info("Seeded primary verified Merchant profile for [{}]: [{}] with settlement account [{}]", 
                        sourceEmail, verifiedMerchant.getMerchantCode(), MOCK_SOURCE_PAN);
            }
        }

        // 2. SEED RECIPIENT ACCOUNT
        if (customerJpaRepository.findByEmailIgnoreCase(recipientEmail).isEmpty()) {
            log.info("Seeding initial Recipient Customer: {}", recipientEmail);
            Customer recipientCustomer = Customer.builder()
                    .email(recipientEmail)
                    .password(passwordEncoder.encode("Password123!"))
                    .firstName("John")
                    .lastName("Doe")
                    .role(RoleType.CUSTOMER)
                    .kycStatus("ACTIVE")
                    .riskProfile("LOW")
                    .locked(false)
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
                    .allowIncoming(true)
                    .allowOutgoing(true)
                    .build();
            accountJpaRepository.save(recipientAccount);

            Account phpRecipientAccount = Account.builder()
                    .accountNumber(MOCK_PHP_DEST_PAN)
                    .customerId(savedRecipient.getId())
                    .balance(new BigDecimal("5000.00"))
                    .currency("PHP")
                    .status(AccountStatus.ACTIVE)
                    .swiftCode("NOVBUS33XXX")
                    .cardExpiry("12/29")
                    .cardCvv("202")
                    .allowIncoming(true)
                    .allowOutgoing(true)
                    .build();
            accountJpaRepository.save(phpRecipientAccount);
            log.info("Seeded Recipient Account: [{}] with $0.00 and PHP recipient [{}]", MOCK_RECIPIENT_PAN, MOCK_PHP_DEST_PAN);
        }

        // Ensure secondary VAM Sub-Account and supplementary accounts exist even if Source Customer was seeded previously
        customerJpaRepository.findByEmailIgnoreCase(sourceEmail).ifPresent(customer -> {
            List<Account> existingAccounts = accountJpaRepository.findByCustomerId(customer.getId());
            for (Account acc : existingAccounts) {
                if (acc.getStatus() == AccountStatus.ACTIVE && (acc.getBalance() == null || acc.getBalance().compareTo(new BigDecimal("5000.00")) < 0)) {
                    acc.setBalance(new BigDecimal("100000.00"));
                    accountJpaRepository.save(acc);
                    log.info("Topped up existing low-balance account: [{}] ({}) to 100,000.00", acc.getAccountNumber(), acc.getCurrency());
                }
            }
            if (accountJpaRepository.findByAccountNumber(MOCK_VAM_SUB_PAN).isEmpty()) {
                Account vamSubAccount = Account.builder()
                        .accountNumber(MOCK_VAM_SUB_PAN)
                        .customerId(customer.getId())
                        .parentAccountId(MOCK_SOURCE_PAN)
                        .accountType("VAM_SUB")
                        .balance(new BigDecimal("1000.00"))
                        .balance(new BigDecimal("10000.00"))
                        .currency("USD")
                        .status(AccountStatus.ACTIVE)
                        .swiftCode("NOVBUS33XXX")
                        .cardExpiry("12/29")
                        .cardCvv("483")
                        .allowIncoming(true)
                        .allowOutgoing(true)
                        .build();
                accountJpaRepository.save(vamSubAccount);
                log.info("Provisioned missing secondary VAM Sub-Account: [{}] for [{}]", MOCK_VAM_SUB_PAN, sourceEmail);
            }
            if (accountJpaRepository.findByAccountNumber(MOCK_SUSPENDED_PAN).isEmpty()) {
                Account suspendedAccount = Account.builder()
                        .accountNumber(MOCK_SUSPENDED_PAN)
                        .customerId(customer.getId())
                        .balance(new BigDecimal("250.00"))
                        .currency("USD")
                        .status(AccountStatus.SUSPENDED)
                        .swiftCode("NOVBUS33XXX")
                        .cardExpiry("12/29")
                        .cardCvv("999")
                        .allowIncoming(false)
                        .allowOutgoing(false)
                        .build();
                accountJpaRepository.save(suspendedAccount);
                log.info("Provisioned missing Suspended Account: [{}] for [{}]", MOCK_SUSPENDED_PAN, sourceEmail);
            }
            if (accountJpaRepository.findByAccountNumber(MOCK_PHP_SOURCE_PAN).isEmpty()) {
                Account phpSourceAccount = Account.builder()
                        .accountNumber(MOCK_PHP_SOURCE_PAN)
                        .customerId(customer.getId())
                        .balance(new BigDecimal("100000.00"))
                        .currency("PHP")
                        .status(AccountStatus.ACTIVE)
                        .swiftCode("NOVBUS33XXX")
                        .cardExpiry("12/29")
                        .cardCvv("201")
                        .allowIncoming(true)
                        .allowOutgoing(true)
                        .build();
                accountJpaRepository.save(phpSourceAccount);
                log.info("Provisioned missing PHP Source Account: [{}] for [{}]", MOCK_PHP_SOURCE_PAN, sourceEmail);
            }

            List<Merchant> existingMerchants = merchantJpaRepository.findByOwnerId(customer.getId());
            if (existingMerchants.isEmpty()) {
                Merchant verifiedMerchant = Merchant.builder()
                        .ownerId(customer.getId())
                        .legalName("Raymund Reyes FinTech Solutions")
                        .merchantCode("MERCH-RAYMUND-01")
                        .businessRegistrationNumber("2026-BIR-1002")
                        .settlementAccount(MOCK_SOURCE_PAN)
                        .status("ACTIVE")
                        .build();
                merchantJpaRepository.save(verifiedMerchant);
                log.info("Provisioned verified Merchant profile for existing customer [{}]: [{}]", sourceEmail, verifiedMerchant.getMerchantCode());
            } else {
                for (Merchant m : existingMerchants) {
                    if (m.getBusinessRegistrationNumber() == null || m.getBusinessRegistrationNumber().startsWith("DEV-REG-") || m.getBusinessRegistrationNumber().startsWith("DEV-")) {
                        m.setBusinessRegistrationNumber("2026-BIR-1002");
                        m.setStatus("ACTIVE");
                        if (m.getSettlementAccount() == null || m.getSettlementAccount().isBlank()) {
                            m.setSettlementAccount(MOCK_SOURCE_PAN);
                        }
                        merchantJpaRepository.save(m);
                        log.info("Upgraded developer merchant [{}] to verified LIVE-eligible profile.", m.getMerchantCode());
                    }
                }
            }

            List<Merchant> finalMerchants = merchantJpaRepository.findByOwnerId(customer.getId());
            if (!finalMerchants.isEmpty()) {
                Merchant primaryMerchant = finalMerchants.get(0);
                // 1. Seed Sandbox / Test Key for Sandbox testing
                seedApiKeyIfMissing("sk_test_2026_university_erp_sandbox_key", "University ERP Sandbox Test Key", "SANDBOX", primaryMerchant, MOCK_SOURCE_PAN);
                // 2. Seed Live / Production Keys
                seedApiKeyIfMissing("sk_live_2026_university_erp_production_key", "University ERP Live Gateway Key", "LIVE", primaryMerchant, MOCK_SOURCE_PAN);
                seedApiKeyIfMissing("sk_live_2026_raymund_fintech_production_key_01", "Raymund FinTech Master Live Key", "LIVE", primaryMerchant, MOCK_SOURCE_PAN);
            }
        });

        customerJpaRepository.findByEmailIgnoreCase(recipientEmail).ifPresent(recipient -> {
            if (accountJpaRepository.findByAccountNumber(MOCK_PHP_DEST_PAN).isEmpty()) {
                Account phpRecipientAccount = Account.builder()
                        .accountNumber(MOCK_PHP_DEST_PAN)
                        .customerId(recipient.getId())
                        .balance(new BigDecimal("5000.00"))
                        .currency("PHP")
                        .status(AccountStatus.ACTIVE)
                        .swiftCode("NOVBUS33XXX")
                        .cardExpiry("12/29")
                        .cardCvv("202")
                        .allowIncoming(true)
                        .allowOutgoing(true)
                        .build();
                accountJpaRepository.save(phpRecipientAccount);
                log.info("Provisioned missing PHP Recipient Account: [{}] for [{}]", MOCK_PHP_DEST_PAN, recipientEmail);
            }
        });
    }

    private void seedApiKeyIfMissing(String rawSecretKey, String keyName, String env, Merchant merchant, String boundAccount) {
        String keyHash = com.company.banking.apigateway.application.CreateApiKeyService.hashKey(rawSecretKey);
        if (apiKeyJpaRepository.findByKeyHash(keyHash).isEmpty()) {
            String prefix = env.equalsIgnoreCase("LIVE") ? "sk_live_" : "sk_test_";
            com.company.banking.apigateway.infrastructure.ApiKeyJpaEntity entity = 
                    com.company.banking.apigateway.infrastructure.ApiKeyJpaEntity.builder()
                    .keyPrefix(prefix)
                    .merchantId(merchant.getId())
                    .customerId(merchant.getOwnerId())
                    .keyHash(keyHash)
                    .name(keyName)
                    .environment(env)
                    .cidrWhitelist("0.0.0.0/0")
                    .scopes("payments:write,payments:read,accounts:read,accounts:write,treasury:write,treasury:read")
                    .linkedAccountId(boundAccount)
                    .applicationId("app_university_erp")
                    .applicationName("University ERP Gateway Client")
                    .perTransactionLimit(new BigDecimal("100000.00"))
                    .dailyLimit(new BigDecimal("1000000.00"))
                    .expiresAt(java.time.LocalDateTime.now().plusYears(10))
                    .createdAt(java.time.LocalDateTime.now())
                    .build();
            apiKeyJpaRepository.save(entity);
            log.info("================================================================================");
            log.info("[DATA INITIALIZER] SEEDED DETERMINISTIC {} API KEY FOR EXTERNAL INTEGRATION:", env);
            log.info("  Name: {}", keyName);
            log.info("  Environment: {}", env);
            log.info("  Merchant: {} ({})", merchant.getLegalName(), merchant.getMerchantCode());
            log.info("  Secret Key: {}", rawSecretKey);
            log.info("  Bound Account: {}", boundAccount);
            log.info("  Scopes: payments:write, payments:read, accounts:read, accounts:write, treasury:write, treasury:read");
            log.info("================================================================================");
        }
    }
}