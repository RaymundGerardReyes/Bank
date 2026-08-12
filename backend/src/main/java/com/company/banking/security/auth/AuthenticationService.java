package com.company.banking.security.auth;

import com.company.banking.customer.api.dto.CustomerResponse;
import com.company.banking.customer.application.port.out.CustomerPersistencePort;
import com.company.banking.customer.domain.Customer;
import com.company.banking.security.auth.dto.AuthenticationRequest;
import com.company.banking.security.auth.dto.AuthenticationResponse;
import com.company.banking.security.jwt.JwtTokenProvider;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthenticationService {

    private final CustomerPersistencePort customerPersistencePort;
    private final JwtTokenProvider jwtTokenProvider;
    private final AuthenticationManager authenticationManager;
    private final LoginAttemptService loginAttemptService;

    public AuthenticationResponse authenticate(AuthenticationRequest request) {
        // SANITIZE: Normalize to lowercase and trim so login always works regardless of typos/case
        String normalizedEmail = request.getEmail().trim().toLowerCase();

        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            normalizedEmail,
                            request.getPassword()
                    )
            );
        } catch (org.springframework.security.core.AuthenticationException e) {
            // AFASA SECURITY: Track failed login attempts
            loginAttemptService.loginFailed(normalizedEmail);
            throw e;
        }

        // Clear previous failed attempts on success
        loginAttemptService.loginSucceeded(normalizedEmail);

        Customer customer = customerPersistencePort.findByEmail(normalizedEmail)
                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + normalizedEmail));

        String jwtToken = jwtTokenProvider.generateToken(customer);
        
        // Pass the mapped Customer details into the final response
        return AuthenticationResponse.bearer(jwtToken, CustomerResponse.fromEntity(customer));
    }

    public AuthenticationResponse verifyFace(com.company.banking.security.auth.dto.FaceVerificationRequest request) {
        if (request.getEmbedding() == null || request.getEmbedding().isEmpty()) {
            throw new IllegalArgumentException("Invalid face embedding vector");
        }
        
        // Mock: Find a default active customer for Face ID authentication
        Customer customer = customerPersistencePort.findById(1L)
                .orElseThrow(() -> new RuntimeException("No suitable user found for biometric login mock"));

        String jwtToken = jwtTokenProvider.generateToken(customer);
        return AuthenticationResponse.bearer(jwtToken, CustomerResponse.fromEntity(customer));
    }
}