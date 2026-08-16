package com.company.banking.payment.gateway.dto;

import com.company.banking.payment.domain.PaymentChannel;
import com.company.banking.payment.domain.PaymentProvider;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PaymentSession {
    private String providerReference;
    private String checkoutUrl;
    private LocalDateTime expiresAt;
    private PaymentProvider provider;
    private PaymentChannel channel;
    private String instructions;
}