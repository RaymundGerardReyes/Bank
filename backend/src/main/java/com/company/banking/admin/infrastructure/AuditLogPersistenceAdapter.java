package com.company.banking.admin.infrastructure;

import com.company.banking.admin.application.port.out.AuditLogPersistencePort;
import com.company.banking.common.audit.AuditLogRecord;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Component
@Slf4j
@RequiredArgsConstructor
public class AuditLogPersistenceAdapter implements AuditLogPersistencePort {

    private final AuditLogJpaRepository repository;

    @Override
    public void fetchAuditLogs(LocalDateTime from, LocalDateTime to) {
        log.info("Fetching audit logs from data store between {} and {}", from, to);
    }

    @Override
    public List<AuditLogRecord> fetchAuditLogsByActor(String actor, int limit) {
        return repository.findTop50ByActorOrderByCreatedAtDesc(actor).stream()
                .map(entity -> AuditLogRecord.builder()
                        .id(entity.getId())
                        .action(entity.getAction())
                        .actor(entity.getActor())
                        .ipAddress(entity.getIpAddress())
                        .resourceId(entity.getResourceId())
                        .details(entity.getDetails())
                        .createdAt(entity.getCreatedAt())
                        .build())
                .limit(limit)
                .collect(Collectors.toList());
    }

    @Override
    public void saveAuditLog(AuditLogRecord record) {
        repository.save(AuditLogJpaEntity.builder()
                .action(record.getAction())
                .actor(record.getActor())
                .ipAddress(record.getIpAddress())
                .resourceId(record.getResourceId())
                .details(record.getDetails())
                .createdAt(record.getCreatedAt() != null ? record.getCreatedAt() : LocalDateTime.now())
                .build());
    }
}
