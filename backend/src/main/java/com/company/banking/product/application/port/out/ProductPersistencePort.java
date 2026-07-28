package com.company.banking.product.application.port.out;

import com.company.banking.product.domain.BankProduct;
import java.util.List;

public interface ProductPersistencePort {
    List<BankProduct> findByActiveTrue();
}
