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

    @GetMapping("/status")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Map<String, String>>> getAuditSystemStatus() {
        String correlationId = MDC.get(CorrelationIdFilter.MDC_KEY);
        Map<String, String> status = Map.of(
                "status", "ACTIVE",
                "auditLogging", "ENABLED",
                "retentionPolicy", "7_YEARS"
        );
        return ResponseEntity.ok(ApiResponse.success(status, "Audit system operating normally", correlationId));
    }
}
