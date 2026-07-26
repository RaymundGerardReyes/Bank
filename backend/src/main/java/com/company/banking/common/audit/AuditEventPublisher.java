package com.company.banking.common.audit;

import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

@Slf4j
@Component
public class AuditEventPublisher {

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
    }
}
