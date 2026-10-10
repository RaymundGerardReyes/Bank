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
public class DeviceChallengeResponse {
    private String challenge;
    private LocalDateTime expiresAt;
    private LocalDateTime serverTime;
}

