package com.company.banking.admin.application;

import lombok.extern.slf4j.Slf4j;
import com.company.banking.admin.application.port.in.AdminUseCase;
import com.company.banking.admin.application.port.out.AuditLogPersistencePort;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@Slf4j
@RequiredArgsConstructor
public class ReviewAuditLogService implements AdminUseCase {

    private final AuditLogPersistencePort auditLogPersistencePort;

    @PreAuthorize("hasRole('ADMIN')")
    public void reviewLogs(LocalDateTime from, LocalDateTime to) {
        log.info("Admin is reviewing audit logs from {} to {}", from, to);
        auditLogPersistencePort.fetchAuditLogs(from, to);
    }
}
