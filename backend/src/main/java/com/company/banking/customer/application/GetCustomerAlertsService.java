package com.company.banking.customer.application;

import com.company.banking.admin.application.port.out.AuditLogPersistencePort;
import com.company.banking.common.audit.AuditLogRecord;
import com.company.banking.customer.application.port.in.GetCustomerAlertsUseCase;
import com.company.banking.customer.api.dto.NotificationResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class GetCustomerAlertsService implements GetCustomerAlertsUseCase {

    private final AuditLogPersistencePort auditLogPersistencePort;

    @Override
    public List<NotificationResponse> getCustomerAlerts(String customerEmail) {
        log.info("Fetching customer alerts for: {}", customerEmail);
        
        List<AuditLogRecord> auditLogs = auditLogPersistencePort.fetchAuditLogsByActor(customerEmail, 50);

        return auditLogs.stream().map(log -> NotificationResponse.builder()
                .id("alert-" + log.getId())
                .category(determineCategory(log.getAction()))
                .title(log.getAction())
                .message(log.getDetails())
                .timestamp(log.getCreatedAt() != null ? log.getCreatedAt().format(DateTimeFormatter.ofPattern("MMM dd, yyyy h:mm a")) : "Unknown Time")
                .unread(true) // Audit logs are effectively unread alerts in this simplified model
                .correlationId(log.getResourceId() != null ? log.getResourceId() : "req-unknown")
                .referenceId("AUDIT-" + log.getId())
                .channel("IN-APP")
                .ipAddress(log.getIpAddress() != null ? log.getIpAddress() : "System")
                .deviceInfo("Mobile/Web Dashboard")
                .severity(determineSeverity(log.getAction()))
                .build()
        ).collect(Collectors.toList());
    }

    private String determineCategory(String action) {
        if (action == null) return "SYSTEM";
        String upper = action.toUpperCase();
        if (upper.contains("LOGIN") || upper.contains("SIGN-IN") || upper.contains("SECURITY") || upper.contains("PASSWORD")) {
            return "SECURITY";
        } else if (upper.contains("TRANSFER") || upper.contains("PAYMENT") || upper.contains("DEPOSIT") || upper.contains("WITHDRAW")) {
            return "TRANSACTION";
        } else if (upper.contains("STATEMENT") || upper.contains("REPORT")) {
            return "SYSTEM";
        } else if (upper.contains("DISPUTE") || upper.contains("INVESTIGATION")) {
            return "DISPUTE";
        }
        return "SYSTEM";
    }

    private String determineSeverity(String action) {
        if (action == null) return "INFO";
        String upper = action.toUpperCase();
        if (upper.contains("LOGIN") || upper.contains("SIGN-IN")) {
            return "CRITICAL";
        } else if (upper.contains("DISPUTE") || upper.contains("INVESTIGATION")) {
            return "WARNING";
        }
        return "INFO";
    }
}
