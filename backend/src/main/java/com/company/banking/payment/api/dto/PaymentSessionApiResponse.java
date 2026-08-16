package com.company.banking.payment.api.dto;

import com.company.banking.payment.domain.PaymentSession;
import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
public class PaymentSessionApiResponse {
    private String sessionId;
    private String institutionReference;
    private String status;
    private BigDecimal amount;
    private String currency;
    private String paymentUrl;
    private LocalDateTime expiresAt;

    public static PaymentSessionApiResponse fromEntity(PaymentSession session, String checkoutBaseUrl) {
        return PaymentSessionApiResponse.builder()
                .sessionId(session.getSessionId())
                .institutionReference(session.getInstitutionReference())
                .status(session.getStatus().name())
                .amount(session.getAmount())
                .currency(session.getCurrency())
                .paymentUrl(checkoutBaseUrl + "/pay/" + session.getSessionId())
                .expiresAt(session.getExpiresAt())
                .build();
    }
}