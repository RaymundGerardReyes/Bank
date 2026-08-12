package com.company.banking.merchant.infrastructure;

import com.company.banking.merchant.domain.Merchant;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface MerchantJpaRepository extends JpaRepository<Merchant, Long> {
    Optional<Merchant> findByBusinessRegistrationNumber(String brn);
}
