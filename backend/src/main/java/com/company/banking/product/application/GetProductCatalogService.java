package com.company.banking.product.application;

import com.company.banking.product.domain.BankProduct;
import com.company.banking.product.infrastructure.ProductJpaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class GetProductCatalogService {

    private final ProductJpaRepository productJpaRepository;

    @Transactional(readOnly = true)
    @Cacheable("products")
    public List<BankProduct> getActiveProducts() {
        return productJpaRepository.findByActiveTrue();
    }
}
