package com.company.banking.customer.application;

import com.company.banking.common.enums.RoleType;
import com.company.banking.common.exception.BusinessException;
import com.company.banking.common.exception.ErrorCode;
import com.company.banking.common.exception.NotFoundException;
import com.company.banking.customer.api.dto.CustomerCreateRequest;
import com.company.banking.customer.api.dto.CustomerResponse;
import com.company.banking.customer.application.port.in.CreateCustomerUseCase;
import com.company.banking.customer.application.port.out.CustomerPersistencePort;
import com.company.banking.customer.domain.Customer;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.company.banking.account.application.port.in.OpenAccountUseCase;
import com.company.banking.account.api.dto.OpenAccountRequest;
import com.company.banking.account.api.dto.AccountResponse;
import com.company.banking.transaction.application.port.in.DepositUseCase;
import com.company.banking.transaction.api.dto.DepositRequest;
import java.math.BigDecimal;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class CreateCustomerService implements CreateCustomerUseCase {

    private final CustomerPersistencePort customerPersistencePort;
    private final PasswordEncoder passwordEncoder;
    private final OpenAccountUseCase openAccountUseCase;
    private final DepositUseCase depositUseCase;

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
                .employmentStatus(request.getEmploymentStatus())
                .jobTitle(request.getJobTitle())
                .monthlyIncome(request.getMonthlyIncome())
                .sourceOfFunds(request.getSourceOfFunds())
                .kycStatus("ACTIVE")
                .build();

        Customer saved = customerPersistencePort.save(customer);

        // Provision default checking account for new user (0 balance)
        AccountResponse newAccount = openAccountUseCase.openAccount(OpenAccountRequest.builder()
                .customerId(saved.getId())
                .currency("USD")
                .build());

        // Process formal ledger entry for demo onboarding bonus
        depositUseCase.deposit(DepositRequest.builder()
                .accountNumber(newAccount.getAccountNumber())
                .amount(BigDecimal.valueOf(5000.00))
                .idempotencyKey("ONBOARD-BONUS-" + UUID.randomUUID())
                .build());

        return CustomerResponse.fromEntity(saved);
    }
}
