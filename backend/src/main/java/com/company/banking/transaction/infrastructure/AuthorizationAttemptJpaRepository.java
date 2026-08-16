package com.company.banking.transaction.infrastructure;

import com.company.banking.transaction.domain.AuthorizationAttempt;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface AuthorizationAttemptJpaRepository extends JpaRepository<AuthorizationAttempt, Long> {

    Optional<AuthorizationAttempt> findByChallenge(String challenge);
}
