package com.company.banking.security.auth;

import com.company.banking.customer.domain.Customer;
import com.company.banking.customer.infrastructure.CustomerJpaRepository;
import com.company.banking.common.enums.RoleType;
import com.company.banking.notification.application.port.out.EmailPort;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.http.MediaType;
import com.company.banking.customer.application.port.out.CustomerPersistencePort;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import java.util.HashMap;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
public class AuthenticationForgotPasswordIT {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private CustomerJpaRepository customerJpaRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private PasswordResetTokenService passwordResetTokenService;

    @Autowired
    private CustomerPersistencePort customerPersistencePort;

    @MockitoBean
    private EmailPort emailPort;

    private final String REGISTERED_EMAIL = "valid.user@novabank.com";
    private final String UNREGISTERED_EMAIL = "paymond@gmail.com";

    @BeforeEach
    public void setup() {
        customerJpaRepository.deleteAll();
        reset(emailPort);

        // Seed registered customer
        Customer customer = Customer.builder()
                .email(REGISTERED_EMAIL)
                .password(passwordEncoder.encode("OldPassword123!"))
                .firstName("Test")
                .lastName("User")
                .role(RoleType.CUSTOMER)
                .kycStatus("ACTIVE")
                .riskProfile("LOW")
                .locked(false)
                .build();
        customerPersistencePort.save(customer);
    }

    @Test
    @DisplayName("Sanity Validation 1: Blank Email Should Return 400 Bad Request")
    public void blankEmail_ShouldReturn400() throws Exception {
        Map<String, String> request = new HashMap<>();
        request.put("email", "");

        mockMvc.perform(post("/api/v1/auth/forgot-password")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest());

        verifyNoInteractions(emailPort);
    }

    @Test
    @DisplayName("Sanity Validation 2: Invalid Email Syntax Should Return 400 Bad Request")
    public void invalidEmailFormat_ShouldReturn400() throws Exception {
        Map<String, String> request = new HashMap<>();
        request.put("email", "not-an-email-address");

        mockMvc.perform(post("/api/v1/auth/forgot-password")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest());

        verifyNoInteractions(emailPort);
    }

    @Test
    @DisplayName("Sanity Validation 3: Unregistered Email Returns Silent 200 without Dispatching SMTP Email")
    public void unregisteredEmail_ShouldReturnSilent200AndNotSendEmail() throws Exception {
        Map<String, String> request = new HashMap<>();
        request.put("email", UNREGISTERED_EMAIL);

        mockMvc.perform(post("/api/v1/auth/forgot-password")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.message").value("If an account exists with that email, a password reset link has been sent."));

        // ABSOLUTE SANITY CHECK: Ensure NO SMTP dispatch call was triggered for unregistered email
        verify(emailPort, never()).sendEmail(anyString(), anyString(), anyString());
    }

    @Test
    @DisplayName("Sanity Validation 4: Registered Email Dispatches Email and Enables Password Reset")
    public void registeredEmail_ShouldDispatchEmailAndAllowPasswordReset() throws Exception {
        Map<String, String> forgotRequest = new HashMap<>();
        forgotRequest.put("email", REGISTERED_EMAIL);

        mockMvc.perform(post("/api/v1/auth/forgot-password")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(forgotRequest)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.message").value("If an account exists with that email, a password reset link has been sent."));

        // ABSOLUTE SANITY CHECK: Ensure emailPort WAS called with exact recipient and subject
        verify(emailPort, times(1)).sendEmail(eq(REGISTERED_EMAIL), contains("Password Reset Link"), contains("/reset-password?token="));

        // Generate token programmatically to verify end-to-end reset capability
        String token = passwordResetTokenService.generateResetToken(REGISTERED_EMAIL);
        assertNotNull(token);

        Map<String, String> resetRequest = new HashMap<>();
        resetRequest.put("token", token);
        resetRequest.put("newPassword", "NewPassword456!");

        mockMvc.perform(post("/api/v1/auth/reset-password")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(resetRequest)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.message").value("Password reset successfully"));

        // Verify password was updated in database
        Customer updatedCustomer = customerPersistencePort.findByEmail(REGISTERED_EMAIL).orElseThrow();
        assertTrue(passwordEncoder.matches("NewPassword456!", updatedCustomer.getPassword()));

        // SANITY CHECK: Re-using the same reset token must fail
        mockMvc.perform(post("/api/v1/auth/reset-password")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(resetRequest)))
                .andExpect(status().isBadRequest());
    }
}
