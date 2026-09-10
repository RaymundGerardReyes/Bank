package com.company.banking.security.auth;

import com.company.banking.common.exception.BusinessException;
import com.company.banking.common.exception.ErrorCode;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class PasswordResetTokenService {

    private static class TokenInfo {
        final String email;
        final Instant expiryTime;

        TokenInfo(String email, Instant expiryTime) {
            this.email = email;
            this.expiryTime = expiryTime;
        }
    }

    private final Map<String, TokenInfo> tokenStorage = new ConcurrentHashMap<>();
    private final Map<String, Instant> lastRequestByEmail = new ConcurrentHashMap<>();
    private static final long EXPIRATION_MINUTES = 15;
    private static final long RESET_COOLDOWN_SECONDS = 60;
    private static final int MAX_STORAGE_SIZE = 10_000;

    public Optional<java.lang.String> generateResetTokenIfAllowed(String email) {
        if (email == null || email.trim().isEmpty()) {
            throw new BusinessException(ErrorCode.INVALID_REQUEST, "Email cannot be empty.");
        }
        String normalizedEmail = email.trim().toLowerCase();
        Instant now = Instant.now();

        Instant lastRequest = lastRequestByEmail.get(normalizedEmail);
        if (lastRequest != null && java.time.Duration.between(lastRequest, now).getSeconds() < RESET_COOLDOWN_SECONDS) {
            return Optional.empty();
        }

        cleanupExpiredTokens();

        String token = UUID.randomUUID().toString();
        Instant expiry = now.plusSeconds(EXPIRATION_MINUTES * 60);
        tokenStorage.put(token, new TokenInfo(normalizedEmail, expiry));
        lastRequestByEmail.put(normalizedEmail, now);
        return Optional.of(token);
    }

    public String generateResetToken(String email) {
        String token = UUID.randomUUID().toString();
        Instant expiry = Instant.now().plusSeconds(EXPIRATION_MINUTES * 60);
        tokenStorage.put(token, new TokenInfo(email, expiry));
        return token;
    }

    private void cleanupExpiredTokens() {
        if (tokenStorage.size() > MAX_STORAGE_SIZE / 2) {
            Instant now = Instant.now();
            tokenStorage.entrySet().removeIf(entry -> now.isAfter(entry.getValue().expiryTime));
            lastRequestByEmail.entrySet().removeIf(entry -> java.time.Duration.between(entry.getValue(), now).getSeconds() > RESET_COOLDOWN_SECONDS);
        }
        if (tokenStorage.size() >= MAX_STORAGE_SIZE) {
            tokenStorage.keySet().stream().limit(MAX_STORAGE_SIZE / 4).forEach(tokenStorage::remove);
        }
    }

    public String validateTokenAndGetEmail(String token) {
        if (token == null || token.trim().isEmpty()) {
            throw new BusinessException(ErrorCode.INVALID_REQUEST, "Token cannot be empty.");
        }
        
        // ATOMIC FIX: .remove() fetches the token and deletes it from memory in one step!
        TokenInfo info = tokenStorage.remove(token.trim());
        
        if (info == null) {
            throw new BusinessException(ErrorCode.INVALID_REQUEST, "Invalid or expired password reset token.");
        }
        if (Instant.now().isAfter(info.expiryTime)) {
            throw new BusinessException(ErrorCode.INVALID_REQUEST, "Password reset token has expired. Please request a new link.");
        }
        return info.email;
    }
}