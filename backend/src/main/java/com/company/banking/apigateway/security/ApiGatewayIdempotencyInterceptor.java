package com.company.banking.apigateway.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.time.Instant;

@Component
@RequiredArgsConstructor
@Slf4j
public class ApiGatewayIdempotencyInterceptor extends OncePerRequestFilter {

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

        // Only enforce idempotency on POST/PUT requests to the API Gateway
        if (request.getRequestURI().startsWith("/api/v1/gateway") && 
            ("POST".equalsIgnoreCase(request.getMethod()) || "PUT".equalsIgnoreCase(request.getMethod()))) {
            
            String idempotencyKey = request.getHeader("Idempotency-Key");

            if (idempotencyKey == null || idempotencyKey.trim().isEmpty()) {
                log.warn("[API GATEWAY] Rejected request due to missing Idempotency-Key header.");
                response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
                response.setContentType("application/json");
                response.getWriter().write(String.format("{\"code\":\"INVALID_REQUEST\", \"message\":\"Missing Idempotency-Key header. This is strictly required for POST/PUT operations.\", \"timestamp\":\"%s\"}", Instant.now().toString()));
                return;
            }
            
            // Note: The actual lookup of the Idempotency-Key against the Ledger or cache
            // will occur downstream in the Application Services (e.g., LedgerPersistencePort.existsByIdempotencyKey)
            // This filter enforces the API Contract boundary constraint.
        }

        filterChain.doFilter(request, response);
    }
}
