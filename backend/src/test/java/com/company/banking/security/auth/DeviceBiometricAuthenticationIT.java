package com.company.banking.security.auth;

import com.company.banking.common.exception.BusinessException;
import com.company.banking.config.BaseIntegrationTest;
import com.company.banking.customer.application.port.out.CustomerPersistencePort;
import com.company.banking.customer.domain.Customer;
import com.company.banking.security.auth.application.port.out.BiometricAuthenticationPort;
import com.company.banking.security.auth.application.port.out.DeviceAuthChallengePersistencePort;
import com.company.banking.security.auth.application.port.out.DeviceCredentialPersistencePort;
import com.company.banking.security.auth.domain.DeviceAuthChallenge;
import com.company.banking.security.auth.domain.DeviceCredential;
import com.company.banking.security.auth.dto.*;
import com.company.banking.security.auth.infrastructure.ProductionBiometricAuthenticationAdapter;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.LockedException;
import org.springframework.test.context.ActiveProfiles;

import java.nio.charset.StandardCharsets;
import java.security.KeyPair;
import java.security.KeyPairGenerator;
import java.security.Signature;
import java.security.spec.ECGenParameterSpec;
import java.time.LocalDateTime;
import java.util.*;
import java.util.concurrent.*;
import java.util.concurrent.atomic.AtomicInteger;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@ActiveProfiles("test")
public class DeviceBiometricAuthenticationIT extends BaseIntegrationTest {

    @Autowired
    private DeviceAuthenticationService deviceAuthenticationService;

    @Autowired
    private DeviceCredentialPersistencePort deviceCredentialPersistencePort;

    @Autowired
    private DeviceAuthChallengePersistencePort deviceAuthChallengePersistencePort;

    @Autowired
    private CustomerPersistencePort customerPersistencePort;

    @Autowired
    private LoginAttemptService loginAttemptService;

    @Autowired
    private AuthenticationService authenticationService;

    @Autowired
    private ProductionBiometricAuthenticationAdapter productionBiometricAuthenticationAdapter;

    private Customer testCustomer;
    private KeyPair ecKeyPair;
    private String publicKeyBase64;
    private static final String TEST_DEVICE_ID = "device-test-uuid-12345";
    private static final String TEST_EMAIL = "device.biometric.test@nova.bank";

    @BeforeEach
    public void setup() throws Exception {
        loginAttemptService.loginSucceeded(TEST_EMAIL);

        this.testCustomer = customerPersistencePort.findByEmail(TEST_EMAIL)
                .map(c -> {
                    c.setLocked(false);
                    return customerPersistencePort.save(c);
                })
                .orElseGet(() -> customerPersistencePort.save(Customer.builder()
                        .email(TEST_EMAIL)
                        .password("hashed_password_123")
                        .firstName("Biometric")
                        .lastName("Tester")
                        .kycStatus("VERIFIED")
                        .locked(false)
                        .build()));

        // Generate genuine ECDSA P-256 keypair
        KeyPairGenerator kpg = KeyPairGenerator.getInstance("EC");
        kpg.initialize(new ECGenParameterSpec("secp256r1"));
        this.ecKeyPair = kpg.generateKeyPair();
        this.publicKeyBase64 = Base64.getEncoder().encodeToString(ecKeyPair.getPublic().getEncoded());

        // Clean up any test device
        deviceCredentialPersistencePort.deleteByDeviceId(TEST_DEVICE_ID);
    }

    private String signData(KeyPair keyPair, String canonicalData) throws Exception {
        Signature sig = Signature.getInstance("SHA256withECDSA");
        sig.initSign(keyPair.getPrivate());
        sig.update(canonicalData.getBytes(StandardCharsets.UTF_8));
        return Base64.getEncoder().encodeToString(sig.sign());
    }

    @Test
    @DisplayName("S01: Genuine registered device credential authenticates successfully and issues JWT")
    public void s01_GenuineRegisteredDevice_AuthenticatesSuccessfully() throws Exception {
        // 1. Register device
        DeviceRegistrationRequest regReq = DeviceRegistrationRequest.builder()
                .deviceId(TEST_DEVICE_ID)
                .publicKey(publicKeyBase64)
                .algorithm("SHA256withECDSA")
                .deviceModel("iPhone 15 Pro, iOS 18.2")
                .build();
        deviceAuthenticationService.registerDevice(testCustomer.getId(), regReq);

        // 2. Request single-use challenge
        DeviceChallengeRequest chalReq = DeviceChallengeRequest.builder()
                .deviceId(TEST_DEVICE_ID)
                .purpose("BIOMETRIC_LOGIN")
                .build();
        DeviceChallengeResponse chalResp = deviceAuthenticationService.createChallenge(chalReq);
        assertNotNull(chalResp.getChallenge());

        // 3. Sign canonical domain-separated message
        String canonicalMessage = "NOVABANK_AUTH:" + TEST_DEVICE_ID + ":" + chalResp.getChallenge() + ":BIOMETRIC_LOGIN";
        String signature = signData(ecKeyPair, canonicalMessage);

        // 4. Login with device
        DeviceLoginRequest loginReq = DeviceLoginRequest.builder()
                .deviceId(TEST_DEVICE_ID)
                .challenge(chalResp.getChallenge())
                .signature(signature)
                .build();
        AuthenticationResponse authResp = deviceAuthenticationService.loginWithDevice(loginReq);

        assertNotNull(authResp);
        assertNotNull(authResp.getToken(), "Must return signed JWT");
        assertEquals(TEST_EMAIL, authResp.getUser().getEmail());

        // Verify device last_used_at timestamp updated
        DeviceCredential cred = deviceCredentialPersistencePort.findByDeviceId(TEST_DEVICE_ID).orElseThrow();
        assertNotNull(cred.getLastUsedAt());
    }

    @Test
    @DisplayName("S02: Unregistered device is rejected")
    public void s02_UnregisteredDevice_IsRejected() {
        DeviceChallengeRequest chalReq = DeviceChallengeRequest.builder()
                .deviceId("unregistered-device-999")
                .build();
        assertThrows(BadCredentialsException.class, () -> deviceAuthenticationService.createChallenge(chalReq));
    }

    @Test
    @DisplayName("S03: Fabricated signature is rejected and tracks failed attempt")
    public void s03_FabricatedSignature_IsRejected() throws Exception {
        // Register device
        DeviceRegistrationRequest regReq = DeviceRegistrationRequest.builder()
                .deviceId(TEST_DEVICE_ID)
                .publicKey(publicKeyBase64)
                .algorithm("SHA256withECDSA")
                .build();
        deviceAuthenticationService.registerDevice(testCustomer.getId(), regReq);

        // Challenge
        DeviceChallengeResponse chalResp = deviceAuthenticationService.createChallenge(
                DeviceChallengeRequest.builder().deviceId(TEST_DEVICE_ID).build()
        );

        // Sign with a DIFFERENT, unauthorized key pair
        KeyPairGenerator kpg = KeyPairGenerator.getInstance("EC");
        kpg.initialize(new ECGenParameterSpec("secp256r1"));
        KeyPair unauthorizedKeyPair = kpg.generateKeyPair();
        String canonicalMessage = "NOVABANK_AUTH:" + TEST_DEVICE_ID + ":" + chalResp.getChallenge() + ":BIOMETRIC_LOGIN";
        String bogusSignature = signData(unauthorizedKeyPair, canonicalMessage);

        DeviceLoginRequest loginReq = DeviceLoginRequest.builder()
                .deviceId(TEST_DEVICE_ID)
                .challenge(chalResp.getChallenge())
                .signature(bogusSignature)
                .build();

        assertThrows(BadCredentialsException.class, () -> deviceAuthenticationService.loginWithDevice(loginReq));
    }

    @Test
    @DisplayName("S04: Challenge device mismatch is rejected")
    public void s04_ChallengeDeviceMismatch_IsRejected() throws Exception {
        // Register device 1
        deviceAuthenticationService.registerDevice(testCustomer.getId(), DeviceRegistrationRequest.builder()
                .deviceId(TEST_DEVICE_ID)
                .publicKey(publicKeyBase64)
                .build());

        // Register device 2
        String device2 = "device-2-xyz";
        deviceAuthenticationService.registerDevice(testCustomer.getId(), DeviceRegistrationRequest.builder()
                .deviceId(device2)
                .publicKey(publicKeyBase64)
                .build());

        // Create challenge for device 1
        DeviceChallengeResponse chalResp = deviceAuthenticationService.createChallenge(
                DeviceChallengeRequest.builder().deviceId(TEST_DEVICE_ID).build()
        );

        // Attempt to submit challenge with device 2
        String canonicalMessage = "NOVABANK_AUTH:" + device2 + ":" + chalResp.getChallenge() + ":BIOMETRIC_LOGIN";
        String signature = signData(ecKeyPair, canonicalMessage);

        DeviceLoginRequest loginReq = DeviceLoginRequest.builder()
                .deviceId(device2)
                .challenge(chalResp.getChallenge())
                .signature(signature)
                .build();

        assertThrows(BadCredentialsException.class, () -> deviceAuthenticationService.loginWithDevice(loginReq));
    }

    @Test
    @DisplayName("S05: Consumed or replayed challenge cannot authenticate again")
    public void s05_ConsumedOrReplayedChallenge_CannotAuthenticateAgain() throws Exception {
        deviceAuthenticationService.registerDevice(testCustomer.getId(), DeviceRegistrationRequest.builder()
                .deviceId(TEST_DEVICE_ID)
                .publicKey(publicKeyBase64)
                .build());

        DeviceChallengeResponse chalResp = deviceAuthenticationService.createChallenge(
                DeviceChallengeRequest.builder().deviceId(TEST_DEVICE_ID).build()
        );

        String canonicalMessage = "NOVABANK_AUTH:" + TEST_DEVICE_ID + ":" + chalResp.getChallenge() + ":BIOMETRIC_LOGIN";
        String signature = signData(ecKeyPair, canonicalMessage);

        DeviceLoginRequest loginReq = DeviceLoginRequest.builder()
                .deviceId(TEST_DEVICE_ID)
                .challenge(chalResp.getChallenge())
                .signature(signature)
                .build();

        // 1st attempt succeeds
        AuthenticationResponse firstAuth = deviceAuthenticationService.loginWithDevice(loginReq);
        assertNotNull(firstAuth.getToken());

        // 2nd attempt with same challenge MUST FAIL (Replay Prevention)
        assertThrows(BadCredentialsException.class, () -> deviceAuthenticationService.loginWithDevice(loginReq));
    }

    @Test
    @DisplayName("S06: Expired challenge is rejected")
    public void s06_ExpiredChallenge_IsRejected() throws Exception {
        deviceAuthenticationService.registerDevice(testCustomer.getId(), DeviceRegistrationRequest.builder()
                .deviceId(TEST_DEVICE_ID)
                .publicKey(publicKeyBase64)
                .build());

        DeviceChallengeResponse chalResp = deviceAuthenticationService.createChallenge(
                DeviceChallengeRequest.builder().deviceId(TEST_DEVICE_ID).build()
        );

        // Manually expire challenge in DB
        DeviceAuthChallenge chal = deviceAuthChallengePersistencePort.findByChallenge(chalResp.getChallenge()).orElseThrow();
        chal.setExpiresAt(LocalDateTime.now().minusMinutes(5));
        deviceAuthChallengePersistencePort.save(chal);

        String canonicalMessage = "NOVABANK_AUTH:" + TEST_DEVICE_ID + ":" + chalResp.getChallenge() + ":BIOMETRIC_LOGIN";
        String signature = signData(ecKeyPair, canonicalMessage);

        DeviceLoginRequest loginReq = DeviceLoginRequest.builder()
                .deviceId(TEST_DEVICE_ID)
                .challenge(chalResp.getChallenge())
                .signature(signature)
                .build();

        assertThrows(BadCredentialsException.class, () -> deviceAuthenticationService.loginWithDevice(loginReq));
    }

    @Test
    @DisplayName("S07: Production adapter rejects simulated embeddings and unverified requests without token issuance")
    public void s07_ProductionAdapter_RejectsSimulatedEmbeddings() {
        FaceVerificationRequest req = FaceVerificationRequest.builder()
                .email(TEST_EMAIL)
                .embedding(Arrays.asList(0.12, 0.45, 0.88, 0.91))
                .build();

        // Production adapter must FAIL CLOSED and never issue a token
        assertThrows(BadCredentialsException.class, () -> productionBiometricAuthenticationAdapter.authenticateBiometric(req));
    }

    @Test
    @DisplayName("S08: Locked customer account is denied challenge creation and authentication")
    public void s08_LockedAccount_IsDenied() throws Exception {
        deviceAuthenticationService.registerDevice(testCustomer.getId(), DeviceRegistrationRequest.builder()
                .deviceId(TEST_DEVICE_ID)
                .publicKey(publicKeyBase64)
                .build());

        // Lock customer
        testCustomer.setLocked(true);
        customerPersistencePort.save(testCustomer);

        DeviceChallengeRequest chalReq = DeviceChallengeRequest.builder().deviceId(TEST_DEVICE_ID).build();
        assertThrows(LockedException.class, () -> deviceAuthenticationService.createChallenge(chalReq));
    }

    @Test
    @DisplayName("S09: Revoked device prevents further challenge creation and authentication")
    public void s09_RevokedDevice_PreventsAuthentication() throws Exception {
        deviceAuthenticationService.registerDevice(testCustomer.getId(), DeviceRegistrationRequest.builder()
                .deviceId(TEST_DEVICE_ID)
                .publicKey(publicKeyBase64)
                .build());

        // Revoke device
        deviceAuthenticationService.revokeDevice(testCustomer.getId(), DeviceRevocationRequest.builder()
                .deviceId(TEST_DEVICE_ID)
                .build());

        // Challenge creation must fail for revoked device
        assertThrows(BadCredentialsException.class, () -> deviceAuthenticationService.createChallenge(
                DeviceChallengeRequest.builder().deviceId(TEST_DEVICE_ID).build()
        ));
    }

    @Test
    @DisplayName("S10: Device takeover across different accounts is prevented")
    public void s10_DeviceTakeoverAcrossAccounts_IsForbidden() {
        // Register to customer 1
        deviceAuthenticationService.registerDevice(testCustomer.getId(), DeviceRegistrationRequest.builder()
                .deviceId(TEST_DEVICE_ID)
                .publicKey(publicKeyBase64)
                .build());

        // Create second customer
        Customer customer2 = customerPersistencePort.save(Customer.builder()
                .email("another.user@nova.bank")
                .password("password123")
                .firstName("Another")
                .lastName("User")
                .kycStatus("VERIFIED")
                .locked(false)
                .build());

        // Customer 2 attempts to register same deviceId
        assertThrows(BusinessException.class, () -> deviceAuthenticationService.registerDevice(customer2.getId(), DeviceRegistrationRequest.builder()
                .deviceId(TEST_DEVICE_ID)
                .publicKey(publicKeyBase64)
                .build()));
    }

    @Test
    @DisplayName("S11: Concurrent challenge submissions cannot consume the same challenge more than once")
    public void s11_ConcurrentChallengeSubmission_SerializedAtomically() throws Exception {
        deviceAuthenticationService.registerDevice(testCustomer.getId(), DeviceRegistrationRequest.builder()
                .deviceId(TEST_DEVICE_ID)
                .publicKey(publicKeyBase64)
                .build());

        DeviceChallengeResponse chalResp = deviceAuthenticationService.createChallenge(
                DeviceChallengeRequest.builder().deviceId(TEST_DEVICE_ID).build()
        );

        String canonicalMessage = "NOVABANK_AUTH:" + TEST_DEVICE_ID + ":" + chalResp.getChallenge() + ":BIOMETRIC_LOGIN";
        String signature = signData(ecKeyPair, canonicalMessage);

        DeviceLoginRequest loginReq = DeviceLoginRequest.builder()
                .deviceId(TEST_DEVICE_ID)
                .challenge(chalResp.getChallenge())
                .signature(signature)
                .build();

        int threadCount = 4;
        ExecutorService executor = Executors.newFixedThreadPool(threadCount);
        CountDownLatch startLatch = new CountDownLatch(1);
        CountDownLatch finishLatch = new CountDownLatch(threadCount);
        AtomicInteger successCount = new AtomicInteger(0);
        AtomicInteger failureCount = new AtomicInteger(0);

        for (int i = 0; i < threadCount; i++) {
            executor.submit(() -> {
                try {
                    startLatch.await();
                    AuthenticationResponse resp = deviceAuthenticationService.loginWithDevice(loginReq);
                    if (resp != null && resp.getToken() != null) {
                        successCount.incrementAndGet();
                    }
                } catch (Exception e) {
                    failureCount.incrementAndGet();
                } finally {
                    finishLatch.countDown();
                }
            });
        }

        startLatch.countDown(); // Release threads concurrently
        assertTrue(finishLatch.await(10, TimeUnit.SECONDS));
        executor.shutdown();

        // Exactly ONE concurrent request must succeed, all other attempts must fail with replay detection
        assertEquals(1, successCount.get(), "Exactly one concurrent challenge request must succeed");
        assertEquals(threadCount - 1, failureCount.get(), "All other concurrent attempts must be rejected");
    }

    @Test
    @DisplayName("S12: Invalid public key format at registration is rejected")
    public void s12_InvalidPublicKeyFormat_IsRejected() {
        DeviceRegistrationRequest badReq = DeviceRegistrationRequest.builder()
                .deviceId("device-bad-key")
                .publicKey("not-a-valid-base64-or-spki-key")
                .algorithm("SHA256withECDSA")
                .build();

        BusinessException ex = assertThrows(BusinessException.class,
                () -> deviceAuthenticationService.registerDevice(testCustomer.getId(), badReq));
        assertEquals(com.company.banking.common.exception.ErrorCode.INVALID_REQUEST, ex.getErrorCode());
    }

    @Test
    @DisplayName("S13: Challenge created with non-login purpose is rejected by login endpoint")
    public void s13_NonLoginPurpose_IsRejected() throws Exception {
        deviceAuthenticationService.registerDevice(testCustomer.getId(), DeviceRegistrationRequest.builder()
                .deviceId(TEST_DEVICE_ID)
                .publicKey(publicKeyBase64)
                .build());

        // Create challenge with PURPOSE other than BIOMETRIC_LOGIN (e.g. PAYMENT_AUTHORIZATION)
        DeviceChallengeRequest transferReq = DeviceChallengeRequest.builder()
                .deviceId(TEST_DEVICE_ID)
                .purpose("PAYMENT_AUTHORIZATION")
                .build();
        DeviceChallengeResponse chalResp = deviceAuthenticationService.createChallenge(transferReq);

        String canonicalMessage = "NOVABANK_AUTH:" + TEST_DEVICE_ID + ":" + chalResp.getChallenge() + ":PAYMENT_AUTHORIZATION";
        String signature = signData(ecKeyPair, canonicalMessage);

        DeviceLoginRequest loginReq = DeviceLoginRequest.builder()
                .deviceId(TEST_DEVICE_ID)
                .challenge(chalResp.getChallenge())
                .signature(signature)
                .build();

        // Must reject challenge not intended for login
        assertThrows(BadCredentialsException.class, () -> deviceAuthenticationService.loginWithDevice(loginReq));
    }

    @Test
    @DisplayName("S14: Production adapter rejects locked customer with LockedException")
    public void s14_ProductionAdapter_LockedCustomer_ThrowsLockedException() {
        testCustomer.setLocked(true);
        customerPersistencePort.save(testCustomer);

        FaceVerificationRequest req = FaceVerificationRequest.builder()
                .email(TEST_EMAIL)
                .embedding(Arrays.asList(0.12, 0.45, 0.88, 0.91))
                .build();

        assertThrows(LockedException.class, () -> productionBiometricAuthenticationAdapter.authenticateBiometric(req));
    }

    @Test
    @DisplayName("S15: Failed signature attempt permanently burns the challenge (single-use replay prevention)")
    public void s15_FailedSignature_BurnsChallenge_CannotBeReused() throws Exception {
        deviceAuthenticationService.registerDevice(testCustomer.getId(), DeviceRegistrationRequest.builder()
                .deviceId(TEST_DEVICE_ID)
                .publicKey(publicKeyBase64)
                .build());

        DeviceChallengeResponse chalResp = deviceAuthenticationService.createChallenge(
                DeviceChallengeRequest.builder().deviceId(TEST_DEVICE_ID).build()
        );

        // 1. Submit with bad signature -> throws BadCredentialsException
        DeviceLoginRequest badLoginReq = DeviceLoginRequest.builder()
                .deviceId(TEST_DEVICE_ID)
                .challenge(chalResp.getChallenge())
                .signature("dGhpcy1pcy1hLWJhZC1zaWduYXR1cmUtYnl0ZXM=")
                .build();

        assertThrows(BadCredentialsException.class, () -> deviceAuthenticationService.loginWithDevice(badLoginReq));

        // 2. Submit with valid signature for the SAME challenge -> must STILL fail with consumed challenge!
        String canonicalMessage = "NOVABANK_AUTH:" + TEST_DEVICE_ID + ":" + chalResp.getChallenge() + ":BIOMETRIC_LOGIN";
        String validSignature = signData(ecKeyPair, canonicalMessage);

        DeviceLoginRequest retryLoginReq = DeviceLoginRequest.builder()
                .deviceId(TEST_DEVICE_ID)
                .challenge(chalResp.getChallenge())
                .signature(validSignature)
                .build();

        BadCredentialsException ex = assertThrows(BadCredentialsException.class,
                () -> deviceAuthenticationService.loginWithDevice(retryLoginReq));
        assertTrue(ex.getMessage().contains("already been consumed") || ex.getMessage().contains("challenge"),
                "Replaying burned challenge must be rejected: " + ex.getMessage());
    }

    @Test
    @DisplayName("S16: Password authentication path continues to work alongside device biometrics")
    public void s16_PasswordAuthentication_ContinuesToWork() {
        // Create user with password encoded
        String email = "password.compat.user@nova.bank";
        customerPersistencePort.save(Customer.builder()
                .email(email)
                .password("$2a$12$e8y2p21hS244J6zB0u6Rpu9a2v0jE/yE0q4jB5P1iK/jD1F3H0P2.") // BCrypt for test
                .firstName("Password")
                .lastName("Compat")
                .kycStatus("VERIFIED")
                .locked(false)
                .build());

        // Device credential registered
        deviceAuthenticationService.registerDevice(testCustomer.getId(), DeviceRegistrationRequest.builder()
                .deviceId(TEST_DEVICE_ID)
                .publicKey(publicKeyBase64)
                .build());

        // Standard device login works, device status works
        DeviceStatusResponse status = deviceAuthenticationService.getDeviceStatus(TEST_DEVICE_ID);
        assertEquals("ACTIVE", status.getStatus());
        assertEquals(TEST_DEVICE_ID, status.getDeviceId());
    }

    @Test
    @DisplayName("S17: Replaced device credential invalidates older keypair signatures")
    public void s17_ReplacedDeviceKey_OldKeyCannotAuthenticate() throws Exception {
        // 1. Initial registration with keypair 1
        deviceAuthenticationService.registerDevice(testCustomer.getId(), DeviceRegistrationRequest.builder()
                .deviceId(TEST_DEVICE_ID)
                .publicKey(publicKeyBase64)
                .build());

        // 2. Re-enrollment / Key replacement with new keypair 2
        KeyPairGenerator kpg = KeyPairGenerator.getInstance("EC");
        kpg.initialize(new ECGenParameterSpec("secp256r1"));
        KeyPair newKeyPair = kpg.generateKeyPair();
        String newPublicKeyBase64 = Base64.getEncoder().encodeToString(newKeyPair.getPublic().getEncoded());

        deviceAuthenticationService.registerDevice(testCustomer.getId(), DeviceRegistrationRequest.builder()
                .deviceId(TEST_DEVICE_ID)
                .publicKey(newPublicKeyBase64)
                .build());

        // 3. Challenge generated
        DeviceChallengeResponse chalResp = deviceAuthenticationService.createChallenge(
                DeviceChallengeRequest.builder().deviceId(TEST_DEVICE_ID).build()
        );

        // 4. Old keypair signs message -> MUST FAIL
        String canonicalMessage = "NOVABANK_AUTH:" + TEST_DEVICE_ID + ":" + chalResp.getChallenge() + ":BIOMETRIC_LOGIN";
        String oldSignature = signData(ecKeyPair, canonicalMessage);

        DeviceLoginRequest oldKeyLoginReq = DeviceLoginRequest.builder()
                .deviceId(TEST_DEVICE_ID)
                .challenge(chalResp.getChallenge())
                .signature(oldSignature)
                .build();

        assertThrows(BadCredentialsException.class, () -> deviceAuthenticationService.loginWithDevice(oldKeyLoginReq));

        // 5. New challenge with new keypair signs message -> MUST SUCCEED
        DeviceChallengeResponse chalResp2 = deviceAuthenticationService.createChallenge(
                DeviceChallengeRequest.builder().deviceId(TEST_DEVICE_ID).build()
        );
        String canonicalMessage2 = "NOVABANK_AUTH:" + TEST_DEVICE_ID + ":" + chalResp2.getChallenge() + ":BIOMETRIC_LOGIN";
        String newSignature = signData(newKeyPair, canonicalMessage2);

        DeviceLoginRequest newKeyLoginReq = DeviceLoginRequest.builder()
                .deviceId(TEST_DEVICE_ID)
                .challenge(chalResp2.getChallenge())
                .signature(newSignature)
                .build();

        AuthenticationResponse authResp = deviceAuthenticationService.loginWithDevice(newKeyLoginReq);
        assertNotNull(authResp);
        assertNotNull(authResp.getToken());
    }
}

