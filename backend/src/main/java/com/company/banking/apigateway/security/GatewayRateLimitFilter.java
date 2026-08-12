package com.company.banking.apigateway.security;

import com.company.banking.common.audit.AuditEventPublisher;
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
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicInteger;

@Component
@RequiredArgsConstructor
@Slf4j
public class GatewayRateLimitFilter extends OncePerRequestFilter {

    private final AuditEventPublisher auditEventPublisher;
    
    // In memory rate-limit buckets (in prod use Redis for distributed caching)
    private final ConcurrentHashMap<String, AtomicInteger> requestCounts = new ConcurrentHashMap<>();
    private final ConcurrentHashMap<String, Long> windowStartTimes = new ConcurrentHashMap<>();

    private static final int MAX_REQUESTS_PER_MINUTE = 100;
    private static final long WINDOW_SIZE_MS = 60_000;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

        if (!request.getRequestURI().startsWith("/api/v1/gateway")) {
            filterChain.doFilter(request, response);
            return;
        }

        String clientId = request.getHeader("X-Client-Id");
        String clientIp = request.getRemoteAddr();
        String endpoint = request.getRequestURI();

        // 1. IP-based velocity tracking
        if (isRateLimited("IP:" + clientIp)) {
            rejectRateLimit(response, "IP velocity limit exceeded");
            return;
        }

        // 2. Client-based velocity tracking
        if (clientId != null && isRateLimited("CLIENT:" + clientId)) {
            auditEventPublisher.publishEvent("API_RATE_LIMIT_EXCEEDED", clientId, "API Client exceeded requests/min limit.", clientIp);
            rejectRateLimit(response, "API Client rate limit exceeded");
            return;
        }
        
        // 3. Endpoint-specific throttle (e.g., /payments is stricter than /status)
        if (endpoint.contains("/payments") && clientId != null && isRateLimited("ENDPOINT:" + clientId + ":PAYMENTS", 20)) {
            auditEventPublisher.publishEvent("API_THROTTLED", clientId, "Payment endpoint throttled.", endpoint);
            rejectRateLimit(response, "Payment creation velocity limit exceeded");
            return;
        }

        filterChain.doFilter(request, response);
    }

    private boolean isRateLimited(String key) {
        return isRateLimited(key, MAX_REQUESTS_PER_MINUTE);
    }

    private boolean isRateLimited(String key, int limit) {
        long now = System.currentTimeMillis();
        windowStartTimes.putIfAbsent(key, now);
        
        if (now - windowStartTimes.get(key) > WINDOW_SIZE_MS) {
            windowStartTimes.put(key, now);
            requestCounts.put(key, new AtomicInteger(0));
        }

        AtomicInteger count = requestCounts.computeIfAbsent(key, k -> new AtomicInteger(0));
        return count.incrementAndGet() > limit;
    }

    private void rejectRateLimit(HttpServletResponse response, String message) throws IOException {
        response.setStatus(429); // HTTP 429 Too Many Requests
        response.setContentType("application/json");
        response.getWriter().write(String.format("{\"code\":\"LIMIT_EXCEEDED\", \"message\":\"%s\", \"timestamp\":\"%s\"}", 
                message, Instant.now().toString()));
    }
}
