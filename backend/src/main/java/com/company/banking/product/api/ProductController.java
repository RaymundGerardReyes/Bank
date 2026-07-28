package com.company.banking.product.api;

import com.company.banking.common.response.ApiResponse;
import com.company.banking.product.application.port.in.ProductUseCase;
import com.company.banking.product.domain.BankProduct;
import com.company.banking.web.filter.CorrelationIdFilter;
import lombok.RequiredArgsConstructor;
import org.slf4j.MDC;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1/products")
@RequiredArgsConstructor
public class ProductController {

    private final ProductUseCase productUseCase;

    @GetMapping
    public ResponseEntity<ApiResponse<List<BankProduct>>> getActiveProducts() {
        String correlationId = MDC.get(CorrelationIdFilter.MDC_KEY);
        List<BankProduct> products = productUseCase.getActiveProducts();
        return ResponseEntity.ok(ApiResponse.success(products, correlationId));
    }
}
