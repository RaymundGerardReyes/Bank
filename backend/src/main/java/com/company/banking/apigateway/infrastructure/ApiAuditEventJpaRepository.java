package com.company.banking.apigateway.infrastructure;

import com.company.banking.apigateway.domain.ApiAuditEvent;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ApiAuditEventJpaRepository extends JpaRepository<ApiAuditEvent, Long> {
}
