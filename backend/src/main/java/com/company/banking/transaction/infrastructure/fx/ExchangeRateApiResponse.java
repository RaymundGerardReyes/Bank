package com.company.banking.transaction.infrastructure.fx;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@JsonIgnoreProperties(ignoreUnknown = true)
public class ExchangeRateApiResponse {
    private String result;

    @JsonProperty("base_code")
    private String baseCode;

    private String base;

    private Map<String, BigDecimal> rates;

    @JsonProperty("provider")
    private String provider;

    @JsonProperty("time_last_update_unix")
    private Long timeLastUpdateUnix;

    @JsonProperty("time_last_update_utc")
    private String timeLastUpdateUtc;

    @JsonProperty("time_next_update_utc")
    private String timeNextUpdateUtc;

    public String resolveBase() {
        return baseCode != null && !baseCode.isBlank() ? baseCode : base;
    }
}

