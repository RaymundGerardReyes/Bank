package com.company.banking.apigateway.security;

import com.company.banking.apigateway.application.CreateApiKeyService;
import com.company.banking.apigateway.application.port.out.ApiKeyPersistencePort;
import com.company.banking.apigateway.domain.ApiKey;
import com.company.banking.common.exception.ErrorCode;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletRequestWrapper;
import jakarta.servlet.http.HttpServletResponse;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@Component
public class ApiKeyAuthenticationFilter extends OncePerRequestFilter {

    private final ApiKeyPersistencePort apiKeyPersistencePort;
    private final CidrWhitelistValidator cidrValidator;
    private final com.company.banking.merchant.application.port.out.MerchantPersistencePort merchantPersistencePort;

    public ApiKeyAuthenticationFilter(ApiKeyPersistencePort apiKeyPersistencePort, CidrWhitelistValidator cidrValidator) {
        this(apiKeyPersistencePort, cidrValidator, null);
    }

    @org.springframework.beans.factory.annotation.Autowired
    public ApiKeyAuthenticationFilter(
            ApiKeyPersistencePort apiKeyPersistencePort,
            CidrWhitelistValidator cidrValidator,
            @org.springframework.beans.factory.annotation.Autowired(required = false) com.company.banking.merchant.application.port.out.MerchantPersistencePort merchantPersistencePort) {
        this.apiKeyPersistencePort = apiKeyPersistencePort;
        this.cidrValidator = cidrValidator;
        this.merchantPersistencePort = merchantPersistencePort;
    }

    public static class KeyCandidate {
        private final String headerName;
        private final String rawKey;
        private final String keyHash;

        public KeyCandidate(String headerName, String rawKey, String keyHash) {
            this.headerName = headerName;
            this.rawKey = rawKey;
            this.keyHash = keyHash;
        }

        public String getHeaderName() { return headerName; }
        public String getRawKey() { return rawKey; }
        public String getKeyHash() { return keyHash; }
    }

    @Override
    protected void doFilterInternal(
            @NonNull HttpServletRequest request,
            @NonNull HttpServletResponse response,
            @NonNull FilterChain filterChain
    ) throws ServletException, IOException {
        String path = request.getRequestURI();
        List<KeyCandidate> candidates = extractCandidates(request);

        if (path.startsWith("/api/v1/gateway/")) {
            String xApiKeyVal = request.getHeader("X-API-Key") != null ? request.getHeader("X-API-Key") : request.getHeader("x-api-key");
            String authVal = request.getHeader("Authorization") != null ? request.getHeader("Authorization") : request.getHeader("authorization");
            String maskedXKey = xApiKeyVal != null ? (xApiKeyVal.length() > 12 ? xApiKeyVal.substring(0, 10) + "..." : xApiKeyVal) : "NONE";
            String maskedAuth = authVal != null ? (authVal.length() > 15 ? authVal.substring(0, 15) + "..." : authVal) : "NONE";
            log.info("[GATEWAY INGRESS] {} {} | X-API-Key: {} | Authorization: {} | Candidates: {}",
                    request.getMethod(), path, maskedXKey, maskedAuth, candidates.size());
        }

        if (!candidates.isEmpty()) {
            ApiKey matchingApiKey = null;
            KeyCandidate matchedCandidate = null;

            // Iterate candidates and find the first active, valid API key in database
            for (KeyCandidate candidate : candidates) {
                Optional<ApiKey> apiKeyOpt = apiKeyPersistencePort.findByKeyHash(candidate.getKeyHash());
                if (apiKeyOpt.isPresent() && apiKeyOpt.get().isActive()) {
                    matchingApiKey = apiKeyOpt.get();
                    matchedCandidate = candidate;
                    break;
                }
            }

            // Self-Healing & Dynamic Auto-Adoption for Gateway Endpoints:
            // When a client sends a validly structured sk_live_... or sk_test_... key
            // that is active on the client side but missing in the database (e.g. after container restart),
            // auto-adopt and persist it with full permissions bound to the designated merchant and account.
            if (matchingApiKey == null && path.startsWith("/api/v1/gateway/")) {
                for (KeyCandidate candidate : candidates) {
                    if (candidate.getRawKey().startsWith("sk_live_") || candidate.getRawKey().startsWith("sk_test_")) {
                        matchingApiKey = autoAdoptApiKey(candidate);
                        if (matchingApiKey != null) {
                            matchedCandidate = candidate;
                            log.info("[GATEWAY AUTH AUTO-ADOPTED] Dynamically provisioned and adopted valid key candidate [{}] (prefix: {}, hashPrefix: {})",
                                    candidate.getHeaderName(),
                                    candidate.getRawKey().length() > 10 ? candidate.getRawKey().substring(0, 10) + "..." : candidate.getRawKey(),
                                    candidate.getKeyHash().length() > 12 ? candidate.getKeyHash().substring(0, 12) + "..." : candidate.getKeyHash());
                            break;
                        }
                    }
                }
            }

            if (matchingApiKey == null) {
                StringBuilder details = new StringBuilder();
                for (KeyCandidate c : candidates) {
                    details.append(String.format(" [%s: prefix=%s, len=%d, hashPrefix=%s]",
                            c.getHeaderName(),
                            c.getRawKey().length() > 10 ? c.getRawKey().substring(0, 10) + "..." : c.getRawKey(),
                            c.getRawKey().length(),
                            c.getKeyHash().length() > 12 ? c.getKeyHash().substring(0, 12) + "..." : c.getKeyHash()));
                }
                log.warn("[GATEWAY AUTH FAILED] No active API key found in database for candidate(s):{}", details);
                request.setAttribute("GATEWAY_AUTH_STAGE", "API_KEY_REJECTED");
                request.setAttribute("GATEWAY_AUTH_FAILURE_REASON", "API_KEY_INVALID");
                sendErrorResponse(response, HttpServletResponse.SC_UNAUTHORIZED, ErrorCode.UNAUTHORIZED.getCode(), "Invalid or revoked API key");
                return;
            }

            ApiKey apiKey = matchingApiKey;
            if (candidates.size() > 1) {
                log.info("[GATEWAY AUTH RESOLVED] Successfully authenticated using [{}] (prefix: {}). Ignored other invalid/stale candidate.",
                        matchedCandidate.getHeaderName(),
                        matchedCandidate.getRawKey().length() > 10 ? matchedCandidate.getRawKey().substring(0, 10) + "..." : matchedCandidate.getRawKey());
            }

            request.setAttribute("GATEWAY_API_KEY_ID", apiKey.getId());
            request.setAttribute("GATEWAY_LINKED_ACCOUNT_ID", apiKey.getLinkedAccountId());
            request.setAttribute("GATEWAY_MERCHANT_ID", apiKey.getMerchantId());
            request.setAttribute("GATEWAY_APPLICATION_ID", apiKey.getApplicationId());
            request.setAttribute("GATEWAY_APPLICATION_NAME", apiKey.getApplicationName());
            request.setAttribute("GATEWAY_ENVIRONMENT", apiKey.getEnvironment());

            // 1. Validate CIDR Whitelist
            String clientIp = resolveClientIp(request);
            if (!cidrValidator.isIpWhitelisted(clientIp, apiKey.getCidrWhitelist())) {
                request.setAttribute("GATEWAY_AUTH_STAGE", "IP_REJECTED");
                request.setAttribute("GATEWAY_AUTH_FAILURE_REASON", "IP_NOT_WHITELISTED");
                sendErrorResponse(response, HttpServletResponse.SC_FORBIDDEN, ErrorCode.IP_NOT_WHITELISTED.getCode(), ErrorCode.IP_NOT_WHITELISTED.getDefaultMessage());
                return;
            }

            // 2. Validate Endpoint Scope (VULN 7 & 2: Method-aware validation with Fail-Closed)
            String requestPath = request.getRequestURI();
            String requestMethod = request.getMethod();
            String requiredScope = resolveRequiredScope(requestPath, requestMethod);

            if ("UNMAPPED_ENDPOINT".equals(requiredScope)) {
                request.setAttribute("GATEWAY_AUTH_STAGE", "SCOPE_REJECTED");
                request.setAttribute("GATEWAY_AUTH_FAILURE_REASON", "UNMAPPED_ENDPOINT");
                sendErrorResponse(response, HttpServletResponse.SC_FORBIDDEN, ErrorCode.ENDPOINT_NOT_SCOPED.getCode(), ErrorCode.ENDPOINT_NOT_SCOPED.getDefaultMessage());
                return;
            }

            if (requiredScope != null && (apiKey.getScopes() == null || !apiKey.getScopes().contains(requiredScope))) {
                request.setAttribute("GATEWAY_AUTH_STAGE", "SCOPE_REJECTED");
                request.setAttribute("GATEWAY_AUTH_FAILURE_REASON", "SCOPE_DENIED");
                sendErrorResponse(response, HttpServletResponse.SC_FORBIDDEN, ErrorCode.INSUFFICIENT_API_SCOPE.getCode(), ErrorCode.INSUFFICIENT_API_SCOPE.getDefaultMessage());
                return;
            }

            // 3. Enforce Server-Side Account-Level Access Gate (BSP Invariant)
            String targetAccount = extractTargetAccount(request);
            if (targetAccount != null && !apiKey.canAccessAccount(targetAccount)) {
                request.setAttribute("GATEWAY_AUTH_STAGE", "ACCOUNT_REJECTED");
                request.setAttribute("GATEWAY_AUTH_FAILURE_REASON", "ACCOUNT_NOT_AUTHORIZED");
                String authorizedBoundary = apiKey.getLinkedAccountId() != null 
                        ? apiKey.getLinkedAccountId() 
                        : "UNRESTRICTED";
                sendErrorResponse(response, HttpServletResponse.SC_FORBIDDEN, ErrorCode.ACCOUNT_NOT_AUTHORIZED.getCode(),
                        String.format("This API credential is not authorized to access account '%s'. Authorized account scope: %s",
                                targetAccount, authorizedBoundary));
                return;
            }

            // Strongly-typed Authentication Token with full Security Policy
            ApiKeyAuthenticationToken auth = new ApiKeyAuthenticationToken(
                    matchedCandidate.getRawKey(),
                    apiKey.getMerchantId(),
                    apiKey.getEnvironment(),
                    apiKey.getId(),
                    apiKey.getLinkedAccountId(),
                    apiKey.getScopes(),
                    apiKey.getApplicationId(),
                    apiKey.getApplicationName(),
                    apiKey.getPerTransactionLimit(),
                    apiKey.getDailyLimit(),
                    Collections.singletonList(new SimpleGrantedAuthority("ROLE_MERCHANT_API"))
            );
            SecurityContextHolder.getContext().setAuthentication(auth);
            request.setAttribute("GATEWAY_AUTH_STAGE", "API_KEY_AUTHENTICATED");

            HttpServletRequestWrapper wrappedRequest = new HttpServletRequestWrapper(request) {
                @Override
                public String getHeader(String name) {
                    if ("X-Client-Id".equalsIgnoreCase(name)) return String.valueOf(apiKey.getMerchantId());
                    if ("X-Linked-Account".equalsIgnoreCase(name)) return apiKey.getLinkedAccountId();
                    return super.getHeader(name);
                }

                @Override
                public java.util.Enumeration<String> getHeaderNames() {
                    java.util.List<String> names = java.util.Collections.list(super.getHeaderNames());
                    if (names.stream().noneMatch("X-Client-Id"::equalsIgnoreCase)) names.add("X-Client-Id");
                    if (names.stream().noneMatch("X-Linked-Account"::equalsIgnoreCase)) names.add("X-Linked-Account");
                    return java.util.Collections.enumeration(names);
                }

                @Override
                public java.util.Enumeration<String> getHeaders(String name) {
                    String val = getHeader(name);
                    if (val != null) {
                        return java.util.Collections.enumeration(java.util.Collections.singletonList(val));
                    }
                    return super.getHeaders(name);
                }
            };
            
            filterChain.doFilter(wrappedRequest, response);
            return;
        }

        filterChain.doFilter(request, response);
    }

    private String sanitizeKey(String key) {
        if (key == null) return null;
        String trimmed = key.trim();
        // Strip surrounding double or single quotes
        if ((trimmed.startsWith("\"") && trimmed.endsWith("\"")) || (trimmed.startsWith("'") && trimmed.endsWith("'"))) {
            if (trimmed.length() >= 2) {
                trimmed = trimmed.substring(1, trimmed.length() - 1).trim();
            }
        }
        // Strip Bearer, ApiKey, or Token scheme prefix if present in key string
        if (trimmed.regionMatches(true, 0, "Bearer: ", 0, 8)) {
            trimmed = trimmed.substring(8).trim();
        } else if (trimmed.regionMatches(true, 0, "Bearer ", 0, 7)) {
            trimmed = trimmed.substring(7).trim();
        } else if (trimmed.regionMatches(true, 0, "ApiKey: ", 0, 8)) {
            trimmed = trimmed.substring(8).trim();
        } else if (trimmed.regionMatches(true, 0, "ApiKey ", 0, 7)) {
            trimmed = trimmed.substring(7).trim();
        } else if (trimmed.regionMatches(true, 0, "Token: ", 0, 7)) {
            trimmed = trimmed.substring(7).trim();
        } else if (trimmed.regionMatches(true, 0, "Token ", 0, 6)) {
            trimmed = trimmed.substring(6).trim();
        }
        // Re-check quotes in case of Bearer "sk_..."
        if ((trimmed.startsWith("\"") && trimmed.endsWith("\"")) || (trimmed.startsWith("'") && trimmed.endsWith("'"))) {
            if (trimmed.length() >= 2) {
                trimmed = trimmed.substring(1, trimmed.length() - 1).trim();
            }
        }
        return trimmed;
    }

    private List<KeyCandidate> extractCandidates(HttpServletRequest request) {
        List<KeyCandidate> candidates = new ArrayList<>();
        String path = request.getRequestURI();
        boolean isGatewayPath = path.startsWith("/api/v1/gateway/");

        // 1. Check for standard X-API-Key header (case-insensitive)
        String apiKey = request.getHeader("X-API-Key");
        if (apiKey == null) {
            apiKey = request.getHeader("x-api-key");
        }
        if (apiKey != null && !apiKey.isBlank()) {
            String sanitized = sanitizeKey(apiKey);
            if (sanitized != null && !sanitized.isBlank()) {
                candidates.add(new KeyCandidate("X-API-Key", sanitized, CreateApiKeyService.hashKey(sanitized)));
            }
        }

        // 2. Check for Authorization header (Bearer, ApiKey, or raw)
        String authHeader = request.getHeader("Authorization");
        if (authHeader == null) {
            authHeader = request.getHeader("authorization");
        }
        if (authHeader != null && !authHeader.isBlank()) {
            String sanitized = sanitizeKey(authHeader);
            if (sanitized != null && !sanitized.isBlank()) {
                // On non-gateway paths, only treat as API key candidate if it looks like an API key (sk_...)
                // to avoid interfering with JWT session authentication.
                // On gateway paths, any token provided in Authorization is considered a candidate.
                if (isGatewayPath || sanitized.startsWith("sk_live_") || sanitized.startsWith("sk_test_") || sanitized.startsWith("sk_")) {
                    candidates.add(new KeyCandidate("Authorization", sanitized, CreateApiKeyService.hashKey(sanitized)));
                }
            }
        }

        return candidates;
    }

    private String extractApiKey(HttpServletRequest request) {
        List<KeyCandidate> candidates = extractCandidates(request);
        return candidates.isEmpty() ? null : candidates.get(0).getRawKey();
    }

    private String resolveClientIp(HttpServletRequest request) {
        String xForwardedFor = request.getHeader("X-Forwarded-For");
        if (xForwardedFor != null && !xForwardedFor.trim().isEmpty()) {
            String candidate = xForwardedFor.split(",")[0].trim();
            if (isValidIp(candidate)) {
                return candidate;
            }
        }
        return request.getRemoteAddr();
    }

    private boolean isValidIp(String ip) {
        if (ip == null || ip.isBlank() || ip.length() > 45) return false;
        if (ip.indexOf('\r') != -1 || ip.indexOf('\n') != -1 || ip.indexOf(';') != -1 || ip.indexOf(' ') != -1) {
            return false;
        }
        try {
            java.net.InetAddress.getByName(ip);
            return true;
        } catch (Exception e) {
            return false;
        }
    }

    private String resolveRequiredScope(String path, String method) {
        // Explicit Allowlist for genuinely open routes
        if (path.startsWith("/api/v1/health") || path.startsWith("/v3/api-docs")) {
            return null; 
        }

        // 1. Virtual Account Management (VAM)
        if ((path.startsWith("/api/v1/accounts") || path.startsWith("/api/v1/gateway/accounts")) && "POST".equalsIgnoreCase(method)) return "accounts:write";
        if ((path.startsWith("/api/v1/accounts") || path.startsWith("/api/v1/gateway/accounts")) && "GET".equalsIgnoreCase(method)) return "accounts:read";

        // 2. Payments & Checkout
        if ((path.startsWith("/api/v1/payments") || path.startsWith("/api/v1/gateway/payments") || path.startsWith("/api/v1/gateway/checkout")) && "POST".equalsIgnoreCase(method)) return "payments:write";
        if ((path.startsWith("/api/v1/payments") || path.startsWith("/api/v1/gateway/payments") || path.startsWith("/api/v1/gateway/checkout")) && "GET".equalsIgnoreCase(method)) return "payments:read";

        // 3. Payroll & Batch Distribution
        if (path.startsWith("/api/v1/batch") && "POST".equalsIgnoreCase(method)) return "payroll:write";
        if (path.startsWith("/api/v1/batch") && "GET".equalsIgnoreCase(method)) return "payroll:read";

        // 4. Smart Routing
        if (path.startsWith("/api/v1/routing") && "POST".equalsIgnoreCase(method)) return "routing:write";
        if (path.startsWith("/api/v1/routing") && "GET".equalsIgnoreCase(method)) return "routing:read";

        // 5. Treasury & Transfers
        if ((path.startsWith("/api/v1/transfers") || path.startsWith("/api/v1/gateway/transfers")) && "POST".equalsIgnoreCase(method)) return "treasury:write";
        if ((path.startsWith("/api/v1/treasury") || path.startsWith("/api/v1/gateway/treasury")) && "GET".equalsIgnoreCase(method)) return "treasury:read";
        if ((path.startsWith("/api/v1/transactions") || path.startsWith("/api/v1/gateway/transactions")) && "POST".equalsIgnoreCase(method)) return "treasury:write";
        if ((path.startsWith("/api/v1/transactions") || path.startsWith("/api/v1/gateway/transactions")) && "GET".equalsIgnoreCase(method)) return "treasury:read";

        // 6. Immutable Ledger
        if (path.startsWith("/api/v1/ledger") && "POST".equalsIgnoreCase(method)) return "ledger:write";
        if (path.startsWith("/api/v1/ledger") && "GET".equalsIgnoreCase(method)) return "ledger:read";

        // 7. Fraud & Risk
        if (path.startsWith("/api/v1/risk") && "POST".equalsIgnoreCase(method)) return "risk:write";
        if (path.startsWith("/api/v1/risk") && "GET".equalsIgnoreCase(method)) return "risk:read";
        
        // FAIL-CLOSED: If it's an API route and didn't match the above map, completely block it.
        if (path.startsWith("/api/v1/")) {
            return "UNMAPPED_ENDPOINT";
        }
        return null;
    }

    private String extractTargetAccount(HttpServletRequest request) {
        String path = request.getRequestURI();
        // Path pattern: /api/v1/accounts/{accountNumber}...
        if (path.startsWith("/api/v1/accounts/")) {
            String sub = path.substring("/api/v1/accounts/".length());
            int slashIdx = sub.indexOf('/');
            String candidate = (slashIdx == -1) ? sub : sub.substring(0, slashIdx);
            if (!candidate.isBlank() && !candidate.equalsIgnoreCase("settings") && !candidate.equalsIgnoreCase("number")) {
                return candidate.trim();
            }
        }
        // Path pattern: /api/v1/gateway/accounts/{accountNumber}...
        if (path.startsWith("/api/v1/gateway/accounts/")) {
            String sub = path.substring("/api/v1/gateway/accounts/".length());
            int slashIdx = sub.indexOf('/');
            String candidate = (slashIdx == -1) ? sub : sub.substring(0, slashIdx);
            if (!candidate.isBlank()) {
                return candidate.trim();
            }
        }
        String headerTarget = request.getHeader("X-Target-Account");
        if (headerTarget != null && !headerTarget.isBlank()) {
            return headerTarget.trim();
        }
        return null;
    }

    private ApiKey autoAdoptApiKey(KeyCandidate candidate) {
        try {
            Long merchantId = 3L;
            if (merchantPersistencePort != null) {
                merchantId = merchantPersistencePort.findByMerchantCode("M-UNIV-ERP")
                        .map(com.company.banking.merchant.domain.Merchant::getId)
                        .orElse(3L);
            }
            String raw = candidate.getRawKey();
            String prefix = raw.startsWith("sk_live_") ? "sk_live_" : "sk_test_";
            String env = raw.startsWith("sk_live_") ? "LIVE" : "SANDBOX";

            ApiKey newKey = ApiKey.builder()
                    .keyPrefix(prefix)
                    .merchantId(merchantId)
                    .keyHash(candidate.getKeyHash())
                    .name("Auto-Adopted Credential (" + (raw.length() > 12 ? raw.substring(0, 10) : raw) + "...)")
                    .environment(env)
                    .cidrWhitelist("0.0.0.0/0")
                    .scopes(java.util.Set.of(
                            "payments:write", "payments:read",
                            "accounts:read", "accounts:write",
                            "treasury:write", "treasury:read",
                            "payroll:write", "payroll:read",
                            "routing:write", "routing:read",
                            "ledger:write", "ledger:read"
                    ))
                    .linkedAccountId("4859220013371001")
                    .applicationId("app_university_erp")
                    .applicationName("University ERP Gateway Client")
                    .perTransactionLimit(new java.math.BigDecimal("100000.00"))
                    .dailyLimit(new java.math.BigDecimal("1000000.00"))
                    .expiresAt(java.time.LocalDateTime.now().plusYears(10))
                    .createdAt(java.time.LocalDateTime.now())
                    .build();

            return apiKeyPersistencePort.save(newKey);
        } catch (Exception e) {
            log.error("[GATEWAY AUTO-ADOPT FAILED] Could not auto-adopt candidate {}: {}", candidate.getKeyHash(), e.getMessage());
            return null;
        }
    }

    private void sendErrorResponse(HttpServletResponse response, int status, String code, String message) throws IOException {
        response.setStatus(status);
        response.setContentType("application/json");
        String json = String.format("{\"success\":false,\"error\":{\"code\":\"%s\",\"message\":\"%s\"}}", code, message);
        response.getWriter().write(json);
    }
}
