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

        // Allow actuator, OpenAPI specs, and status endpoints to bypass BFF key validation
        if (path.startsWith("/actuator") || path.startsWith("/v3/api-docs") || path.equals("/status") || path.equals("/error")) {
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

            response.setStatus(HttpStatus.UNAUTHORIZED.value());
            response.setContentType(MediaType.APPLICATION_JSON_VALUE);
            response.getWriter().write("{\"success\": false, \"message\": \"Unauthorized: Direct API access is forbidden.\"}");
            return;
        }

        filterChain.doFilter(request, response);
    }
}
