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

            // 2. Validate Endpoint Scope
            String requestPath = request.getRequestURI();
            String requiredScope = resolveRequiredScope(requestPath);
            if (requiredScope != null && (apiKey.getScopes() == null || !apiKey.getScopes().contains(requiredScope))) {
                sendErrorResponse(response, HttpServletResponse.SC_FORBIDDEN, ErrorCode.INSUFFICIENT_API_SCOPE.getCode(), ErrorCode.INSUFFICIENT_API_SCOPE.getDefaultMessage());
                return;
            }

            // Authenticate API key caller
            UsernamePasswordAuthenticationToken auth = new UsernamePasswordAuthenticationToken(
                    apiKey.getName(),
                    null,
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

    private String resolveRequiredScope(String path) {
        if (path.startsWith("/api/v1/payments")) return "payments:write";
        if (path.startsWith("/api/v1/batch")) return "payroll:approve";
        if (path.startsWith("/api/v1/routing")) return "routing:evaluate";
        if (path.startsWith("/api/v1/transfers")) return "treasury:write";
        if (path.startsWith("/api/v1/ledger")) return "ledger:read";
        if (path.startsWith("/api/v1/risk")) return "risk:evaluate";
        return null;
    }

    private void sendErrorResponse(HttpServletResponse response, int status, String code, String message) throws IOException {
        response.setStatus(status);
        response.setContentType("application/json");
        String json = String.format("{\"success\":false,\"error\":{\"code\":\"%s\",\"message\":\"%s\"}}", code, message);
        response.getWriter().write(json);
    }
}
