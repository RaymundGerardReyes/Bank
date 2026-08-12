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

    @Override
    @Transactional
    public CustomerResponse createCustomer(CustomerCreateRequest request) {
        // SANITIZE: Normalize email to lowercase and trim whitespace before persisting.
        // This ensures forgotPassword and login lookups always match stored values.
        String normalizedEmail = request.getEmail().trim().toLowerCase();

        if (customerPersistencePort.existsByEmail(normalizedEmail)) {
            throw new BusinessException(ErrorCode.INVALID_REQUEST, "Email is already registered");
        }

        // RISK CALCULATION: Basic CDD check
        String riskProfile = "LOW";
        if ("Unemployed".equalsIgnoreCase(request.getEmploymentStatus()) || 
            (request.getMonthlyIncome() != null && request.getMonthlyIncome().contains(">"))) {
            riskProfile = "HIGH";
        } else if ("Self-Employed".equalsIgnoreCase(request.getEmploymentStatus())) {
            riskProfile = "MEDIUM";
        }

        Customer customer = Customer.builder()
                .firstName(request.getFirstName().trim())
                .lastName(request.getLastName().trim())
                .email(normalizedEmail)
                .password(passwordEncoder.encode(request.getPassword()))
                .role(RoleType.CUSTOMER)
                .employmentStatus(request.getEmploymentStatus())
                .jobTitle(request.getJobTitle())
                .monthlyIncome(request.getMonthlyIncome())
                .sourceOfFunds(request.getSourceOfFunds())
                .kycStatus("PENDING_VERIFICATION")
                .riskProfile(riskProfile)
                .locked(false)
                .build();

        Customer saved = customerPersistencePort.save(customer);

        // NOTE: Account provisioning is DEFERRED until an Admin/Compliance Officer approves the KYC.
        // The Maker-Checker workflow is enforced.
        
        return CustomerResponse.fromEntity(saved);
    }
}
