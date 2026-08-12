package com.company.banking.aml.application;

import com.company.banking.account.application.port.out.AccountPersistencePort;
import com.company.banking.account.domain.Account;
import com.company.banking.aml.domain.AmlCase;
import com.company.banking.aml.domain.SuspiciousTransactionReport;
import com.company.banking.common.audit.AuditEventPublisher;
import com.company.banking.common.exception.BusinessException;
import com.company.banking.common.exception.ErrorCode;
import com.company.banking.common.exception.NotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Slf4j
public class AmlCaseService {

    private final AccountPersistencePort accountPersistencePort;
    private final AuditEventPublisher auditEventPublisher;

    @Transactional
    public void freezeAccount(String accountNumber, Long caseId, String reason, String complianceOfficer) {
        Account account = accountPersistencePort.findByAccountNumber(accountNumber)
                .orElseThrow(() -> new NotFoundException("Account not found"));

        if (account.isFrozen()) {
            throw new BusinessException(ErrorCode.INVALID_REQUEST, "Account is already frozen");
        }

        account.setFrozen(true);
        accountPersistencePort.save(account);

        log.warn("AML ACTION: Account {} frozen by {} due to Case {}", accountNumber, complianceOfficer, caseId);
        
        auditEventPublisher.publishEvent("ACCOUNT_FROZEN", complianceOfficer,
                String.format("Account %s strictly frozen due to AML investigation. Reason: %s", accountNumber, reason),
                "CASE-" + caseId);
    }

    @Transactional
    public SuspiciousTransactionReport fileStr(Long caseId, Long customerId, String transactions, String narrative, String complianceOfficer) {
        SuspiciousTransactionReport str = SuspiciousTransactionReport.builder()
                .caseId(caseId)
                .customerId(customerId)
                .transactionReferences(transactions)
                .narrative(narrative)
                .status("SUBMITTED_TO_AMLC")
                .submittedAt(java.time.LocalDateTime.now())
                .build();
                
        // In a real system, this would persist the STR to the DB and integrate with an external AMLC reporting API.
        
        log.warn("STR FILED: Suspicious Transaction Report submitted to AMLC for Customer {} by {}", customerId, complianceOfficer);
        
        auditEventPublisher.publishEvent("STR_FILED", complianceOfficer,
                "Formal Suspicious Transaction Report filed with AMLC for Customer " + customerId,
                "STR-CASE-" + caseId);
                
        return str;
    }
}
