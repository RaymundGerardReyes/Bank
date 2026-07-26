package com.company.banking.product.infrastructure;

import com.company.banking.product.domain.BankProduct;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProductJpaRepository extends JpaRepository<BankProduct, Long> {
    
    Optional<BankProduct> findByProductCode(String productCode);
    
    List<BankProduct> findByActiveTrue();
}
