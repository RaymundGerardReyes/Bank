package com.company.banking.config;

import com.company.banking.account.domain.Account;
import com.company.banking.account.infrastructure.AccountJpaRepository;
import com.company.banking.common.enums.AccountStatus;
import com.company.banking.common.enums.RoleType;
import com.company.banking.customer.domain.Customer;
import com.company.banking.customer.infrastructure.CustomerJpaRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataInitializer implements CommandLineRunner {

    private final CustomerJpaRepository customerJpaRepository;
    private final AccountJpaRepository accountJpaRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        String testEmail = "user@example.com";
        if (customerJpaRepository.findByEmail(testEmail).isEmpty()) {
            log.info("Seeding initial demo customer: {}", testEmail);
            Customer customer = Customer.builder()
                    .email(testEmail)
                    .password(passwordEncoder.encode("Password123!"))
                    .firstName("Raymund")
                    .lastName("Reyes")
                    .role(RoleType.CUSTOMER)
                    .build();
            Customer savedCustomer = customerJpaRepository.save(customer);

            Account account = Account.builder()
                    .accountNumber("ACC-100200300")
                    .customerId(savedCustomer.getId())
                    .balance(new BigDecimal("5000.00"))
                    .currency("USD")
                    .status(AccountStatus.ACTIVE)
                    .build();
            accountJpaRepository.save(account);

            log.info("Successfully seeded demo user [{}] with password [Password123!] and account [ACC-100200300]", testEmail);
        } else {
            log.info("Demo user [{}] already exists. Skipping data initialization.", testEmail);
        }
    }
}
