package com.company.banking.fraud;

import com.company.banking.common.audit.AuditEventPublisher;
import com.company.banking.config.BaseIntegrationTest;
import com.company.banking.fraud.application.FraudManagementService;
import com.company.banking.fraud.domain.DeviceRisk;
import com.company.banking.fraud.infrastructure.DeviceRiskJpaRepository;
import com.company.banking.fraud.infrastructure.FraudCaseJpaRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.bean.override.mockito.MockitoBean;

import java.math.BigDecimal;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@ActiveProfiles("test")
public class FraudAndAmlExecutionPathIT extends BaseIntegrationTest {

    @Autowired
    private FraudManagementService fraudManagementService;

    @Autowired
    private DeviceRiskJpaRepository deviceRiskJpaRepository;

    @Autowired
    private FraudCaseJpaRepository fraudCaseJpaRepository;

    @MockitoBean
    private AuditEventPublisher auditEventPublisher;

    private String deviceFingerprint;

    @BeforeEach
    public void setup() {
        fraudCaseJpaRepository.deleteAll();
        deviceRiskJpaRepository.deleteAll();
        deviceFingerprint = "fp_" + UUID.randomUUID().toString().replaceAll("-", "");
    }

    @Test
    @DisplayName("P01 (Low Risk Path): Clean low-value transaction returns ALLOW decision")
    public void p01_LowRisk_AllowsTransaction() {
        String decision = fraudManagementService.evaluateTransaction(
                1001L,
                new BigDecimal("500.00"),
                deviceFingerprint,
                "192.168.1.50"
        );

        assertEquals("ALLOW", decision);
        assertEquals(0, fraudCaseJpaRepository.count(), "No fraud case opened for clean transaction");
    }

    @Test
    @DisplayName("P02 (Blacklisted Device Guard): Blacklisted device returns BLOCK decision")
    public void p02_BlacklistedDevice_BlocksTransaction() {
        deviceRiskJpaRepository.save(DeviceRisk.builder()
                .deviceFingerprint(deviceFingerprint)
                .riskScore(100)
                .isBlacklisted(true)
                .build());

        String decision = fraudManagementService.evaluateTransaction(
                1002L,
                new BigDecimal("1000.00"),
                deviceFingerprint,
                "192.168.1.50"
        );

        assertEquals("BLOCK", decision);
        assertTrue(fraudCaseJpaRepository.count() > 0, "Fraud case must be opened for blacklisted device");
    }

    @Test
    @DisplayName("P03 (High Value Anomaly): Anomaly (>50,000) triggers CHALLENGE decision")
    public void p03_HighValueAnomaly_TriggersChallenge() {
        String decision = fraudManagementService.evaluateTransaction(
                1003L,
                new BigDecimal("75000.00"),
                deviceFingerprint,
                "192.168.1.50"
        );

        assertEquals("CHALLENGE", decision);
        assertTrue(fraudCaseJpaRepository.count() > 0, "Fraud case must be opened for high-value anomaly");
    }
}
