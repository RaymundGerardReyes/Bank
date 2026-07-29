package com.company.banking.common.audit;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class AuditLogRecord {
    private Long id;
    private String action;
    private String actor;
    private String ipAddress;
    private String resourceId;
    private String details;
    private LocalDateTime createdAt;
}
