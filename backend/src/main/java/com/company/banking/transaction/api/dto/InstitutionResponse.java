package com.company.banking.transaction.api.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "External financial institution metadata for transfers")
public class InstitutionResponse {

    @Schema(description = "Internal database ID", example = "1")
    private Long id;

    @Schema(description = "Bank Identifier Code (BIC) or Routing Transit Number", example = "021000021")
    private String bic;

    @Schema(description = "Convenience routing code accessor matching BIC", example = "021000021")
    private String routingCode;

    @Schema(description = "Display name of the institution", example = "Chase Bank")
    private String name;

    @Schema(description = "Full legal institution name", example = "Chase Bank")
    private String institutionName;

    @Schema(description = "Role of participant (RECEIVER, SENDER, CLEARING_HOUSE)", example = "RECEIVER")
    private String role;

    @Schema(description = "Supported payment rail(s) (e.g. FEDWIRE, ACH, INSTAPAY, PESONET, SWIFT)", example = "FEDWIRE,ACH")
    private String rail;

    @Schema(description = "Operational status (ACTIVE, SUSPENDED)", example = "ACTIVE")
    private String status;

    @Schema(description = "Live network connectivity status (ONLINE, OFFLINE)", example = "ONLINE")
    private String connectivityStatus;
}
