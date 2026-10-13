package com.company.banking.security.auth.infrastructure;

import com.company.banking.common.audit.AuditEventPublisher;
import com.company.banking.customer.application.port.out.CustomerPersistencePort;
import com.company.banking.security.auth.DeviceAuthenticationService;
import com.company.banking.security.auth.LoginAttemptService;
import com.company.banking.security.auth.application.port.out.BiometricAuthenticationPort;
import com.company.banking.security.auth.dto.AuthenticationResponse;
import com.company.banking.security.auth.dto.DeviceLoginRequest;
import com.company.banking.security.auth.dto.FaceVerificationRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.LockedException;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Slf4j
public class ProductionBiometricAuthenticationAdapter implements BiometricAuthenticationPort {

    private final DeviceAuthenticationService deviceAuthenticationService;
    private final CustomerPersistencePort customerPersistencePort;
    private final LoginAttemptService loginAttemptService;
    private final AuditEventPublisher auditEventPublisher;

    @Override
    public AuthenticationResponse authenticateBiometric(FaceVerificationRequest request) {
        // If device-bound cryptographic credentials are provided in the verification request, route securely
        if (request.getDeviceId() != null && !request.getDeviceId().trim().isEmpty() &&
            request.getChallenge() != null && !request.getChallenge().trim().isEmpty() &&
            request.getSignature() != null && !request.getSignature().trim().isEmpty()) {
            DeviceLoginRequest deviceLoginReq = DeviceLoginRequest.builder()
                    .deviceId(request.getDeviceId().trim())
                    .challenge(request.getChallenge().trim())
                    .signature(request.getSignature().trim())
                    .build();
            return deviceAuthenticationService.loginWithDevice(deviceLoginReq);
        }

        // Mandatory containment: standalone client-supplied embeddings, synthetic users, and unverified face matches
        // are strictly prohibited from issuing authenticated sessions in production.
        String target = request.getEmail() != null ? request.getEmail().trim().toLowerCase() : "anonymous";

        // Rule 26: Reject locked customer accounts with LockedException (mapped to HTTP 423)
        if (request.getEmail() != null && !request.getEmail().trim().isEmpty()) {
            if (loginAttemptService.isBlocked(target)) {
                log.warn("[SECURITY] Biometric verification attempted on blocked account: {}", target);
                throw new LockedException("Customer account is locked due to excessive failed attempts");
            }
            customerPersistencePort.findByEmail(target).ifPresent(c -> {
                if (c.isLocked()) {
                    log.warn("[SECURITY] Biometric verification attempted on locked account: {}", target);
                    throw new LockedException("Customer account is locked");
                }
            });
            loginAttemptService.loginFailed(target);
        }

        log.warn("[SECURITY VIOLATION] Rejected unverified biometric face login attempt for: {}. Remote face matching without presentation attack detection is disabled.", target);

        auditEventPublisher.publishEvent("BIOMETRIC_UNVERIFIED_REJECTED", target,
                "Rejected standalone unverified face embedding authentication request", "AUTH-REJECT");

        throw new BadCredentialsException("Unverified face embedding authentication is disabled in production. Hardware-backed device biometric authentication required.");
    }
}

