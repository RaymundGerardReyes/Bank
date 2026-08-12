package com.company.banking.common.resilience;

import com.company.banking.common.audit.AuditEventPublisher;
import com.company.banking.payment.domain.PaymentIntent;
import com.company.banking.payment.infrastructure.PaymentIntentJpaRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Slf4j
public class PaymentFailoverService {

    private final PaymentIntentJpaRepository paymentIntentJpaRepository;
    private final AuditEventPublisher auditEventPublisher;

    /**
     * Called when a Gateway Rail (e.g. InstaPay) returns a TIMEOUT or 503 instead of a definitive SUCCESS/FAILURE.
     */
    @Transactional
    public void handleUnknownState(String intentId, String failedRail, String backupRail) {
        log.warn("[FAILOVER] Rail {} returned UNKNOWN state for Intent {}", failedRail, intentId);

        // 1. Perform explicit Status Inquiry against the failed rail.
        boolean isConfirmedFailed = performStatusInquiry(intentId, failedRail);

        if (isConfirmedFailed) {
            log.info("[FAILOVER] Status Inquiry confirmed transaction failed on {}. Safe to failover to {}", failedRail, backupRail);
            
            auditEventPublisher.publishEvent("PAYMENT_FAILOVER_SAFE", "SYSTEM", 
                "Failover triggered from " + failedRail + " to " + backupRail, intentId);
                
            // In reality, this would transition the intent and hand off to the backup rail engine
            
        } else {
            // Rail A actually processed it, or it's still pending. Do NOT failover.
            log.error("[FAILOVER] CRITICAL: Status Inquiry returned SUCCESS/PENDING on {}. Aborting failover to prevent double processing.", failedRail);
            
            auditEventPublisher.publishEvent("PAYMENT_FAILOVER_ABORTED", "SYSTEM", 
                "Failover aborted to prevent duplicate processing on " + backupRail, intentId);
        }
    }

    private boolean performStatusInquiry(String intentId, String rail) {
        // Mocking an external API call to the Rail's status inquiry endpoint
        log.info("[FAILOVER] Executing mandatory Status Inquiry against {}", rail);
        
        // Simulating the rail confirming it never received or formally rejected the message.
        return true; 
    }
}
