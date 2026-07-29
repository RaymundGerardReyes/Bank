package com.company.banking.customer.api;

import com.company.banking.common.response.ApiResponse;
import com.company.banking.customer.application.port.in.GetCustomerAlertsUseCase;
import com.company.banking.customer.api.dto.NotificationResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1/notifications")
@RequiredArgsConstructor
@Tag(name = "Notifications", description = "Customer Notifications API")
public class CustomerController {

    private final GetCustomerAlertsUseCase getCustomerAlertsUseCase;

    @GetMapping
    @Operation(summary = "Get Customer Notifications", description = "Retrieves the recent notifications (alerts/audit logs) for the authenticated customer.")
    public ResponseEntity<ApiResponse<List<NotificationResponse>>> getMyNotifications(Authentication authentication) {
        // authentication.getName() typically returns the username/email of the logged-in user
        String customerEmail = authentication.getName();
        List<NotificationResponse> alerts = getCustomerAlertsUseCase.getCustomerAlerts(customerEmail);
        return ResponseEntity.ok(ApiResponse.success(alerts));
    }
}
