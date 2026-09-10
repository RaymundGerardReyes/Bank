package com.company.banking.security.auth;

import com.company.banking.notification.application.port.out.EmailPort;
import com.company.banking.security.auth.dto.OtpRequest;
import com.company.banking.security.mfa.OtpService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
public class AuthenticationOtpIT {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private OtpService otpService;

    @MockitoBean
    private EmailPort emailPort;

    private final String TEST_EMAIL = "director.audit@novabank.com";

    @BeforeEach
    public void setUp() {
        otpService.clearCache();
        reset(emailPort);
    }

    @Test
    @DisplayName("Single-Flight: Rapid duplicate /otp/send calls dispatch exactly ONE SMTP email")
    public void testRapidDuplicateSendOtp_DispatchesOnlyOneEmail() throws Exception {
        OtpRequest request = new OtpRequest();
        request.setEmail(TEST_EMAIL);

        // First call triggers generation and SMTP dispatch
        mockMvc.perform(post("/api/v1/auth/otp/send")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true));

        // Rapid duplicate call (simulating React StrictMode double-mount or double click)
        mockMvc.perform(post("/api/v1/auth/otp/send")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true));

        // CRITICAL INVARIANT: emailPort must only have been invoked EXACTLY ONCE
        verify(emailPort, times(1)).sendEmail(eq(TEST_EMAIL), anyString(), anyString());
    }

    @Test
    @DisplayName("Verify OTP: Valid code succeeds and burns the OTP")
    public void testVerifyOtpSuccessAndSingleUse() throws Exception {
        String code = otpService.generateOtp(TEST_EMAIL);

        OtpRequest verifyRequest = new OtpRequest();
        verifyRequest.setEmail(TEST_EMAIL);
        verifyRequest.setCode(code);

        // First verification succeeds
        mockMvc.perform(post("/api/v1/auth/otp/verify")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(verifyRequest)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true));

        // Reusing the same burned code must be rejected
        mockMvc.perform(post("/api/v1/auth/otp/verify")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(verifyRequest)))
                .andExpect(status().isForbidden());
    }
}

