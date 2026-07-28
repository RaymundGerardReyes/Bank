package com.company.banking.product.application.port.in;

import com.company.banking.product.domain.BankProduct;
import java.util.List;

public interface ProductUseCase {
    List<BankProduct> getActiveProducts();
}
