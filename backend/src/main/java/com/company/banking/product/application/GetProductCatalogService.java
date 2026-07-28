package com.company.banking.product.application;

import com.company.banking.product.domain.BankProduct;
import com.company.banking.product.application.port.in.ProductUseCase;
import com.company.banking.product.application.port.out.ProductPersistencePort;
import lombok.RequiredArgsConstructor;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class GetProductCatalogService implements ProductUseCase {

    private final ProductPersistencePort productPersistencePort;

    @Transactional(readOnly = true)
    @Cacheable("products")
    public List<BankProduct> getActiveProducts() {
        return productPersistencePort.findByActiveTrue();
    }
}
