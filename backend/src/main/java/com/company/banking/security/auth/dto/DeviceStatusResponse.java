package com.company.banking.security.auth.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DeviceStatusResponse {
    private String deviceId;
    private String status;
    private String deviceModel;
    private LocalDateTime enrolledAt;
    private LocalDateTime lastUsedAt;
}

