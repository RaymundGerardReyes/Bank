package com.company.banking.fraud.application;

import com.company.banking.common.audit.AuditEventPublisher;
import com.company.banking.fraud.domain.DeviceRisk;
import com.company.banking.fraud.domain.FraudCase;
import com.company.banking.fraud.infrastructure.DeviceRiskJpaRepository;
import com.company.banking.fraud.infrastructure.FraudCaseJpaRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class FraudManagementService {

    private final FraudCaseJpaRepository fraudCaseJpaRepository;
    private final DeviceRiskJpaRepository deviceRiskJpaRepository;
    private final AuditEventPublisher auditEventPublisher;

    @Transactional
    public String evaluateTransaction(Long paymentIntentId, BigDecimal amount, String deviceFingerprint, String sourceIp) {
        
        int riskScore = 0;
        String decision = "ALLOW";
        String reasonCode = "CLEAN";

        // 1. AFASA Device Profiling
        DeviceRisk device = deviceRiskJpaRepository.findByDeviceFingerprint(deviceFingerprint)
                .orElseGet(() -> deviceRiskJpaRepository.save(
                        DeviceRisk.builder()
                                .deviceFingerprint(deviceFingerprint)
                                .riskScore(0)
                                .isBlacklisted(false)
                                .build()
                ));

        if (device.getIsBlacklisted()) {
            riskScore += 100;
            decision = "BLOCK";
            reasonCode = "BLACKLISTED_DEVICE";
        }

        // 2. Velocity / Value heuristics (Simulated AFASA Behavioral Risk)
        if (amount.compareTo(new BigDecimal("50000.00")) > 0) {
            riskScore += 50;
            if (!decision.equals("BLOCK")) {
                decision = "CHALLENGE";
                reasonCode = "HIGH_VALUE_ANOMALY";
            }
        }

        // Update Device Risk based on this transaction
        device.setRiskScore(device.getRiskScore() + (riskScore / 10));
        deviceRiskJpaRepository.save(device);

        // 3. Generate Case if Suspicious
        if (riskScore >= 50) {
            String fraudRef = "frc_" + UUID.randomUUID().toString().replace("-", "");
            
            FraudCase fraudCase = FraudCase.builder()
                    .fraudReference(fraudRef)
                    .paymentIntentId(paymentIntentId)
                    .fraudScore(riskScore)
                    .decision(decision)
                    .reasonCode(reasonCode)
                    .status("INVESTIGATING")
                    .build();
            
            fraudCaseJpaRepository.save(fraudCase);
            
            log.warn("[AFASA FRAUD] Flagged Intent {} with score {}. Decision: {}", paymentIntentId, riskScore, decision);
            auditEventPublisher.publishEvent("FRAUD_CASE_OPENED", "SYSTEM", 
                    "AFASA Fraud Engine flagged transaction. Decision: " + decision, fraudRef);
        }

        return decision;
    }
}
