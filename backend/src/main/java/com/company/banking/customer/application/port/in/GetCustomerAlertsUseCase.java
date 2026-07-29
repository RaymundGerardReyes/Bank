package com.company.banking.customer.application.port.in;

import com.company.banking.customer.api.dto.NotificationResponse;

import java.util.List;

public interface GetCustomerAlertsUseCase {
    List<NotificationResponse> getCustomerAlerts(String customerEmail);
}
