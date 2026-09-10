package com.company.banking.security.mfa;

import com.company.banking.common.exception.BusinessException;
import com.company.banking.common.exception.ErrorCode;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;

class OtpServiceTest {

    private OtpService otpService;

    @BeforeEach
    void setUp() {
        otpService = new OtpService();
        otpService.clearCache();
    }

    @Test
    @DisplayName("generateOtpIfAllowed generates 6-digit code on first invocation")
    void testFirstGenerationSucceeds() {
        Optional<String> otp = otpService.generateOtpIfAllowed("user@novabank.com");

        assertTrue(otp.isPresent());
        assertEquals(6, otp.get().length());
        assertTrue(otp.get().matches("\\d{6}"));
    }

    @Test
    @DisplayName("generateOtpIfAllowed deduplicates rapid concurrent requests within idempotent window (5s)")
    void testRapidDuplicateIsDeduplicated() {
        String email = "rapid@novabank.com";
        Optional<String> firstOtp = otpService.generateOtpIfAllowed(email);
        assertTrue(firstOtp.isPresent());

        // Second immediate call simulating React StrictMode double mount or double click
        Optional<String> secondOtp = otpService.generateOtpIfAllowed(email);

        // Must return empty to prevent duplicate SMTP email dispatch
        assertTrue(secondOtp.isEmpty(), "Second immediate OTP call must return empty to suppress duplicate email");

        // The first OTP should still validate successfully
        assertTrue(otpService.validateOtp(email, firstOtp.get()), "First generated OTP must remain valid in cache");
    }

    @Test
    @DisplayName("validateOtp validates correct code and consumes it atomically")
    void testValidateOtpSuccessAndBurn() {
        String email = "consume@novabank.com";
        String code = otpService.generateOtp(email);

        // First verification should succeed
        boolean valid = otpService.validateOtp(email, code);
        assertTrue(valid);

        // Second verification with same code must fail because it was consumed
        boolean reuseValid = otpService.validateOtp(email, code);
        assertFalse(reuseValid, "Consumed OTP must not be reusable");
    }

    @Test
    @DisplayName("validateOtp burns code after 3 consecutive failed attempts")
    void testMaxFailedAttemptsBurnsOtp() {
        String email = "bruteforce@novabank.com";
        String correctCode = otpService.generateOtp(email);

        // 3 wrong attempts
        assertFalse(otpService.validateOtp(email, "000000"));
        assertFalse(otpService.validateOtp(email, "000001"));
        assertFalse(otpService.validateOtp(email, "000002"));

        // 4th attempt with CORRECT code should fail because OTP was burned
        assertFalse(otpService.validateOtp(email, correctCode), "OTP should be burned after 3 failed attempts");
    }

    @Test
    @DisplayName("generateOtpIfAllowed throws INVALID_REQUEST on null or blank email")
    void testBlankEmailThrowsException() {
        BusinessException ex = assertThrows(BusinessException.class, () -> otpService.generateOtpIfAllowed("   "));
        assertEquals(ErrorCode.INVALID_REQUEST, ex.getErrorCode());
    }
}

