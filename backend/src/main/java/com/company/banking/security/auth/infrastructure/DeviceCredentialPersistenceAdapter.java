package com.company.banking.security.auth.infrastructure;

import com.company.banking.security.auth.application.port.out.DeviceCredentialPersistencePort;
import com.company.banking.security.auth.domain.DeviceCredential;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Optional;

@Component
@RequiredArgsConstructor
public class DeviceCredentialPersistenceAdapter implements DeviceCredentialPersistencePort {

    private final DeviceCredentialJpaRepository repository;

    @Override
    public DeviceCredential save(DeviceCredential credential) {
        return repository.save(credential);
    }

    @Override
    public Optional<DeviceCredential> findByDeviceId(String deviceId) {
        return repository.findByDeviceId(deviceId);
    }

    @Override
    public List<DeviceCredential> findByCustomerId(Long customerId) {
        return repository.findByCustomerId(customerId);
    }

    @Override
    public void deleteByDeviceId(String deviceId) {
        repository.deleteByDeviceId(deviceId);
    }
}

