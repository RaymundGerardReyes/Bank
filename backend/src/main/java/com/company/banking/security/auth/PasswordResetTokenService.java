package com.company.banking.security.auth;

import com.company.banking.common.exception.BusinessException;
import com.company.banking.common.exception.ErrorCode;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.Map;
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
    private static final long EXPIRATION_MINUTES = 15;

    public String generateResetToken(String email) {
        String token = UUID.randomUUID().toString();
        Instant expiry = Instant.now().plusSeconds(EXPIRATION_MINUTES * 60);
        tokenStorage.put(token, new TokenInfo(email, expiry));
        return token;
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