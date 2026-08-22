package com.company.banking.payment.api.dto;

import com.company.banking.payment.domain.CheckoutPaymentMethod;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class SelectPaymentMethodRequest {
    @NotNull(message = "Payment method is required")
    private CheckoutPaymentMethod paymentMethod;
}
