package com.company.banking.common.resilience;

import com.company.banking.common.audit.AuditEventPublisher;
import com.company.banking.config.BaseIntegrationTest;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.bean.override.mockito.MockitoBean;

import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

@SpringBootTest
@ActiveProfiles("test")
public class PaymentFailoverPathIT extends BaseIntegrationTest {

    @Autowired
    private PaymentFailoverService paymentFailoverService;

    @MockitoBean
    private AuditEventPublisher auditEventPublisher;

    private final String UNKNOWN_INTENT_ID = "PI-UNKNOWN-999";
    private final String FAILED_RAIL = "INSTAPAY";
    private final String BACKUP_RAIL = "PESONET";

    @BeforeEach
    public void setup() {
        doNothing().when(auditEventPublisher).publishEvent(anyString(), anyString(), anyString(), anyString());
    }

    @Test
    @DisplayName("P01 (Safe Failover): Status inquiry confirms transaction failed, safely triggers failover audit")
    public void p01_handleUnknownState_SafeToFailover() {
        paymentFailoverService.handleUnknownState(UNKNOWN_INTENT_ID, FAILED_RAIL, BACKUP_RAIL);

        verify(auditEventPublisher, times(1)).publishEvent(
                eq("PAYMENT_FAILOVER_SAFE"),
                eq("SYSTEM"),
                contains("Failover triggered from INSTAPAY to PESONET"),
                eq(UNKNOWN_INTENT_ID)
        );
    }
}
