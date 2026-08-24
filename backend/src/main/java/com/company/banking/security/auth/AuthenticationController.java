package com.company.banking.security.auth;

import com.company.banking.common.exception.BusinessException;
import com.company.banking.common.exception.ErrorCode;
import com.company.banking.common.response.ApiResponse;
import com.company.banking.security.auth.dto.AuthenticationRequest;
import com.company.banking.security.auth.dto.AuthenticationResponse;
import com.company.banking.security.auth.dto.OtpRequest;
import com.company.banking.security.mfa.OtpService;
import com.company.banking.security.mfa.OtpVerificationService;
import com.company.banking.notification.application.SendOtpNotificationService;
import com.company.banking.notification.application.port.out.EmailPort;
import com.company.banking.security.auth.dto.ForgotPasswordRequest;
import com.company.banking.web.filter.CorrelationIdFilter;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.slf4j.MDC;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.company.banking.customer.api.dto.CustomerCreateRequest;
import com.company.banking.customer.api.dto.CustomerResponse;
import com.company.banking.customer.application.port.in.CreateCustomerUseCase;

import com.company.banking.customer.application.port.out.CustomerPersistencePort;
import com.company.banking.customer.domain.Customer;
import com.company.banking.security.auth.dto.ResetPasswordRequest;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

@Slf4j
@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
public class AuthenticationController {

    private final AuthenticationService authenticationService;
    private final CreateCustomerUseCase createCustomerUseCase;
    private final OtpService otpService;
    private final OtpVerificationService otpVerificationService;
    private final SendOtpNotificationService sendOtpNotificationService;
    private final EmailPort emailPort;
    private final PasswordResetTokenService passwordResetTokenService;
    private final CustomerPersistencePort customerPersistencePort;
    private final PasswordEncoder passwordEncoder;

    @Value("${NEXT_PUBLIC_APP_URL:http://localhost:3000}")
    private String frontendUrl;

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

    @PostMapping("/verify-face")
    public ResponseEntity<ApiResponse<AuthenticationResponse>> verifyFace(@Valid @RequestBody com.company.banking.security.auth.dto.FaceVerificationRequest request) {
        String correlationId = MDC.get(CorrelationIdFilter.MDC_KEY);
        AuthenticationResponse response = authenticationService.verifyFace(request);
        return ResponseEntity.ok(ApiResponse.success(response, "Biometric authentication successful", correlationId));
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

    // NEW: Endpoint to trigger password reset link via Google SMTP
    @PostMapping("/forgot-password")
    public ResponseEntity<ApiResponse<Void>> forgotPassword(@Valid @RequestBody ForgotPasswordRequest request) {
        String correlationId = MDC.get(CorrelationIdFilter.MDC_KEY);
        
        // SANITIZE: Trim whitespace and normalize to lowercase to prevent case-sensitivity mismatches
        String sanitizedEmail = request.getEmail().trim().toLowerCase();
        
        log.info("[FORGOT-PASSWORD] Reset requested for email: {}", sanitizedEmail);
        Optional<Customer> customerOpt = customerPersistencePort.findByEmail(sanitizedEmail);
        
        // Use a single unified message to prevent email enumeration attacks
        String standardMessage = "If an account exists with that email, a password reset link has been sent.";

        if (customerOpt.isEmpty()) {
            log.warn("[FORGOT-PASSWORD] No account found for email '{}'. Returning silent 200.", sanitizedEmail);
            return ResponseEntity.ok(ApiResponse.success(null, standardMessage, correlationId));
        }

        // FIX: Extract the guaranteed-correct email string directly from the database entity
        String exactDbEmail = customerOpt.get().getEmail();
        log.info("[FORGOT-PASSWORD] Account found for '{}'. Generating reset token and dispatching email.", exactDbEmail);
        
        String token = passwordResetTokenService.generateResetToken(exactDbEmail);
        String resetUrl = frontendUrl + "/reset-password?token=" + token;
        
        String subject = "NovaBank Security: Password Reset Link";
        String message = "Hello,\n\n" +
                         "We received a request to reset your NovaBank account password.\n\n" +
                         "Please click the secure link below to reset your password:\n" +
                         resetUrl + "\n\n" +
                         "This link will expire in 15 minutes. If you did not request a password reset, please ignore this email.";
        
        // 2. Dispatch the email using the exact database email
        emailPort.sendEmail(exactDbEmail, subject, message);
        log.info("[FORGOT-PASSWORD] emailPort.sendEmail() dispatched (async) to: {}", exactDbEmail);
        
        // 3. Return the EXACT SAME standard message for successful dispatches
        return ResponseEntity.ok(ApiResponse.success(null, standardMessage, correlationId));
    }

    // NEW: Endpoint to reset password using token
    @PostMapping("/reset-password")
    public ResponseEntity<ApiResponse<Void>> resetPassword(@Valid @RequestBody ResetPasswordRequest request) {
        String correlationId = MDC.get(CorrelationIdFilter.MDC_KEY);
        
        // This will now atomically fetch and burn the token, throwing a clean 400 Bad Request if it fails
        String email = passwordResetTokenService.validateTokenAndGetEmail(request.getToken());
        
        Customer customer = customerPersistencePort.findByEmail(email)
                .orElseThrow(() -> new BusinessException(ErrorCode.RESOURCE_NOT_FOUND, "User not found."));
                
        customer.setPassword(passwordEncoder.encode(request.getNewPassword()));
        customer.setLocked(false);
        customerPersistencePort.save(customer);
        
        // NOTE: passwordResetTokenService.consumeToken() has been removed because it is now handled atomically above.
        
        return ResponseEntity.ok(ApiResponse.success(null, "Password reset successfully", correlationId));
    }
    // NEW: Endpoint to handle session logout
    @PostMapping("/logout")
    public ResponseEntity<ApiResponse<Void>> logout() {
        String correlationId = MDC.get(CorrelationIdFilter.MDC_KEY);
        return ResponseEntity.ok(ApiResponse.success(null, "Logout successful", correlationId));
    }

    // DEBUG ENDPOINT: To prove to the user exactly what emails are in the DB
    @GetMapping("/debug/emails")
    public ResponseEntity<java.util.List<String>> debugListEmails(
            @org.springframework.beans.factory.annotation.Autowired com.company.banking.customer.infrastructure.CustomerJpaRepository repo) {
        // We will fetch all customers and return their exact email strings directly from the DB
        java.util.List<String> emails = repo.findAll().stream().map(Customer::getEmail).toList();
        return ResponseEntity.ok(emails);
    }
}