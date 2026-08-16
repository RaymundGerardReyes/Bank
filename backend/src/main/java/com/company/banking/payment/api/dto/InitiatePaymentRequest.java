package com.company.banking.payment.api.dto;

import com.company.banking.payment.domain.PaymentMethod;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class InitiatePaymentRequest {
    @NotNull(message = "Payment method is required")
    private PaymentMethod paymentMethod;
}