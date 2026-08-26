package com.company.banking.account.api.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UpdateAccountSettingsRequest {
    private Boolean frozen;
    private Boolean allowIncoming;
    private Boolean allowOutgoing;
    private Boolean requireDualApproval;
}
