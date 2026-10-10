package com.company.banking.security.auth.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DeviceChallengeRequest {

    @NotBlank(message = "Device ID is required")
    private String deviceId;

    @Builder.Default
    private String purpose = "BIOMETRIC_LOGIN";
}

