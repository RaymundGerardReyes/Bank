package com.company.banking.aml.application;

import com.company.banking.aml.domain.AmlAlert;
import com.company.banking.aml.infrastructure.AmlAlertJpaRepository;
import com.company.banking.common.audit.AuditEventPublisher;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;

@Service
@RequiredArgsConstructor
@Slf4j
public class TransactionMonitoringService {

    private final AmlAlertJpaRepository amlAlertJpaRepository;
    private final AuditEventPublisher auditEventPublisher;

    public void analyzeTransaction(String transactionReference, String accountNumber, BigDecimal amount, String customerRiskProfile) {
        // Rule 1: High-value transaction
        if (amount.compareTo(new BigDecimal("10000.00")) > 0) {
            triggerAlert(transactionReference, accountNumber, "HIGH_VALUE_TX", 60, 
                "Transaction exceeds $10,000 threshold.");
        }

        // Rule 2: Risk Profile Mismatch
        if ("HIGH".equalsIgnoreCase(customerRiskProfile) && amount.compareTo(new BigDecimal("2000.00")) > 0) {
            triggerAlert(transactionReference, accountNumber, "RISK_PROFILE_MISMATCH", 80, 
                "High-risk customer executing abnormally large transfer.");
        }
    }

    private void triggerAlert(String transactionReference, String accountNumber, String ruleTriggered, int riskScore, String description) {
        log.warn("AML ALERT TRIGGERED: {} on Account {} (Tx: {})", ruleTriggered, accountNumber, transactionReference);

        AmlAlert alert = AmlAlert.builder()
                .transactionReference(transactionReference)
                .accountNumber(accountNumber)
                .ruleTriggered(ruleTriggered)
                .riskScore(riskScore)
                .status("NEW")
                .description(description)
                .build();

        amlAlertJpaRepository.save(alert);

        auditEventPublisher.publishEvent("AML_ALERT_GENERATED", "SYSTEM",
                String.format("AML Alert [%s] generated for Account %s with score %d", ruleTriggered, accountNumber, riskScore),
                "AML-" + transactionReference);
    }
}
