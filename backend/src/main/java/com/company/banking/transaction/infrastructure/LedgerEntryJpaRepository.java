package com.company.banking.transaction.infrastructure;

import com.company.banking.transaction.domain.LedgerEntry;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface LedgerEntryJpaRepository extends org.springframework.data.jpa.repository.JpaRepository<LedgerEntry, Long> {
    java.util.List<LedgerEntry> findByCreatedAtBetween(java.time.LocalDateTime start, java.time.LocalDateTime end);
}
