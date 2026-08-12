package com.company.banking.fraud.infrastructure;

import com.company.banking.fraud.domain.DeviceRisk;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface DeviceRiskJpaRepository extends JpaRepository<DeviceRisk, Long> {
    Optional<DeviceRisk> findByDeviceFingerprint(String deviceFingerprint);
}
