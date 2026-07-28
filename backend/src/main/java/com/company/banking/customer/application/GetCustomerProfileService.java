package com.company.banking.customer.application;

import com.company.banking.common.exception.NotFoundException;
import com.company.banking.customer.api.dto.CustomerResponse;
import com.company.banking.customer.application.port.in.GetCustomerProfileUseCase;
import com.company.banking.customer.application.port.out.CustomerPersistencePort;
import com.company.banking.customer.domain.Customer;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class GetCustomerProfileService implements GetCustomerProfileUseCase {

    private final CustomerPersistencePort customerPersistencePort;

    @Override
    @Transactional(readOnly = true)
    public CustomerResponse getCustomerProfile(Long id) {
        Customer customer = customerPersistencePort.findById(id)
                .orElseThrow(() -> new NotFoundException("Customer not found with id: " + id));

        return CustomerResponse.fromEntity(customer);
    }
}
