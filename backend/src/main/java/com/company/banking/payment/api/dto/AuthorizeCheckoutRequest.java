package com.company.banking.payment.api.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class AuthorizeCheckoutRequest {
    @NotBlank(message = "Customer account number is required")
    private String customerAccountNumber;
}
