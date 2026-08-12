package com.company.banking.apigateway.security;

import com.company.banking.apigateway.domain.ApiAuditEvent;
import com.company.banking.apigateway.infrastructure.ApiAuditEventJpaRepository;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.slf4j.MDC;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
@RequiredArgsConstructor
@Slf4j
public class ApiAuditLoggingFilter extends OncePerRequestFilter {

    private final ApiAuditEventJpaRepository apiAuditEventJpaRepository;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

        if (!request.getRequestURI().startsWith("/api/v1/gateway")) {
            filterChain.doFilter(request, response);
            return;
        }

        long startTime = System.currentTimeMillis();

        try {
            filterChain.doFilter(request, response);
        } finally {
            try {
                String requestId = MDC.get("CorrelationId");
                if (requestId == null) {
                    requestId = request.getHeader("X-Correlation-Id");
                }
                
                String clientId = request.getHeader("X-Client-Id");
                
                // Retrieve risk decision if set by RateLimit or Signature filters
                Object riskObj = request.getAttribute("RISK_DECISION");
                String riskDecision = riskObj != null ? riskObj.toString() : "ALLOWED";
                
                if (response.getStatus() == 429) {
                    riskDecision = "RATE_LIMITED";
                } else if (response.getStatus() == 401 || response.getStatus() == 403) {
                    riskDecision = "AUTH_FAILED";
                }

                ApiAuditEvent auditEvent = ApiAuditEvent.builder()
                        .requestId(requestId != null ? requestId : "UNKNOWN")
                        .clientId(clientId)
                        .endpoint(request.getRequestURI())
                        .httpMethod(request.getMethod())
                        .sourceIp(request.getRemoteAddr())
                        .userAgent(request.getHeader("User-Agent"))
                        .responseCode(response.getStatus())
                        .riskDecision(riskDecision)
                        .build();

                apiAuditEventJpaRepository.save(auditEvent);
                log.info("[API AUDIT] Logged {} {} with status {} in {}ms", request.getMethod(), request.getRequestURI(), response.getStatus(), (System.currentTimeMillis() - startTime));
            } catch (Exception e) {
                log.error("[API AUDIT] Failed to save audit log: {}", e.getMessage());
            }
        }
    }
}
