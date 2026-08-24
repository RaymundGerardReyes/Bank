package com.company.banking.admin.api;

import com.company.banking.common.response.ApiResponse;
import com.company.banking.web.filter.CorrelationIdFilter;
import lombok.RequiredArgsConstructor;
import org.slf4j.MDC;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/v1/admin/audit")
@RequiredArgsConstructor
public class AdminAuditController {

    private final com.company.banking.apigateway.infrastructure.ApiAuditEventJpaRepository apiAuditEventJpaRepository;

    @GetMapping
    public ResponseEntity<ApiResponse<Map<String, String>>> getAuditLogs() {
        String correlationId = MDC.get(CorrelationIdFilter.MDC_KEY);
        Map<String, String> status = Map.of(
                "status", "ACTIVE",
                "auditLogging", "ENABLED",
                "retentionPolicy", "7_YEARS"
        );
        return ResponseEntity.ok(ApiResponse.success(status, "Audit logs operating normally", correlationId));
    }

    @GetMapping("/status")
    public ResponseEntity<ApiResponse<Map<String, String>>> getAuditSystemStatus() {
        String correlationId = MDC.get(CorrelationIdFilter.MDC_KEY);
        Map<String, String> status = Map.of(
                "status", "ACTIVE",
                "auditLogging", "ENABLED",
                "retentionPolicy", "7_YEARS"
        );
        return ResponseEntity.ok(ApiResponse.success(status, "Audit system operating normally", correlationId));
    }

    @GetMapping("/gateway/account/{linkedAccountId}")
    public ResponseEntity<ApiResponse<java.util.List<com.company.banking.apigateway.domain.ApiAuditEvent>>> getGatewayAuditByAccount(
            @org.springframework.web.bind.annotation.PathVariable String linkedAccountId) {
        String correlationId = MDC.get(CorrelationIdFilter.MDC_KEY);
        return ResponseEntity.ok(ApiResponse.success(
                apiAuditEventJpaRepository.findByLinkedAccountIdOrderByCreatedAtDesc(linkedAccountId), 
                "Gateway audit retrieved", correlationId));
    }

    @GetMapping("/gateway/key/{apiKeyId}")
    public ResponseEntity<ApiResponse<java.util.List<com.company.banking.apigateway.domain.ApiAuditEvent>>> getGatewayAuditByKey(
            @org.springframework.web.bind.annotation.PathVariable Long apiKeyId) {
        String correlationId = MDC.get(CorrelationIdFilter.MDC_KEY);
        return ResponseEntity.ok(ApiResponse.success(
                apiAuditEventJpaRepository.findByApiKeyIdOrderByCreatedAtDesc(apiKeyId), 
                "Gateway audit retrieved", correlationId));
    }

    @GetMapping("/gateway/request/{requestId}")
    public ResponseEntity<ApiResponse<java.util.List<com.company.banking.apigateway.domain.ApiAuditEvent>>> getGatewayAuditByRequest(
            @org.springframework.web.bind.annotation.PathVariable String requestId) {
        String correlationId = MDC.get(CorrelationIdFilter.MDC_KEY);
        return ResponseEntity.ok(ApiResponse.success(
                apiAuditEventJpaRepository.findByRequestId(requestId), 
                "Gateway audit retrieved", correlationId));
    }

    @GetMapping("/gateway/merchant/{merchantId}")
    public ResponseEntity<ApiResponse<java.util.List<com.company.banking.apigateway.domain.ApiAuditEvent>>> getGatewayAuditByMerchant(
            @org.springframework.web.bind.annotation.PathVariable Long merchantId) {
        String correlationId = MDC.get(CorrelationIdFilter.MDC_KEY);
        return ResponseEntity.ok(ApiResponse.success(
                apiAuditEventJpaRepository.findByMerchantIdOrderByCreatedAtDesc(merchantId), 
                "Gateway audit retrieved", correlationId));
    }
}
