package com.company.banking.payment.infrastructure;

import com.company.banking.payment.domain.IdempotencyClaim;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface IdempotencyClaimJpaRepository extends JpaRepository<IdempotencyClaim, Long> {
    
    Optional<IdempotencyClaim> findByMerchantIdAndIdempotencyKey(Long merchantId, String idempotencyKey);
}
