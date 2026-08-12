package com.company.banking.transaction.infrastructure;

import com.company.banking.transaction.domain.DisputeCase;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DisputeCaseJpaRepository extends JpaRepository<DisputeCase, Long> {
    List<DisputeCase> findByCustomerId(Long customerId);
}
