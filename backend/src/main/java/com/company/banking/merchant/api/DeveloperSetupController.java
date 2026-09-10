package com.company.banking.merchant.api;

import com.company.banking.merchant.api.dto.DeveloperOnboardingRequest;
import com.company.banking.merchant.api.dto.DeveloperOnboardingResponse;
import com.company.banking.merchant.application.DeveloperOnboardingService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import org.springframework.security.core.Authentication;
import com.company.banking.customer.application.port.out.CustomerPersistencePort;
import com.company.banking.customer.domain.Customer;

import com.company.banking.common.exception.ForbiddenException;
import com.company.banking.common.exception.NotFoundException;

@RestController
@RequestMapping("/api/v1/developer/setup")
@RequiredArgsConstructor
public class DeveloperSetupController {

    private final DeveloperOnboardingService onboardingService;
    private final CustomerPersistencePort customerPersistencePort;

    private Long resolveCustomerId(Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new ForbiddenException("Authentication required to onboard developer");
        }
        Object principal = authentication.getPrincipal();
        if (principal instanceof Long) {
            return (Long) principal;
        }
        String name = authentication.getName();
        try {
            return Long.parseLong(name);
        } catch (Exception e) {
            return customerPersistencePort.findByEmail(name)
                    .map(Customer::getId)
                    .orElseThrow(() -> new NotFoundException("Customer profile not found for user: " + name));
        }
    }

    @PostMapping("/onboard")
    @ResponseStatus(HttpStatus.CREATED)
    public DeveloperOnboardingResponse onboardNewDeveloper(@Valid @RequestBody DeveloperOnboardingRequest request, Authentication authentication) {
        Long customerId = resolveCustomerId(authentication);
        return onboardingService.onboardDeveloper(customerId, request);
    }
}
