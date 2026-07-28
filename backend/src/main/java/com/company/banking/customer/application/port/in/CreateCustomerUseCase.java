package com.company.banking.customer.application.port.in;

import com.company.banking.customer.api.dto.CustomerCreateRequest;
import com.company.banking.customer.api.dto.CustomerResponse;

public interface CreateCustomerUseCase {
    CustomerResponse createCustomer(CustomerCreateRequest request);
}
