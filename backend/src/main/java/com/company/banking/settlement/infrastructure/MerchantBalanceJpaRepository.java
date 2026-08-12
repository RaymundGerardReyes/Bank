package com.company.banking.settlement.infrastructure;

import com.company.banking.settlement.domain.MerchantBalance;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface MerchantBalanceJpaRepository extends JpaRepository<MerchantBalance, Long> {
    Optional<MerchantBalance> findByMerchantId(Long merchantId);
}
