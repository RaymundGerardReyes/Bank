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
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
import org.springframework.security.core.context.SecurityContextHolder;

import java.io.IOException;

@Component
@RequiredArgsConstructor
@Slf4j
@Order(-105)
public class ApiAuditLoggingFilter extends OncePerRequestFilter {

    private final ApiAuditEventJpaRepository apiAuditEventJpaRepository;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

        if (!request.getRequestURI().startsWith("/api/v1/")) {
            filterChain.doFilter(request, response);
            return;
        }

        long startTime = System.currentTimeMillis();

        try {
            filterChain.doFilter(request, response);
        } finally {
            try {
                long latencyMs = System.currentTimeMillis() - startTime;
                String requestId = MDC.get("correlationId");
                if (requestId == null) {
                    requestId = response.getHeader("X-Request-Id");
                }
                if (requestId == null) {
                    requestId = request.getHeader("X-Request-Id");
                }
                int status = response.getStatus();
                
                String clientId = request.getHeader("X-Client-Id");
                
                // Read attributes set by upstream filters
                String requestStage   = getAttr(request, "GATEWAY_AUTH_STAGE", "COMPLETED");
                String failureReason  = getAttr(request, "GATEWAY_AUTH_FAILURE_REASON", null);
                Long   apiKeyId       = (Long) request.getAttribute("GATEWAY_API_KEY_ID");
                String linkedAcctId   = getAttr(request, "GATEWAY_LINKED_ACCOUNT_ID", null);
                Long   merchantId     = (Long) request.getAttribute("GATEWAY_MERCHANT_ID");

                // Derive authenticationStatus from requestStage
                if ("API_KEY_AUTHENTICATED".equals(requestStage)) {
                    requestStage = status >= 500 ? "EXCEPTION" : "COMPLETED";
                }
                
                String authStatus = deriveAuthStatus(requestStage);
                String authzStatus = deriveAuthzStatus(requestStage);

                // Status family
                String statusFamily = (status / 100) + "xx";

                // Retrieve risk decision if set by RateLimit or Signature filters
                Object riskObj = request.getAttribute("RISK_DECISION");
                String riskDecision = riskObj != null ? riskObj.toString() : "ALLOWED";
                
                if (status == 429) {
                    riskDecision = "RATE_LIMITED";
                } else if (status == 401 || status == 403) {
                    riskDecision = "AUTH_FAILED";
                }

                // Scopes from SecurityContext if available
                String grantedScopes = null;
                if (SecurityContextHolder.getContext().getAuthentication() instanceof ApiKeyAuthenticationToken token) {
                    grantedScopes = token.getScopes() != null ? String.join(",", token.getScopes()) : null;
                }

                ApiAuditEvent auditEvent = ApiAuditEvent.builder()
                        .requestId(requestId != null ? requestId : "UNKNOWN")
                        .clientId(clientId)
                        .merchantId(merchantId)
                        .apiKeyId(apiKeyId)
                        .endpoint(request.getRequestURI())
                        .httpMethod(request.getMethod())
                        .sourceIp(request.getRemoteAddr())
                        .userAgent(request.getHeader("User-Agent"))
                        .responseCode(status)
                        .statusFamily(statusFamily)
                        .riskDecision(riskDecision)
                        .linkedAccountId(linkedAcctId)
                        .grantedScopes(grantedScopes)
                        .authenticationStatus(authStatus)
                        .authorizationStatus(authzStatus)
                        .authFailureReason(failureReason)
                        .requestStage(requestStage)
                        .latencyMs(latencyMs)
                        .idempotencyKey(request.getHeader("Idempotency-Key"))
                        .build();

                apiAuditEventJpaRepository.save(auditEvent);
                log.info("[API AUDIT] {} {} → {} | stage={} | keyId={} | acct={} | latency={}ms", 
                         request.getMethod(), request.getRequestURI(), status, requestStage, apiKeyId, linkedAcctId, latencyMs);
            } catch (Exception e) {
                log.error("[API AUDIT] Failed to save audit log: {}", e.getMessage());
            }
        }
    }

    private String getAttr(HttpServletRequest req, String key, String def) {
        Object val = req.getAttribute(key);
        return val != null ? val.toString() : def;
    }

    private String deriveAuthStatus(String stage) {
        if ("BFF_REJECTED".equals(stage) || "API_KEY_REJECTED".equals(stage)) return "FAILED";
        if (stage == null || "RECEIVED".equals(stage)) return "NOT_EVALUATED";
        return "PASSED";
    }

    private String deriveAuthzStatus(String stage) {
        if ("IP_REJECTED".equals(stage) || "SCOPE_REJECTED".equals(stage)) return "FAILED";
        if ("BFF_REJECTED".equals(stage) || "API_KEY_REJECTED".equals(stage)) return "NOT_EVALUATED";
        return "PASSED";
    }
}
