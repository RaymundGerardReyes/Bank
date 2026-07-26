package com.company.banking.admin.application;

import lombok.extern.slf4j.Slf4j;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@Slf4j
public class ReviewAuditLogService {

    @PreAuthorize("hasRole('ADMIN')")
    public void reviewLogs(LocalDateTime from, LocalDateTime to) {
        log.info("Admin is reviewing audit logs from {} to {}", from, to);
        // Integrate with Elasticsearch or database audit table to fetch logs
    }
}
