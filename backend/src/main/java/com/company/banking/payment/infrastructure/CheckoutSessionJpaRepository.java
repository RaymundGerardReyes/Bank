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

    @Query("SELECT c FROM CheckoutSession c WHERE c.sessionId = :token OR c.paymentIntentId = :token")
    Optional<CheckoutSession> findBySessionId(@Param("token") String token);

    Optional<CheckoutSession> findByPaymentIntentId(String paymentIntentId);

    // Prevents concurrent modifications when transitioning the session state
    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("SELECT c FROM CheckoutSession c WHERE c.sessionId = :token OR c.paymentIntentId = :token")
    Optional<CheckoutSession> findBySessionIdForUpdate(@Param("token") String token);
}
