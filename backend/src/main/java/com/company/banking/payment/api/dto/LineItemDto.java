package com.company.banking.payment.api.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LineItemDto {

    private String name;

    @NotNull
    @Min(1)
    private Integer quantity;

    @NotNull
    private BigDecimal unitAmount;
}
