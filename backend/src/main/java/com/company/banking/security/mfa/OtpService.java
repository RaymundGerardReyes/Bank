package com.company.banking.security.mfa;

import com.company.banking.common.exception.BusinessException;
import com.company.banking.common.exception.ErrorCode;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.security.SecureRandom;
import java.time.Duration;
import java.time.Instant;
import java.util.Map;
import java.util.Optional;
import java.util.concurrent.ConcurrentHashMap;

@Slf4j
@Service
public class OtpService {

    public static class OtpRecord {
        final String code;
        final Instant expiresAt;
        final Instant createdAt;
        int failedAttempts;

        public OtpRecord(String code, Instant expiresAt, Instant createdAt) {
            this.code = code;
            this.expiresAt = expiresAt;
            this.createdAt = createdAt;
            this.failedAttempts = 0;
        }

        public String getCode() {
            return code;
        }

        public Instant getExpiresAt() {
            return expiresAt;
        }

        public Instant getCreatedAt() {
            return createdAt;
        }
    }

    public static final long OTP_VALIDITY_SECONDS = 300; // 5 minutes
    public static final int MAX_FAILED_ATTEMPTS = 3;
    public static final long IDEMPOTENT_WINDOW_SECONDS = 5; // Deduplicate rapid concurrent flights
    public static final long RESEND_COOLDOWN_SECONDS = 60; // 60s cooldown between explicit resends
    public static final int MAX_CACHE_SIZE = 10_000; // Bounded cache per architectural rules

    private final Map<String, OtpRecord> otpCache = new ConcurrentHashMap<>();
    private final SecureRandom random = new SecureRandom();

    /**
     * Generates a new OTP code if allowed, with built-in deduplication and cooldown enforcement.
     *
     * @param key User identifier (e.g., normalized email)
     * @return Optional containing the generated OTP code, or Optional.empty() if an OTP was already
     *         generated within the idempotent window (suppressing duplicate SMTP dispatch).
     * @throws BusinessException if a resend is attempted during the active cooldown window.
     */
    public Optional<String> generateOtpIfAllowed(String key) {
        if (key == null || key.trim().isEmpty()) {
            throw new BusinessException(ErrorCode.INVALID_REQUEST, "Email/Key cannot be blank.");
        }
        String normalizedKey = key.trim().toLowerCase();
        Instant now = Instant.now();

        OtpRecord existing = otpCache.get(normalizedKey);
        if (existing != null) {
            if (now.isAfter(existing.expiresAt)) {
                otpCache.remove(normalizedKey);
            } else {
                long secondsSinceCreation = Duration.between(existing.createdAt, now).getSeconds();
                if (secondsSinceCreation < IDEMPOTENT_WINDOW_SECONDS) {
                    log.info("[OTP] Rapid duplicate request for '{}' within {}s. Suppressing duplicate SMTP email.",
                            normalizedKey, IDEMPOTENT_WINDOW_SECONDS);
                    return Optional.empty();
                }
                if (secondsSinceCreation < RESEND_COOLDOWN_SECONDS) {
                    long remaining = RESEND_COOLDOWN_SECONDS - secondsSinceCreation;
                    log.warn("[OTP] Cooldown active for '{}'. Remaining: {}s", normalizedKey, remaining);
                    throw new BusinessException(
                            ErrorCode.RATE_LIMIT_EXCEEDED,
                            "Please wait " + remaining + " seconds before requesting a new verification code."
                    );
                }
            }
        }

        cleanupExpiredEntries();

        String otp = String.format("%06d", random.nextInt(1000000));
        Instant expiresAt = now.plusSeconds(OTP_VALIDITY_SECONDS);
        otpCache.put(normalizedKey, new OtpRecord(otp, expiresAt, now));
        return Optional.of(otp);
    }

    /**
     * Legacy method for unconditional OTP generation (e.g., test fixtures).
     */
    public String generateOtp(String key) {
        if (key == null || key.trim().isEmpty()) {
            throw new BusinessException(ErrorCode.INVALID_REQUEST, "Email/Key cannot be blank.");
        }
        String normalizedKey = key.trim().toLowerCase();
        cleanupExpiredEntries();

        String otp = String.format("%06d", random.nextInt(1000000));
        Instant now = Instant.now();
        Instant expiresAt = now.plusSeconds(OTP_VALIDITY_SECONDS);
        otpCache.put(normalizedKey, new OtpRecord(otp, expiresAt, now));
        return otp;
    }

    public boolean validateOtp(String key, String otp) {
        if (key == null || otp == null) {
            return false;
        }
        String normalizedKey = key.trim().toLowerCase();
        OtpRecord record = otpCache.get(normalizedKey);
        if (record == null) {
            return false;
        }
        if (Instant.now().isAfter(record.expiresAt)) {
            otpCache.remove(normalizedKey);
            return false;
        }
        if (record.code.equals(otp.trim())) {
            otpCache.remove(normalizedKey);
            return true;
        } else {
            record.failedAttempts++;
            if (record.failedAttempts >= MAX_FAILED_ATTEMPTS) {
                otpCache.remove(normalizedKey); // Burn OTP after max failed attempts
            }
            return false;
        }
    }

    public void clearCache() {
        otpCache.clear();
    }

    private void cleanupExpiredEntries() {
        if (otpCache.size() > MAX_CACHE_SIZE / 2) {
            Instant now = Instant.now();
            otpCache.entrySet().removeIf(entry -> now.isAfter(entry.getValue().expiresAt));
        }
        if (otpCache.size() >= MAX_CACHE_SIZE) {
            log.warn("[OTP] Cache reached maximum limit ({}). Evicting entries.", MAX_CACHE_SIZE);
            otpCache.keySet().stream().limit(MAX_CACHE_SIZE / 4).forEach(otpCache::remove);
        }
    }
}
