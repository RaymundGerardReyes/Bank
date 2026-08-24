package com.company.banking.apigateway.infrastructure;

import com.company.banking.apigateway.domain.ApiAuditEvent;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface ApiAuditEventJpaRepository extends JpaRepository<ApiAuditEvent, Long> {
    
    List<ApiAuditEvent> findByLinkedAccountIdOrderByCreatedAtDesc(String linkedAccountId);
    List<ApiAuditEvent> findByApiKeyIdOrderByCreatedAtDesc(Long apiKeyId);
    List<ApiAuditEvent> findByMerchantIdOrderByCreatedAtDesc(Long merchantId);
    List<ApiAuditEvent> findByRequestId(String requestId);

    @Query("SELECT e FROM ApiAuditEvent e WHERE e.linkedAccountId = :accountId " +
           "AND e.createdAt BETWEEN :from AND :to ORDER BY e.createdAt DESC")
    List<ApiAuditEvent> findByLinkedAccountIdAndTimeRange(
        @Param("accountId") String accountId,
        @Param("from") LocalDateTime from,
        @Param("to") LocalDateTime to
    );

    @Query("SELECT e FROM ApiAuditEvent e WHERE e.linkedAccountId = :accountId " +
           "ORDER BY e.createdAt DESC LIMIT :limit")
    List<ApiAuditEvent> findRecentByLinkedAccountId(
        @Param("accountId") String accountId,
        @Param("limit") int limit
    );
}
