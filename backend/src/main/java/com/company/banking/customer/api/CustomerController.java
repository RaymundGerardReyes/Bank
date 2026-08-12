package com.company.banking.customer.api;

import com.company.banking.common.response.ApiResponse;
import com.company.banking.customer.application.port.in.GetCustomerAlertsUseCase;
import com.company.banking.customer.api.dto.NotificationResponse;
import com.company.banking.web.filter.CorrelationIdFilter;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.slf4j.MDC;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1")
@RequiredArgsConstructor
@Tag(name = "Customer Devices & Notifications", description = "Customer Notifications API")
public class CustomerController {

    private final GetCustomerAlertsUseCase getCustomerAlertsUseCase;

    // Preserved for backward compatibility with the Web App
    @GetMapping("/notifications")
    @Operation(summary = "Get Customer Notifications", description = "Retrieves the recent notifications (alerts/audit logs) for the authenticated customer.")
    public ResponseEntity<ApiResponse<List<NotificationResponse>>> getMyNotifications(Authentication authentication) {
        String customerEmail = authentication.getName();
        List<NotificationResponse> alerts = getCustomerAlertsUseCase.getCustomerAlerts(customerEmail);
        return ResponseEntity.ok(ApiResponse.success(alerts));
    }

}