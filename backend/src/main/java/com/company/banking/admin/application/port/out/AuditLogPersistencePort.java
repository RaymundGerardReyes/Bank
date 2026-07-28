package com.company.banking.admin.application.port.out;

import java.time.LocalDateTime;

public interface AuditLogPersistencePort {
    void fetchAuditLogs(LocalDateTime from, LocalDateTime to);
}
