package com.company.banking.security.auth;

import com.company.banking.common.response.ApiResponse;
import com.company.banking.security.auth.dto.AuthenticationRequest;
import com.company.banking.security.auth.dto.AuthenticationResponse;
import com.company.banking.security.auth.dto.OtpRequest;
import com.company.banking.security.mfa.OtpService;
import com.company.banking.security.mfa.OtpVerificationService;
import com.company.banking.notification.application.SendOtpNotificationService;
import com.company.banking.web.filter.CorrelationIdFilter;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.slf4j.MDC;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.company.banking.customer.api.dto.CustomerCreateRequest;
import com.company.banking.customer.api.dto.CustomerResponse;
import com.company.banking.customer.application.port.in.CreateCustomerUseCase;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
public class AuthenticationController {

    private final AuthenticationService authenticationService;
    private final CreateCustomerUseCase createCustomerUseCase;
    private final OtpService otpService;
    private final OtpVerificationService otpVerificationService;
    private final SendOtpNotificationService sendOtpNotificationService;

    @PostMapping("/register")
    public ResponseEntity<ApiResponse<CustomerResponse>> register(@Valid @RequestBody CustomerCreateRequest request) {
        String correlationId = MDC.get(CorrelationIdFilter.MDC_KEY);
        CustomerResponse response = createCustomerUseCase.createCustomer(request);
        return ResponseEntity.ok(ApiResponse.success(response, "Customer registered successfully", correlationId));
    }

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<AuthenticationResponse>> login(@Valid @RequestBody AuthenticationRequest request) {
        String correlationId = MDC.get(CorrelationIdFilter.MDC_KEY);
        AuthenticationResponse response = authenticationService.authenticate(request);
        return ResponseEntity.ok(ApiResponse.success(response, "Authentication successful", correlationId));
    }

    // NEW: Endpoint to generate and email the OTP
    @PostMapping("/otp/send")
    public ResponseEntity<ApiResponse<Void>> sendOtp(@Valid @RequestBody OtpRequest request) {
        String correlationId = MDC.get(CorrelationIdFilter.MDC_KEY);
        
        // Generate the 6-digit code linked to the user's email
        String code = otpService.generateOtp(request.getEmail());
        
        // Dispatch via Google SMTP
        sendOtpNotificationService.sendOtp(request.getEmail(), code);
        
        return ResponseEntity.ok(ApiResponse.success(null, "OTP sent to your email", correlationId));
    }

    // NEW: Endpoint to verify the OTP
    @PostMapping("/otp/verify")
    public ResponseEntity<ApiResponse<Void>> verifyOtp(@Valid @RequestBody OtpRequest request) {
        String correlationId = MDC.get(CorrelationIdFilter.MDC_KEY);
        
        // This will throw a ForbiddenException if the code is wrong or expired
        otpVerificationService.verify(request.getEmail(), request.getCode());
        
        return ResponseEntity.ok(ApiResponse.success(null, "OTP verified successfully", correlationId));
    }

    // NEW: Endpoint to handle session logout
    @PostMapping("/logout")
    public ResponseEntity<ApiResponse<Void>> logout() {
        String correlationId = MDC.get(CorrelationIdFilter.MDC_KEY);
        return ResponseEntity.ok(ApiResponse.success(null, "Logout successful", correlationId));
    }
}