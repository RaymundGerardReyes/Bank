package com.company.banking.account.application;

import com.company.banking.account.api.dto.AccountResponse;
import com.company.banking.account.api.dto.OpenAccountRequest;
import com.company.banking.account.application.port.in.OpenAccountUseCase;
import com.company.banking.account.application.port.out.AccountPersistencePort;
import com.company.banking.account.application.provisioning.AccountNumberGenerator;
import com.company.banking.account.application.provisioning.CardProvisioner;
import com.company.banking.account.application.provisioning.ParentAccountValidator;
import com.company.banking.account.domain.Account;
import com.company.banking.common.audit.AuditEventPublisher;
import com.company.banking.common.enums.AccountStatus;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.Primary;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.UUID;

@Primary
@Service
@RequiredArgsConstructor
@Slf4j
public class AccountProvisioningService implements OpenAccountUseCase {

    private final AccountPersistencePort accountPersistencePort;
    private final AuditEventPublisher auditEventPublisher;
    
    // Injected Provisioning Components
    private final ParentAccountValidator parentAccountValidator;
    private final AccountNumberGenerator accountNumberGenerator;
    private final CardProvisioner cardProvisioner;

    @Override
    @Transactional
    public AccountResponse openAccount(OpenAccountRequest request) {
        log.info("[VAM PROVISIONING] Orchestrating creation of {} ledger for Customer {}", request.getAccountType(), request.getCustomerId());

        // 1. Validate Parent Account & Ownership
        parentAccountValidator.validate(request.getParentAccountId(), request.getCustomerId());

        // 2. Generate Account Number (PAN)
        String generatedPan = accountNumberGenerator.generateIsoPan();

       // 3. Create Base Ledger
        Account newAccount = Account.builder()
                .customerId(request.getCustomerId())
                .accountNumber(generatedPan)
                .accountType(request.getAccountType()) // <-- ADD THIS LINE
                .accountName(request.getAccountName())
                .parentAccountId(request.getParentAccountId())
                .currency(request.getCurrency())
                .balance(request.getInitialDeposit() != null ? request.getInitialDeposit() : BigDecimal.ZERO)
                .status(AccountStatus.ACTIVE)
                
                // 4. Limit Provisioner (Direct assignment for brevity)
                .dailyLimit(request.getDailyLimit())
                .monthlyLimit(request.getMonthlyLimit())
                
                // 5. Permission Provisioner
                .allowIncoming(request.isAllowIncoming())
                .allowOutgoing(request.isAllowOutgoing())
                .requireDualApproval(request.isRequireDualApproval())
                .build();

        // 6. Card Provisioner
        cardProvisioner.attachVirtualCard(newAccount, request.isIssueVirtualCard());

        // 7. Persist to Database
        Account savedAccount = accountPersistencePort.save(newAccount);

        // 8. Audit Logging
        auditEventPublisher.publishEvent(
            "VAM_ACCOUNT_PROVISIONED", 
            "Customer ID: " + request.getCustomerId(), 
            "Provisioned " + request.getAccountType() + " account ending in " + generatedPan.substring(12) + " under Parent " + request.getParentAccountId(), 
            "req-" + UUID.randomUUID().toString()
        );

        return AccountResponse.fromEntity(savedAccount);
    }
}