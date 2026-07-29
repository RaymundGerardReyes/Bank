package com.company.banking.admin.application.port.out;

import com.company.banking.common.audit.AuditLogRecord;
import java.time.LocalDateTime;
import java.util.List;

public interface AuditLogPersistencePort {
    void fetchAuditLogs(LocalDateTime from, LocalDateTime to);
    List<AuditLogRecord> fetchAuditLogsByActor(String actor, int limit);
    void saveAuditLog(AuditLogRecord record);
}
