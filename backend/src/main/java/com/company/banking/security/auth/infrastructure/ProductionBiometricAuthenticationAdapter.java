package com.company.banking.security.auth.infrastructure;

import com.company.banking.common.audit.AuditEventPublisher;
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
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Slf4j
public class ProductionBiometricAuthenticationAdapter implements BiometricAuthenticationPort {

    private final DeviceAuthenticationService deviceAuthenticationService;
    private final LoginAttemptService loginAttemptService;
    private final AuditEventPublisher auditEventPublisher;

    @Override
    public AuthenticationResponse authenticateBiometric(FaceVerificationRequest request) {
        // If device-bound cryptographic credentials are provided in the verification request, route securely
        if (request.getDeviceId() != null && request.getChallenge() != null && request.getSignature() != null) {
            DeviceLoginRequest deviceLoginReq = DeviceLoginRequest.builder()
                    .deviceId(request.getDeviceId())
                    .challenge(request.getChallenge())
                    .signature(request.getSignature())
                    .build();
            return deviceAuthenticationService.loginWithDevice(deviceLoginReq);
        }

        // Mandatory containment: standalone client-supplied embeddings, synthetic users, and unverified face matches
        // are strictly prohibited from issuing authenticated sessions in production.
        String target = request.getEmail() != null ? request.getEmail().trim().toLowerCase() : "anonymous";
        log.warn("[SECURITY VIOLATION] Rejected unverified biometric face login attempt for: {}. Remote face matching without presentation attack detection is disabled.", target);

        if (request.getEmail() != null && !request.getEmail().trim().isEmpty()) {
            loginAttemptService.loginFailed(target);
        }

        auditEventPublisher.publishEvent("BIOMETRIC_UNVERIFIED_REJECTED", target,
                "Rejected standalone unverified face embedding authentication request", "AUTH-REJECT");

        throw new BadCredentialsException("Unverified face embedding authentication is disabled in production. Hardware-backed device biometric authentication required.");
    }
}

