package com.company.banking.customer.application;

import com.company.banking.common.exception.ForbiddenException;
import com.company.banking.common.exception.NotFoundException;
import com.company.banking.customer.api.dto.CustomerResponse;
import com.company.banking.customer.api.dto.CustomerUpdateRequest;
import com.company.banking.customer.application.port.out.CustomerPersistencePort;
import com.company.banking.customer.domain.Customer;
import com.company.banking.customer.domain.CustomerPolicy;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class UpdateCustomerProfileService {

    private final CustomerPersistencePort customerPersistencePort;
    private final CustomerPolicy customerPolicy;

    @Transactional
    public CustomerResponse updateProfile(Long requestorId, Long targetId, CustomerUpdateRequest request) {
        if (!customerPolicy.canUpdateProfile(requestorId, targetId)) {
            throw new ForbiddenException("Cannot update another customer's profile");
        }

        Customer customer = customerPersistencePort.findById(targetId)
                .orElseThrow(() -> new NotFoundException("Customer not found"));

        customer.setFirstName(request.getFirstName());
        customer.setLastName(request.getLastName());
        
        if (request.getEmail() != null && !request.getEmail().equals(customer.getEmail())) {
            // Optional: Check if email is already in use
            customer.setEmail(request.getEmail());
        }

        Customer updated = customerPersistencePort.save(customer);
        return CustomerResponse.fromEntity(updated);
    }
}
