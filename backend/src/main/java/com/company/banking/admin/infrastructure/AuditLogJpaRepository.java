package com.company.banking.admin.infrastructure;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AuditLogJpaRepository extends JpaRepository<AuditLogJpaEntity, Long> {
    List<AuditLogJpaEntity> findTop50ByActorOrderByCreatedAtDesc(String actor);
}
