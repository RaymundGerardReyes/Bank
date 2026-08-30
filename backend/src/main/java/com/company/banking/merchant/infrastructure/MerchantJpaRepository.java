package com.company.banking.merchant.infrastructure;

import com.company.banking.merchant.domain.Merchant;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface MerchantJpaRepository extends JpaRepository<Merchant, Long> {
    Optional<Merchant> findByBusinessRegistrationNumber(String brn);
    
    // PHASE 5: Explicitly resolve multiple merchants by their owner
    List<Merchant> findByOwnerId(Long ownerId);

    // Scoped single merchant resolution by ID & owner
    Optional<Merchant> findByIdAndOwnerId(Long id, Long ownerId);
}
