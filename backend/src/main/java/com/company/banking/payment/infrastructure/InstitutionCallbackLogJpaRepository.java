package com.company.banking.payment.infrastructure;

import com.company.banking.payment.domain.InstitutionCallbackLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface InstitutionCallbackLogJpaRepository extends JpaRepository<InstitutionCallbackLog, Long> {
    List<InstitutionCallbackLog> findByStatusAndNextRetryAtBefore(String status, LocalDateTime time);
}