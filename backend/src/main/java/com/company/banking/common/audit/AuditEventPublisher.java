package com.company.banking.common.audit;

import com.company.banking.admin.application.port.out.AuditLogPersistencePort;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

@Slf4j
@Component
@RequiredArgsConstructor
public class AuditEventPublisher {

    private final AuditLogPersistencePort auditLogPersistencePort;

    @Async
    public void publishEvent(String action, String username, String details, String correlationId) {
        AuditEvent event = AuditEvent.builder()
                .action(action)
                .username(username)
                .details(details)
                .correlationId(correlationId)
                .timestamp(LocalDateTime.now())
                .build();

        log.info("[AUDIT EVENT] Action: {}, User: {}, CorrelationID: {}, Details: {}",
                event.getAction(), event.getUsername(), event.getCorrelationId(), event.getDetails());

        try {
            auditLogPersistencePort.saveAuditLog(AuditLogRecord.builder()
                    .action(action)
                    .actor(username)
                    .details(details)
                    .resourceId(correlationId)
                    .createdAt(LocalDateTime.now())
                    .build());
        } catch (Exception e) {
            log.error("Failed to persist audit log: {}", e.getMessage());
        }
    }
}
