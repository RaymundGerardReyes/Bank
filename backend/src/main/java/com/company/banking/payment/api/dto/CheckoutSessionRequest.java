package com.company.banking.payment.api.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CheckoutSessionRequest {

    private String reference;

    @NotBlank
    private String currency;

    @NotEmpty
    private List<LineItemDto> lineItems;

    @NotBlank
    private String successUrl;

    private String cancelUrl;
}
