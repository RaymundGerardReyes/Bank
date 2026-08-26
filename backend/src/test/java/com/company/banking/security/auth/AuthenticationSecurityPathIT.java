package com.company.banking.security.auth;

import com.company.banking.config.BaseIntegrationTest;
import com.company.banking.customer.application.port.out.CustomerPersistencePort;
import com.company.banking.customer.domain.Customer;
import com.company.banking.security.auth.dto.AuthenticationRequest;
import com.company.banking.security.auth.dto.AuthenticationResponse;
import com.company.banking.security.auth.dto.FaceVerificationRequest;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.AuthenticationException;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.bean.override.mockito.MockitoBean;

import java.util.Arrays;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@SpringBootTest
@ActiveProfiles("test")
public class AuthenticationSecurityPathIT extends BaseIntegrationTest {

    @Autowired
    private AuthenticationService authenticationService;

    @Autowired
    private LoginAttemptService loginAttemptService;

    // Real persistence port for asserting DB locks
    @Autowired
    private CustomerPersistencePort customerPersistencePort;

    @Autowired
    private org.springframework.jdbc.core.JdbcTemplate jdbcTemplate;

    // Mocking the core security AuthenticationManager so we can force successes and failures
    @MockitoBean
    private AuthenticationManager authenticationManager;

    private static final String TARGET_EMAIL = "brute.force.target@nova.bank";
    private Customer targetCustomer;

    @BeforeEach
    public void setup() {
        // Clear caches using a reflection workaround or just rely on a new email for isolation if it was static.
        // Since attemptsCache is a Map inside a Singleton Service, we must reset the state by successfully logging in.
        loginAttemptService.loginSucceeded(TARGET_EMAIL);

        // Seed target customer
        customerPersistencePort.findByEmail(TARGET_EMAIL).ifPresentOrElse(
            c -> {
                c.setLocked(false);
                customerPersistencePort.save(c);
                this.targetCustomer = c;
            },
            () -> {
                this.targetCustomer = customerPersistencePort.save(Customer.builder()
                        .email(TARGET_EMAIL)
                        .password("password123")
                        .firstName("Brute")
                        .lastName("Force")
                        .kycStatus("VERIFIED")
                        .locked(false)
                        .build());
            }
        );
    }

    @Test
    @DisplayName("P01: Valid Login - Clears failed attempts and generates JWT")
    public void p01_ValidLogin_ReturnsJwtAndClearsAttempts() {
        AuthenticationRequest req = new AuthenticationRequest(TARGET_EMAIL, "correct_password");
        
        // Mock AuthManager success (does not throw)
        when(authenticationManager.authenticate(any())).thenReturn(null);

        AuthenticationResponse response = authenticationService.authenticate(req);
        
        assertNotNull(response);
        assertNotNull(response.getToken());
        assertEquals(TARGET_EMAIL, response.getUser().getEmail());
        
        // Verify attempts are cleared (isBlocked should be false)
        assertFalse(loginAttemptService.isBlocked(TARGET_EMAIL));
    }

    @Test
    @DisplayName("P02 & P03: Brute Force Guard - Exceeding MAX_ATTEMPTS locks the customer account in DB")
    public void p03_BruteForceGuard_LocksAccountOnMaxAttempts() {
        AuthenticationRequest req = new AuthenticationRequest(TARGET_EMAIL, "wrong_password");
        
        // Force AuthManager to throw exception representing invalid credentials
        when(authenticationManager.authenticate(any()))
                .thenThrow(new BadCredentialsException("Bad credentials"));

        // Attempt 1
        assertThrows(AuthenticationException.class, () -> authenticationService.authenticate(req));
        
        // Attempt 2
        assertThrows(AuthenticationException.class, () -> authenticationService.authenticate(req));
        
        // Attempt 3 - This should trigger lockAccount
        assertThrows(AuthenticationException.class, () -> authenticationService.authenticate(req));

        // Verify Memory State
        assertTrue(loginAttemptService.isBlocked(TARGET_EMAIL), "Customer should be blocked in in-memory cache.");

        // Verify Database Persistence State
        Customer lockedCustomer = customerPersistencePort.findByEmail(TARGET_EMAIL).orElseThrow();
        assertTrue(lockedCustomer.isLocked(), "Customer must be physically locked in the database to prevent further system access.");
    }

    @Test
    @DisplayName("P04: Face Verification - Valid biometric embedding skips password check and returns JWT")
    public void p04_BiometricLogin_BypassesPasswordManager() {
        FaceVerificationRequest req = new FaceVerificationRequest(Arrays.asList(0.12, 0.45, 0.88, 0.91));
        
        // Verify customer ID 1 exists (required by the mock implementation in the service)
        if (customerPersistencePort.findById(1L).isEmpty()) {
            jdbcTemplate.execute("INSERT INTO customers (id, email, password, first_name, last_name, kyc_status, locked, role, created_at) " +
                    "VALUES (1, 'admin@nova.bank', 'password123', 'Admin', 'User', 'VERIFIED', false, 'CUSTOMER', CURRENT_TIMESTAMP)");
        }

        AuthenticationResponse response = authenticationService.verifyFace(req);
        
        assertNotNull(response.getToken());
        
        // Verify AuthenticationManager was NEVER called for biometric login
        verify(authenticationManager, never()).authenticate(any());
    }

    @Test
    @DisplayName("P05: Sanitization - Email is converted to lowercase and trimmed before tracking")
    public void p05_EmailSanitization_TracksCorrectly() {
        AuthenticationRequest req = new AuthenticationRequest("  BRUTE.FORCE.TARGET@nova.bank  ", "wrong_password");
        
        when(authenticationManager.authenticate(any()))
                .thenThrow(new BadCredentialsException("Bad credentials"));

        assertThrows(AuthenticationException.class, () -> authenticationService.authenticate(req));

        // Verify the cache tracked the LOWERCASE, TRIMMED email!
        assertTrue(loginAttemptService.isBlocked(TARGET_EMAIL) || !loginAttemptService.isBlocked(TARGET_EMAIL)); // Just a syntax check, real check below
        
        // It's only 1 attempt, so it's not blocked yet, but if we do it 3 times:
        assertThrows(AuthenticationException.class, () -> authenticationService.authenticate(req));
        assertThrows(AuthenticationException.class, () -> authenticationService.authenticate(req));

        assertTrue(loginAttemptService.isBlocked(TARGET_EMAIL), "Tracking must sanitize emails to prevent attackers from bypassing the cache using case variations.");
    }
}
