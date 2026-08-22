package com.company.banking.payment.infrastructure;

import com.company.banking.payment.domain.CheckoutSession;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import jakarta.persistence.LockModeType;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

@Repository
public interface CheckoutSessionJpaRepository extends JpaRepository<CheckoutSession, Long> {
    Optional<CheckoutSession> findByMerchantIdAndIdempotencyKey(Long merchantId, String idempotencyKey);
    Optional<CheckoutSession> findBySessionId(String sessionId);

    // Prevents concurrent modifications when transitioning the session state
    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("SELECT c FROM CheckoutSession c WHERE c.sessionId = :sessionId")
    Optional<CheckoutSession> findBySessionIdForUpdate(@Param("sessionId") String sessionId);
}
