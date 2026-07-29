package com.company.banking.transaction.api.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DisputeReasonRequest {

    @NotBlank(message = "Reason code is required")
    private String reasonCode;

    private String notes;
}
