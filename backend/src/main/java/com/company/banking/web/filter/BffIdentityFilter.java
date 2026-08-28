package com.company.banking.web.filter;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Slf4j
@Component
public class BffIdentityFilter extends OncePerRequestFilter {

    private static final String BFF_HEADER_NAME = "X-Internal-BFF-Key";

    @Value("${security.bff.secret:}")
    private String expectedBffSecret;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

        String path = request.getRequestURI();

        // Allow operational routes, OpenAPI specs, and API-key authenticated public API requests.
        if (path.startsWith("/actuator")
                || path.startsWith("/v3/api-docs")
                || path.startsWith("/api/v1/auth/")
                || path.startsWith("/api/v1/webhooks/payment/")
                || path.startsWith("/api/v1/checkout/sessions/")
                || path.startsWith("/ws/")
                || path.equals("/status")
                || path.equals("/error")
                || path.startsWith("/api/v1/gateway/")
                || hasApiKeyCredential(request)) {
            filterChain.doFilter(request, response);
            return;
        }

        // If no secret is configured in dev environment, bypass validation with warning
        if (!StringUtils.hasText(expectedBffSecret)) {
            filterChain.doFilter(request, response);
            return;
        }

        String providedKey = request.getHeader(BFF_HEADER_NAME);

        if (providedKey == null || !providedKey.equals(expectedBffSecret)) {
            log.warn("[SECURITY] Blocked direct API access attempt to {} - Invalid or missing BFF key.", path);
            
            request.setAttribute("GATEWAY_AUTH_STAGE", "BFF_REJECTED");
            request.setAttribute("GATEWAY_AUTH_FAILURE_REASON", "BFF_KEY_MISSING_OR_INVALID");

            response.setStatus(HttpStatus.UNAUTHORIZED.value());
            response.setContentType(MediaType.APPLICATION_JSON_VALUE);
            response.getWriter().write("{\"success\": false, \"message\": \"Unauthorized: Direct API access is forbidden.\"}");
            return;
        }

        filterChain.doFilter(request, response);
    }

    private boolean hasApiKeyCredential(HttpServletRequest request) {
        String apiKey = request.getHeader("X-API-Key");
        if (apiKey != null && apiKey.trim().startsWith("sk_")) {
            return true;
        }

        String authHeader = request.getHeader("Authorization");
        if (!StringUtils.hasText(authHeader)) {
            return false;
        }

        String trimmed = authHeader.trim();
        if (trimmed.startsWith("Bearer ")) {
            return trimmed.substring(7).trim().startsWith("sk_");
        }
        if (trimmed.startsWith("ApiKey ")) {
            return trimmed.substring(7).trim().startsWith("sk_");
        }
        return trimmed.startsWith("sk_");
    }
}
