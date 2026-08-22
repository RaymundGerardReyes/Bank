package com.company.banking.payment.api.dto.merchant;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Data;

import java.math.BigDecimal;
import java.util.List;

@Data
public class MerchantCheckoutRequest {

    // NOTE: merchantId is intentionally absent! The server derives it from the ApiKey filter.

    @NotBlank(message = "Reference is required")
    private String reference; // The merchant's internal order ID

    @NotBlank(message = "Currency is required")
    private String currency; // e.g., "PHP"

    @NotBlank(message = "Success URL is required")
    private String successUrl;

    private String cancelUrl;

    @NotEmpty(message = "At least one line item is required")
    @Valid
    private List<LineItem> lineItems;

    @Data
    public static class LineItem {
        @NotBlank(message = "Item name is required")
        private String name;

        @NotNull(message = "Quantity is required")
        @Positive(message = "Quantity must be strictly positive")
        private Integer quantity;

        @NotNull(message = "Unit amount is required")
        @Positive(message = "Unit amount must be strictly positive")
        private BigDecimal unitAmount;
    }
}
