package com.company.banking.merchant.infrastructure;

import com.company.banking.merchant.domain.MerchantPaymentProfile;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MerchantPaymentProfileJpaRepository extends JpaRepository<MerchantPaymentProfile, Long> {
    List<MerchantPaymentProfile> findByMerchantId(Long merchantId);
}
