package com.company.banking.product.infrastructure;

import com.company.banking.product.application.port.out.ProductPersistencePort;
import com.company.banking.product.domain.BankProduct;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@RequiredArgsConstructor
public class ProductPersistenceAdapter implements ProductPersistencePort {

    private final ProductJpaRepository productJpaRepository;

    @Override
    public List<BankProduct> findByActiveTrue() {
        return productJpaRepository.findByActiveTrue();
    }
}
