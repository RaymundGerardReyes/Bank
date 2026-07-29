package com.company.banking.customer.api.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class NotificationResponse {
    private String id;
    private String category;
    private String title;
    private String message;
    private String timestamp;
    private boolean unread;
    private String correlationId;
    private String referenceId;
    private String channel;
    private String ipAddress;
    private String deviceInfo;
    private String severity;
}
