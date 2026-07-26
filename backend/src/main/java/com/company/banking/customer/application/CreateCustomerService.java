package com.company.banking.customer.application;

import com.company.banking.common.enums.RoleType;
import com.company.banking.common.exception.BusinessException;
import com.company.banking.common.exception.ErrorCode;
import com.company.banking.common.exception.NotFoundException;
import com.company.banking.customer.api.dto.CustomerCreateRequest;
import com.company.banking.customer.api.dto.CustomerResponse;
import com.company.banking.customer.application.port.in.CustomerUseCase;
import com.company.banking.customer.application.port.out.CustomerPersistencePort;
import com.company.banking.customer.domain.Customer;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class CreateCustomerService implements CustomerUseCase {

    private final CustomerPersistencePort customerPersistencePort;
    private final PasswordEncoder passwordEncoder;

    @Override
    @Transactional
    public CustomerResponse createCustomer(CustomerCreateRequest request) {
        if (customerPersistencePort.existsByEmail(request.getEmail())) {
            throw new BusinessException(ErrorCode.INVALID_REQUEST, "Email is already registered");
        }

        Customer customer = Customer.builder()
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(RoleType.CUSTOMER)
                .build();

        Customer saved = customerPersistencePort.save(customer);
        return CustomerResponse.fromEntity(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public CustomerResponse getCustomerProfile(Long id) {
        Customer customer = customerPersistencePort.findById(id)
                .orElseThrow(() -> new NotFoundException("Customer not found with id: " + id));

        return CustomerResponse.fromEntity(customer);
    }
}
