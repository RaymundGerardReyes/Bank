package com.company.banking.security.auth.infrastructure;

import com.company.banking.security.auth.domain.DeviceCredential;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface DeviceCredentialJpaRepository extends JpaRepository<DeviceCredential, Long> {
    Optional<DeviceCredential> findByDeviceId(String deviceId);
    List<DeviceCredential> findByCustomerId(Long customerId);
    void deleteByDeviceId(String deviceId);
}

