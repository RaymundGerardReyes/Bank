package com.company.banking.qr.domain;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class QrPaymentResult {
    private String provider;
    private String providerQrReference;
    private String payload;
    private QrType qrType;
    private LocalDateTime expiresAt;
}
