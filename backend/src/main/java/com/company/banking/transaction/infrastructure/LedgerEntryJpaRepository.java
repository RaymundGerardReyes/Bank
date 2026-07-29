package com.company.banking.transaction.infrastructure;

import com.company.banking.transaction.domain.LedgerEntry;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface LedgerEntryJpaRepository extends JpaRepository<LedgerEntry, Long> {
}
