package com.company.banking.customer.application.port.out;

import com.company.banking.customer.domain.Customer;

import java.util.Optional;

public interface CustomerPersistencePort {
    Customer save(Customer customer);
    Optional<Customer> findById(Long id);
    Optional<Customer> findByEmail(String email);
    boolean existsByEmail(String email);
}
