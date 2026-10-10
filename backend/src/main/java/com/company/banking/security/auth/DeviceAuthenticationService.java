package com.company.banking.security.auth;

import com.company.banking.common.audit.AuditEventPublisher;
import com.company.banking.common.exception.BusinessException;
import com.company.banking.common.exception.ErrorCode;
import com.company.banking.customer.application.port.out.CustomerPersistencePort;
import com.company.banking.customer.domain.Customer;
import com.company.banking.customer.api.dto.CustomerResponse;
import com.company.banking.security.auth.application.port.out.DeviceAuthChallengePersistencePort;
import com.company.banking.security.auth.application.port.out.DeviceCredentialPersistencePort;
import com.company.banking.security.auth.crypto.DeviceSignatureVerifier;
import com.company.banking.security.auth.domain.DeviceAuthChallenge;
import com.company.banking.security.auth.domain.DeviceCredential;
import com.company.banking.security.auth.dto.*;
import com.company.banking.security.jwt.JwtTokenProvider;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.LockedException;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.Base64;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Slf4j
public class DeviceAuthenticationService {

    private static final String CANONICAL_DOMAIN_PREFIX = "NOVABANK_AUTH:";
    private static final int CHALLENGE_EXPIRY_MINUTES = 2;

    private final DeviceCredentialPersistencePort deviceCredentialPersistencePort;
    private final DeviceAuthChallengePersistencePort deviceAuthChallengePersistencePort;
    private final CustomerPersistencePort customerPersistencePort;
    private final DeviceSignatureVerifier deviceSignatureVerifier;
    private final JwtTokenProvider jwtTokenProvider;
    private final LoginAttemptService loginAttemptService;
    private final AuditEventPublisher auditEventPublisher;

    private final SecureRandom secureRandom = new SecureRandom();

    /**
     * Registers a new device cryptographic credential bound to an authenticated customer.
     */
    @Transactional
    public void registerDevice(Long customerId, DeviceRegistrationRequest request) {
        Customer customer = customerPersistencePort.findById(customerId)
                .orElseThrow(() -> new UsernameNotFoundException("Customer not found: " + customerId));

        if (customer.isLocked() || loginAttemptService.isBlocked(customer.getEmail())) {
            throw new LockedException("Customer account is locked");
        }

        String deviceId = request.getDeviceId().trim();
        Optional<DeviceCredential> existingOpt = deviceCredentialPersistencePort.findByDeviceId(deviceId);

        if (existingOpt.isPresent()) {
            DeviceCredential existing = existingOpt.get();
            // Prevent another customer from hijacking an already bound device without prior revocation
            if (!existing.getCustomerId().equals(customerId)) {
                log.warn("[SECURITY] Cross-account device takeover attempt blocked for deviceId: {}", deviceId);
                auditEventPublisher.publishEvent("DEVICE_TAKEOVER_ATTEMPT", customer.getEmail(),
                        "Attempted to register device already assigned to another customer", "DEV-" + deviceId);
                throw new BusinessException(ErrorCode.FORBIDDEN, "Device is registered to another account");
            }
            existing.setPublicKey(request.getPublicKey().trim());
            existing.setAlgorithm(request.getAlgorithm() != null ? request.getAlgorithm() : "SHA256withECDSA");
            existing.setDeviceModel(request.getDeviceModel());
            existing.setStatus("ACTIVE");
            existing.setLastUsedAt(LocalDateTime.now());
            deviceCredentialPersistencePort.save(existing);
        } else {
            DeviceCredential credential = DeviceCredential.builder()
                    .customerId(customerId)
                    .deviceId(deviceId)
                    .publicKey(request.getPublicKey().trim())
                    .algorithm(request.getAlgorithm() != null ? request.getAlgorithm() : "SHA256withECDSA")
                    .deviceModel(request.getDeviceModel())
                    .status("ACTIVE")
                    .build();
            deviceCredentialPersistencePort.save(credential);
        }

        auditEventPublisher.publishEvent("DEVICE_REGISTERED", customer.getEmail(),
                "Cryptographic device credential registered successfully", "DEV-" + deviceId);
        log.info("Registered cryptographic credential for customerId: {} on device: {}", customerId, deviceId);
    }

    /**
     * Generates a single-use unpredictable server challenge for device biometric login.
     */
    @Transactional
    public DeviceChallengeResponse createChallenge(DeviceChallengeRequest request) {
        String deviceId = request.getDeviceId().trim();
        DeviceCredential credential = deviceCredentialPersistencePort.findByDeviceId(deviceId)
                .orElseThrow(() -> new BadCredentialsException("Device not registered or revoked"));

        if (!"ACTIVE".equalsIgnoreCase(credential.getStatus())) {
            throw new BadCredentialsException("Device is revoked or inactive");
        }

        Customer customer = customerPersistencePort.findById(credential.getCustomerId())
                .orElseThrow(() -> new BadCredentialsException("Associated customer account not found"));

        if (customer.isLocked() || loginAttemptService.isBlocked(customer.getEmail())) {
            throw new LockedException("Customer account is locked due to security restrictions");
        }

        byte[] challengeBytes = new byte[32];
        secureRandom.nextBytes(challengeBytes);
        String challenge = Base64.getUrlEncoder().withoutPadding().encodeToString(challengeBytes);

        String purpose = request.getPurpose() != null ? request.getPurpose() : "BIOMETRIC_LOGIN";
        LocalDateTime expiresAt = LocalDateTime.now().plusMinutes(CHALLENGE_EXPIRY_MINUTES);

        DeviceAuthChallenge authChallenge = DeviceAuthChallenge.builder()
                .challenge(challenge)
                .deviceId(deviceId)
                .customerId(credential.getCustomerId())
                .purpose(purpose)
                .expiresAt(expiresAt)
                .consumed(false)
                .build();

        deviceAuthChallengePersistencePort.save(authChallenge);

        return DeviceChallengeResponse.builder()
                .challenge(challenge)
                .expiresAt(expiresAt)
                .serverTime(LocalDateTime.now())
                .build();
    }

    /**
     * Verifies signed challenge proof, atomically marks challenge consumed, and issues a JWT session.
     */
    @Transactional
    public AuthenticationResponse loginWithDevice(DeviceLoginRequest request) {
        String challengeStr = request.getChallenge() != null ? request.getChallenge().trim() : "";
        String deviceId = request.getDeviceId() != null ? request.getDeviceId().trim() : "";
        String signature = request.getSignature() != null ? request.getSignature().trim() : "";

        // 1. Atomically acquire pessimistic write lock on challenge record
        DeviceAuthChallenge challenge = deviceAuthChallengePersistencePort.findByChallengeForUpdate(challengeStr)
                .orElseThrow(() -> new BadCredentialsException("Invalid or expired authentication challenge"));

        // 2. Prevent replay attacks
        if (challenge.isConsumed()) {
            log.warn("[SECURITY ALERT] Replay attack detected on challenge: {} for device: {}", challengeStr, deviceId);
            auditEventPublisher.publishEvent("CHALLENGE_REPLAY_DETECTED", "unknown",
                    "Detected duplicate consumption attempt on challenge", "CHAL-" + challengeStr);
            throw new BadCredentialsException("Authentication challenge has already been consumed");
        }

        // 3. Atomically consume the challenge immediately
        challenge.setConsumed(true);
        deviceAuthChallengePersistencePort.save(challenge);

        // 4. Validate challenge expiration
        if (challenge.getExpiresAt().isBefore(LocalDateTime.now())) {
            log.warn("Challenge expired: {} for device: {}", challengeStr, deviceId);
            throw new BadCredentialsException("Authentication challenge has expired");
        }

        // 5. Validate device binding
        if (!challenge.getDeviceId().equals(deviceId)) {
            log.warn("Device mismatch on challenge. Expected: {}, Provided: {}", challenge.getDeviceId(), deviceId);
            throw new BadCredentialsException("Challenge does not match device");
        }

        // 6. Look up device credential
        DeviceCredential credential = deviceCredentialPersistencePort.findByDeviceId(deviceId)
                .orElseThrow(() -> new BadCredentialsException("Device is revoked or not registered"));

        if (!"ACTIVE".equalsIgnoreCase(credential.getStatus())) {
            throw new BadCredentialsException("Device is revoked or inactive");
        }

        // 7. Resolve customer from trusted server-side record (never client-supplied email!)
        Customer customer = customerPersistencePort.findById(credential.getCustomerId())
                .orElseThrow(() -> new UsernameNotFoundException("Customer account not found"));

        if (customer.isLocked()) {
            throw new LockedException("Customer account is locked");
        }

        if (loginAttemptService.isBlocked(customer.getEmail())) {
            throw new LockedException("Customer account is locked due to excessive failed attempts");
        }

        // 8. Construct canonical domain-separated verification string
        String canonicalData = CANONICAL_DOMAIN_PREFIX + deviceId + ":" + challengeStr + ":" + challenge.getPurpose();

        // 9. Cryptographically verify signature against registered public key
        boolean isValid = deviceSignatureVerifier.verify(
                credential.getPublicKey(),
                credential.getAlgorithm(),
                canonicalData,
                signature
        );

        if (!isValid) {
            loginAttemptService.loginFailed(customer.getEmail());
            auditEventPublisher.publishEvent("DEVICE_AUTH_FAILED", customer.getEmail(),
                    "Cryptographic signature verification failed for biometric challenge", "DEV-" + deviceId);
            log.warn("[SECURITY] Cryptographic signature check failed for customer: {} on device: {}", customer.getEmail(), deviceId);
            throw new BadCredentialsException("Biometric digital signature verification failed");
        }

        // 10. Clear failed attempts and update last used timestamp
        loginAttemptService.loginSucceeded(customer.getEmail());
        credential.setLastUsedAt(LocalDateTime.now());
        deviceCredentialPersistencePort.save(credential);

        auditEventPublisher.publishEvent("DEVICE_AUTH_SUCCESS", customer.getEmail(),
                "Device-bound biometric authentication succeeded", "DEV-" + deviceId);

        // 11. Generate authenticated session
        String jwtToken = jwtTokenProvider.generateToken(customer);
        return AuthenticationResponse.bearer(jwtToken, CustomerResponse.fromEntity(customer));
    }

    /**
     * Revokes a registered device credential.
     */
    @Transactional
    public void revokeDevice(Long customerId, DeviceRevocationRequest request) {
        String deviceId = request.getDeviceId().trim();
        DeviceCredential credential = deviceCredentialPersistencePort.findByDeviceId(deviceId)
                .orElseThrow(() -> new BusinessException(ErrorCode.NOT_FOUND, "Device not found"));

        if (!credential.getCustomerId().equals(customerId)) {
            throw new BusinessException(ErrorCode.FORBIDDEN, "Cannot revoke device belonging to another account");
        }

        credential.setStatus("REVOKED");
        deviceCredentialPersistencePort.save(credential);

        Customer customer = customerPersistencePort.findById(customerId).orElse(null);
        String email = customer != null ? customer.getEmail() : "user-" + customerId;
        auditEventPublisher.publishEvent("DEVICE_REVOKED", email, "Device credential was revoked", "DEV-" + deviceId);
        log.info("Revoked device credential for device: {} by customer: {}", deviceId, customerId);
    }

    /**
     * Returns sanitized status information for a device.
     */
    public DeviceStatusResponse getDeviceStatus(String deviceId) {
        return deviceCredentialPersistencePort.findByDeviceId(deviceId.trim())
                .map(c -> DeviceStatusResponse.builder()
                        .deviceId(c.getDeviceId())
                        .status(c.getStatus())
                        .deviceModel(c.getDeviceModel())
                        .enrolledAt(c.getCreatedAt())
                        .lastUsedAt(c.getLastUsedAt())
                        .build())
                .orElse(DeviceStatusResponse.builder()
                        .deviceId(deviceId)
                        .status("UNREGISTERED")
                        .build());
    }
}

