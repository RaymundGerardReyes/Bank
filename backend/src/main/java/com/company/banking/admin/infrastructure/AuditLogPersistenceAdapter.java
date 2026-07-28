package com.company.banking.admin.infrastructure;

import com.company.banking.admin.application.port.out.AuditLogPersistencePort;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

@Component
@Slf4j
public class AuditLogPersistenceAdapter implements AuditLogPersistencePort {

    @Override
    public void fetchAuditLogs(LocalDateTime from, LocalDateTime to) {
        log.info("Fetching audit logs from data store between {} and {}", from, to);
    }
}
