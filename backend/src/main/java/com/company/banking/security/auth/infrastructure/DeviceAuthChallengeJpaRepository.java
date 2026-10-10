package com.company.banking.security.auth.infrastructure;

import com.company.banking.security.auth.domain.DeviceAuthChallenge;
import jakarta.persistence.LockModeType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface DeviceAuthChallengeJpaRepository extends JpaRepository<DeviceAuthChallenge, Long> {

    Optional<DeviceAuthChallenge> findByChallenge(String challenge);

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("SELECT c FROM DeviceAuthChallenge c WHERE c.challenge = :challenge")
    Optional<DeviceAuthChallenge> findByChallengeForUpdate(@Param("challenge") String challenge);
}

