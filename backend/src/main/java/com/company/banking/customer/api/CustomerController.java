package com.company.banking.customer.api;

import com.company.banking.common.response.ApiResponse;
import com.company.banking.customer.api.dto.CustomerCreateRequest;
import com.company.banking.customer.api.dto.CustomerResponse;
import com.company.banking.customer.application.port.in.CustomerUseCase;
import com.company.banking.web.filter.CorrelationIdFilter;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.slf4j.MDC;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/customers")
@RequiredArgsConstructor
public class CustomerController {

    private final CustomerUseCase customerUseCase;

    @PostMapping
    public ResponseEntity<ApiResponse<CustomerResponse>> createCustomer(@Valid @RequestBody CustomerCreateRequest request) {
        String correlationId = MDC.get(CorrelationIdFilter.MDC_KEY);
        CustomerResponse response = customerUseCase.createCustomer(request);
        return new ResponseEntity<>(ApiResponse.success(response, "Customer registered successfully", correlationId), HttpStatus.CREATED);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<CustomerResponse>> getCustomerProfile(@PathVariable Long id) {
        String correlationId = MDC.get(CorrelationIdFilter.MDC_KEY);
        CustomerResponse response = customerUseCase.getCustomerProfile(id);
        return ResponseEntity.ok(ApiResponse.success(response, correlationId));
    }
}
