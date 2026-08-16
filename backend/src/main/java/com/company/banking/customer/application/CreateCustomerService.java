package com.company.banking.customer.application;

import com.company.banking.account.api.dto.OpenAccountRequest;
import com.company.banking.account.application.port.in.OpenAccountUseCase;
import com.company.banking.common.enums.RoleType;
import com.company.banking.customer.api.dto.CustomerCreateRequest;
import com.company.banking.customer.api.dto.CustomerResponse;
import com.company.banking.customer.application.port.in.CreateCustomerUseCase;
import com.company.banking.customer.application.port.out.CustomerPersistencePort;
import com.company.banking.customer.domain.Customer;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class CreateCustomerService implements CreateCustomerUseCase {

    private final CustomerPersistencePort customerPersistencePort;
    private final PasswordEncoder passwordEncoder;
    private final OpenAccountUseCase openAccountUseCase;

    @Override
    @Transactional
    public CustomerResponse createCustomer(CustomerCreateRequest request) {
        // 1. Create and persist the customer with the strongly-typed RoleType enum
        Customer customer = Customer.builder()
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .email(request.getEmail().toLowerCase().trim())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(RoleType.CUSTOMER)
                .build();

        Customer savedCustomer = customerPersistencePort.save(customer);

        // 2. Auto-provision the primary master account for the newly registered customer
        OpenAccountRequest accountRequest = OpenAccountRequest.builder()
                .customerId(savedCustomer.getId())
                .accountType("MAIN")
                .currency("PHP")
                .build();

        openAccountUseCase.openAccount(accountRequest);

        return CustomerResponse.fromEntity(savedCustomer);
    }
}