package com.company.banking.transaction.infrastructure;

import com.company.banking.transaction.domain.LedgerEntry;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface LedgerEntryJpaRepository extends org.springframework.data.jpa.repository.JpaRepository<LedgerEntry, Long> {
    List<LedgerEntry> findByCreatedAtBetween(java.time.LocalDateTime start, java.time.LocalDateTime end);
    List<LedgerEntry> findByTransactionReference(String transactionReference);
}

