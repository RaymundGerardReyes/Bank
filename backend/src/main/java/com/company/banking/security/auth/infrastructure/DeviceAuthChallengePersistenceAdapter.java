package com.company.banking.security.auth.infrastructure;

import com.company.banking.security.auth.application.port.out.DeviceAuthChallengePersistencePort;
import com.company.banking.security.auth.domain.DeviceAuthChallenge;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.Optional;

@Component
@RequiredArgsConstructor
public class DeviceAuthChallengePersistenceAdapter implements DeviceAuthChallengePersistencePort {

    private final DeviceAuthChallengeJpaRepository repository;

    @Override
    public DeviceAuthChallenge save(DeviceAuthChallenge challenge) {
        return repository.save(challenge);
    }

    @Override
    public Optional<DeviceAuthChallenge> findByChallenge(String challenge) {
        return repository.findByChallenge(challenge);
    }

    @Override
    public Optional<DeviceAuthChallenge> findByChallengeForUpdate(String challenge) {
        return repository.findByChallengeForUpdate(challenge);
    }
}

