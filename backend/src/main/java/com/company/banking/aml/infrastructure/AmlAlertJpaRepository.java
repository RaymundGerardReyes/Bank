package com.company.banking.aml.infrastructure;

import com.company.banking.aml.domain.AmlAlert;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AmlAlertJpaRepository extends JpaRepository<AmlAlert, Long> {
    List<AmlAlert> findByAccountNumber(String accountNumber);
    List<AmlAlert> findByStatus(String status);
}
