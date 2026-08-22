package com.company.banking.payment.infrastructure;

import com.company.banking.payment.domain.PaymentEventOutbox;
import com.company.banking.payment.domain.PaymentEventOutboxStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.time.LocalDateTime;

import java.util.Optional;

@Repository
public interface PaymentEventOutboxJpaRepository extends JpaRepository<PaymentEventOutbox, Long> {

    // Ensures we ONLY pick up an event if there are NO previous undelivered events for the same payment
    @Query(value = """
        SELECT o1.* FROM payment_event_outbox o1 
        WHERE o1.status IN ('PENDING', 'RETRY') 
          AND (o1.next_attempt_at IS NULL OR o1.next_attempt_at <= CURRENT_TIMESTAMP)
          AND o1.locked_at IS NULL
          AND NOT EXISTS (
              SELECT 1 FROM payment_event_outbox o2 
              WHERE o2.aggregate_type = o1.aggregate_type 
                AND o2.aggregate_id = o1.aggregate_id 
                AND o2.sequence < o1.sequence 
                AND o2.status != 'DELIVERED'
          )
        ORDER BY o1.created_at ASC 
        LIMIT :limit 
        FOR UPDATE SKIP LOCKED
        """, nativeQuery = true)
    List<PaymentEventOutbox> findAndLockEligibleEvents(@Param("limit") int limit);

    @Query(value = """
        SELECT * FROM payment_event_outbox 
        WHERE status = 'DELIVERING' 
          AND locked_at < :leaseThreshold
        FOR UPDATE SKIP LOCKED
        """, nativeQuery = true)
    List<PaymentEventOutbox> findStuckDeliveries(@Param("leaseThreshold") LocalDateTime leaseThreshold);

    int countByAggregateTypeAndAggregateId(String aggregateType, String aggregateId);
    
    Optional<PaymentEventOutbox> findByEventId(String eventId);
}
