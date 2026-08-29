package com.company.banking.payment.api;

import org.springframework.core.Ordered;
import org.springframework.core.annotation.Order;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;

@Component
@Order(Ordered.HIGHEST_PRECEDENCE)
public class PaymentGatewayStrictEnforcementFilter extends OncePerRequestFilter {

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {
        String uri = request.getRequestURI();
        
        if (uri != null && uri.startsWith("/api/v1/gateway/payments")) {
            
            // 1. Enforce Legacy 405 Strictness
            if (uri.equals("/api/v1/gateway/payments") || uri.equals("/api/v1/gateway/payments/") || uri.endsWith("/capture")) {
                response.setStatus(HttpServletResponse.SC_METHOD_NOT_ALLOWED);
                response.setContentType("application/json");
                response.getWriter().write("{\"message\":\"This endpoint is deprecated. Use /api/v1/gateway/payments/intents instead.\"}");
                return;
            }
            
            // 2. Enforce 415 Content-Type Strictness for modern endpoint
            if (request.getMethod().equalsIgnoreCase("POST") && uri.equals("/api/v1/gateway/payments/intents")) {
                String contentType = request.getContentType();
                if (contentType == null || (!contentType.contains(MediaType.APPLICATION_JSON_VALUE))) {
                    response.setStatus(HttpServletResponse.SC_UNSUPPORTED_MEDIA_TYPE);
                    return;
                }
            }
        }
        
        filterChain.doFilter(request, response);
    }
}
