package com.company.banking.common.resilience;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CriticalBusinessServiceJpaRepository extends JpaRepository<CriticalBusinessService, Long> {
    Optional<CriticalBusinessService> findByServiceName(String serviceName);
}
