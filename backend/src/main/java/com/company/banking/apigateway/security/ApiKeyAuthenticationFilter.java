package com.company.banking.apigateway.security;

import com.company.banking.apigateway.application.CreateApiKeyService;
import com.company.banking.apigateway.application.port.out.ApiKeyPersistencePort;
import com.company.banking.apigateway.domain.ApiKey;
import com.company.banking.common.exception.ErrorCode;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Collections;
import java.util.Optional;

@Component
@RequiredArgsConstructor
public class ApiKeyAuthenticationFilter extends OncePerRequestFilter {

    private final ApiKeyPersistencePort apiKeyPersistencePort;
    private final CidrWhitelistValidator cidrValidator;

    @Override
    protected void doFilterInternal(
            @NonNull HttpServletRequest request,
            @NonNull HttpServletResponse response,
            @NonNull FilterChain filterChain
    ) throws ServletException, IOException {
        String apiKeyHeader = request.getHeader("X-API-Key");

        if (apiKeyHeader == null || apiKeyHeader.trim().isEmpty()) {
            String authHeader = request.getHeader("Authorization");
            if (authHeader != null && authHeader.startsWith("Bearer ")) {
                String token = authHeader.substring(7).trim();
                if (token.startsWith("sk_")) {
                    apiKeyHeader = token;
                }
            }
        }

        if (apiKeyHeader != null && !apiKeyHeader.trim().isEmpty()) {
            String keyHash = CreateApiKeyService.hashKey(apiKeyHeader.trim());
            Optional<ApiKey> apiKeyOpt = apiKeyPersistencePort.findByKeyHash(keyHash);

            if (apiKeyOpt.isEmpty() || !apiKeyOpt.get().isActive()) {
                sendErrorResponse(response, HttpServletResponse.SC_FORBIDDEN, ErrorCode.UNAUTHORIZED.getCode(), "Invalid or revoked API key");
                return;
            }

            ApiKey apiKey = apiKeyOpt.get();

            // 1. Validate CIDR Whitelist
            String clientIp = resolveClientIp(request);
            if (!cidrValidator.isIpWhitelisted(clientIp, apiKey.getCidrWhitelist())) {
                sendErrorResponse(response, HttpServletResponse.SC_FORBIDDEN, ErrorCode.IP_NOT_WHITELISTED.getCode(), ErrorCode.IP_NOT_WHITELISTED.getDefaultMessage());
                return;
            }

            // 2. Validate Endpoint Scope (VULN 7 & 2: Method-aware validation with Fail-Closed)
            String requestPath = request.getRequestURI();
            String requestMethod = request.getMethod();
            String requiredScope = resolveRequiredScope(requestPath, requestMethod);

            if ("UNMAPPED_ENDPOINT".equals(requiredScope)) {
                sendErrorResponse(response, HttpServletResponse.SC_FORBIDDEN, ErrorCode.ENDPOINT_NOT_SCOPED.getCode(), ErrorCode.ENDPOINT_NOT_SCOPED.getDefaultMessage());
                return;
            }

            if (requiredScope != null && (apiKey.getScopes() == null || !apiKey.getScopes().contains(requiredScope))) {
                sendErrorResponse(response, HttpServletResponse.SC_FORBIDDEN, ErrorCode.INSUFFICIENT_API_SCOPE.getCode(), ErrorCode.INSUFFICIENT_API_SCOPE.getDefaultMessage());
                return;
            }

            // VULN 6: Use strongly-typed Authentication Token
            ApiKeyAuthenticationToken auth = new ApiKeyAuthenticationToken(
                    apiKeyHeader,
                    apiKey.getMerchantId(),
                    apiKey.getEnvironment(),
                    Collections.singletonList(new SimpleGrantedAuthority("ROLE_MERCHANT_API"))
            );
            SecurityContextHolder.getContext().setAuthentication(auth);
        }

        filterChain.doFilter(request, response);
    }

    private String resolveClientIp(HttpServletRequest request) {
        String xForwardedFor = request.getHeader("X-Forwarded-For");
        if (xForwardedFor != null && !xForwardedFor.trim().isEmpty()) {
            return xForwardedFor.split(",")[0].trim();
        }
        return request.getRemoteAddr();
    }

    private String resolveRequiredScope(String path, String method) {
        // Explicit Allowlist for genuinely open routes or gateway routes verified by API key
        if (path.startsWith("/api/v1/health") || path.startsWith("/v3/api-docs") || path.startsWith("/api/v1/gateway/")) {
            return null; 
        }

        // 1. Virtual Account Management (VAM)
        if (path.startsWith("/api/v1/accounts") && "POST".equalsIgnoreCase(method)) return "accounts:write";
        if (path.startsWith("/api/v1/accounts") && "GET".equalsIgnoreCase(method)) return "accounts:read";

        // 2. Payments
        if (path.startsWith("/api/v1/payments") && "POST".equalsIgnoreCase(method)) return "payments:write";

        // 3. Payroll & Batch Distribution
        if (path.startsWith("/api/v1/batch") && "POST".equalsIgnoreCase(method)) return "payroll:write";
        if (path.startsWith("/api/v1/batch") && "GET".equalsIgnoreCase(method)) return "payroll:read";

        // 4. Smart Routing
        if (path.startsWith("/api/v1/routing") && "POST".equalsIgnoreCase(method)) return "routing:write";
        if (path.startsWith("/api/v1/routing") && "GET".equalsIgnoreCase(method)) return "routing:read";

        // 5. Treasury & Transfers
        if (path.startsWith("/api/v1/transfers") && "POST".equalsIgnoreCase(method)) return "treasury:write";
        if (path.startsWith("/api/v1/treasury") && "GET".equalsIgnoreCase(method)) return "treasury:read";

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

    private void sendErrorResponse(HttpServletResponse response, int status, String code, String message) throws IOException {
        response.setStatus(status);
        response.setContentType("application/json");
        String json = String.format("{\"success\":false,\"error\":{\"code\":\"%s\",\"message\":\"%s\"}}", code, message);
        response.getWriter().write(json);
    }
}
