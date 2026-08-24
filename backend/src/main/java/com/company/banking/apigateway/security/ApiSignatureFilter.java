package com.company.banking.apigateway.security;

import com.company.banking.apigateway.domain.ApiClient;
import com.company.banking.apigateway.infrastructure.ApiClientJpaRepository;
import com.company.banking.common.audit.AuditEventPublisher;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.io.IOException;
import java.time.Instant;
import java.util.Optional;
import java.util.concurrent.ConcurrentHashMap;

@RequiredArgsConstructor
@Slf4j
public class ApiSignatureFilter extends OncePerRequestFilter {

    private final ApiClientJpaRepository apiClientJpaRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuditEventPublisher auditEventPublisher;
    
    // In-memory cache for nonces to prevent replay attacks (in production, use Redis)
    private final ConcurrentHashMap<String, Instant> nonceCache = new ConcurrentHashMap<>();

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

        // Only apply this filter to the Public Payment Gateway API boundary
        if (!request.getRequestURI().startsWith("/api/v1/gateway")) {
            filterChain.doFilter(request, response);
            return;
        }

        String clientId = request.getHeader("X-Client-Id");
        String signature = request.getHeader("X-Signature");
        String timestamp = request.getHeader("X-Timestamp");
        String nonce = request.getHeader("X-Nonce");

        if (clientId == null || signature == null || timestamp == null || nonce == null) {
            rejectRequest(response, "INVALID_REQUEST", "Missing required API security headers (X-Client-Id, X-Signature, X-Timestamp, X-Nonce)");
            return;
        }

        // 1. Replay Protection: Timestamp Validation (within 5 minutes)
        try {
            long requestTime = Long.parseLong(timestamp);
            long currentTime = Instant.now().toEpochMilli();
            if (Math.abs(currentTime - requestTime) > 300_000) { // 5 minutes tolerance
                auditEventPublisher.publishEvent("API_REPLAY_ATTACK_DETECTED", clientId, "Request timestamp too old or too far in the future.", nonce);
                rejectRequest(response, "AUTHORIZATION_FAILED", "Timestamp validation failed. Possible replay attack.");
                return;
            }
        } catch (NumberFormatException e) {
            rejectRequest(response, "INVALID_REQUEST", "Invalid X-Timestamp format.");
            return;
        }

        // 2. Replay Protection: Nonce Validation
        if (nonceCache.containsKey(nonce)) {
            auditEventPublisher.publishEvent("API_REPLAY_ATTACK_DETECTED", clientId, "Duplicate Nonce detected.", nonce);
            rejectRequest(response, "AUTHORIZATION_FAILED", "Duplicate request nonce. Replay attack blocked.");
            return;
        }
        nonceCache.put(nonce, Instant.now()); // Store nonce

        // 3. API Client Identity Verification
        Optional<ApiClient> clientOpt = apiClientJpaRepository.findByClientId(clientId);
        if (clientOpt.isEmpty() || !"ACTIVE".equals(clientOpt.get().getStatus())) {
            rejectRequest(response, "INVALID_CREDENTIAL", "API Client not found or suspended.");
            return;
        }

        ApiClient client = clientOpt.get();

        // 4. Signature Verification
        // In a real implementation, the client computes HMAC-SHA256(secret, method + path + timestamp + body + nonce)
        // Here we simulate the verification of that payload against the stored hashed secret.
        // For demonstration, we assume the 'signature' passed is literally the plaintext secret that we check via BCrypt, 
        // OR the signature is an HMAC and we look up the secret (which means we shouldn't hash the secret in the DB if we need it for HMAC validation, 
        // OR we use public/private key pairs).
        
        // Since we hashed the secret in Phase 2, the client must send their raw secret as a Bearer token or we use asymmetric keys.
        // To maintain the "hashed secret" architecture, the client must pass the secret via an Authorization header 
        // and we check it using passwordEncoder.
        String authHeader = request.getHeader("Authorization");
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            rejectRequest(response, "INVALID_CREDENTIAL", "Missing or invalid Authorization header");
            return;
        }
        
        String rawSecret = authHeader.substring(7);
        if (!passwordEncoder.matches(rawSecret, client.getClientSecretHash())) {
            auditEventPublisher.publishEvent("API_AUTH_FAILED", clientId, "Invalid API secret provided.", nonce);
            rejectRequest(response, "AUTHENTICATION_FAILED", "Invalid API credentials.");
            return;
        }

        // Setup security context (Mocked here, but in Spring Security we'd set an Authentication object)
        request.setAttribute("API_CLIENT_ID", client.getId());
        request.setAttribute("MERCHANT_ID", client.getMerchantId());
        request.setAttribute("ENVIRONMENT", client.getEnvironment());
        request.setAttribute("SCOPES", client.getScopes());

        log.info("[API GATEWAY] Authenticated Client: {} for Merchant: {}", clientId, client.getMerchantId());
        
        filterChain.doFilter(request, response);
    }

    private void rejectRequest(HttpServletResponse response, String code, String message) throws IOException {
        response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
        response.setContentType("application/json");
        String errorJson = String.format("{\"code\":\"%s\", \"message\":\"%s\", \"timestamp\":\"%s\"}", 
                code, message, Instant.now().toString());
        response.getWriter().write(errorJson);
    }
}
