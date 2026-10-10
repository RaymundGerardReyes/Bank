package com.company.banking.security.auth.infrastructure;

import com.company.banking.customer.api.dto.CustomerResponse;
import com.company.banking.customer.application.port.out.CustomerPersistencePort;
import com.company.banking.customer.domain.Customer;
import com.company.banking.security.auth.LoginAttemptService;
import com.company.banking.security.auth.application.port.out.BiometricAuthenticationPort;
import com.company.banking.security.auth.dto.AuthenticationResponse;
import com.company.banking.security.auth.dto.FaceVerificationRequest;
import com.company.banking.security.jwt.JwtTokenProvider;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.security.authentication.LockedException;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Component;
import org.springframework.context.annotation.Primary;

/**
 * Test-only mock adapter conforming to Hexagonal Architecture adapter hygiene.
 * Active strictly in test profiles with explicit mock configuration.
 */
@Component
@Primary
@ConditionalOnProperty(name = "banking.security.biometric.provider", havingValue = "mock", matchIfMissing = false)
@RequiredArgsConstructor
public class MockBiometricAuthenticationAdapter implements BiometricAuthenticationPort {

    private final CustomerPersistencePort customerPersistencePort;
    private final JwtTokenProvider jwtTokenProvider;
    private final LoginAttemptService loginAttemptService;

    @Override
    public AuthenticationResponse authenticateBiometric(FaceVerificationRequest request) {
        if (request.getEmbedding() == null || request.getEmbedding().isEmpty()) {
            throw new IllegalArgumentException("Invalid face embedding vector");
        }

        Customer customer;
        if (request.getEmail() != null && !request.getEmail().trim().isEmpty()) {
            String normalizedEmail = request.getEmail().trim().toLowerCase();
            if (loginAttemptService.isBlocked(normalizedEmail)) {
                throw new LockedException("Customer account is locked due to excessive failed attempts");
            }
            customer = customerPersistencePort.findByEmail(normalizedEmail)
                    .orElseThrow(() -> new UsernameNotFoundException("User not found: " + normalizedEmail));
        } else {
            customer = customerPersistencePort.findById(1L)
                    .orElseThrow(() -> new UsernameNotFoundException("No active customer profile found for biometric verification"));
        }

        if (customer.isLocked()) {
            throw new LockedException("Customer account is locked");
        }

        String jwtToken = jwtTokenProvider.generateToken(customer);
        return AuthenticationResponse.bearer(jwtToken, CustomerResponse.fromEntity(customer));
    }
}

