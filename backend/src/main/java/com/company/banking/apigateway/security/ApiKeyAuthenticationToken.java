package com.company.banking.apigateway.security;

import org.springframework.security.authentication.AbstractAuthenticationToken;
import org.springframework.security.core.GrantedAuthority;

import java.math.BigDecimal;
import java.util.Collection;
import java.util.Set;

public class ApiKeyAuthenticationToken extends AbstractAuthenticationToken {

    private final String apiKey;
    private final Long merchantId;
    private final String environment; // "LIVE", "SANDBOX", or "TEST"
    private final Long apiKeyId;
    private final String linkedAccountId;
    private final Set<String> scopes;
    private final String applicationId;
    private final String applicationName;
    private final BigDecimal perTransactionLimit;
    private final BigDecimal dailyLimit;

    public ApiKeyAuthenticationToken(String apiKey, Long merchantId, String environment, 
                                     Long apiKeyId, String linkedAccountId, Set<String> scopes,
                                     String applicationId, String applicationName,
                                     BigDecimal perTransactionLimit, BigDecimal dailyLimit,
                                     Collection<? extends GrantedAuthority> authorities) {
        super(authorities);
        this.apiKey = apiKey;
        this.merchantId = merchantId;
        this.environment = environment;
        this.apiKeyId = apiKeyId;
        this.linkedAccountId = linkedAccountId;
        this.scopes = scopes;
        this.applicationId = applicationId;
        this.applicationName = applicationName;
        this.perTransactionLimit = perTransactionLimit;
        this.dailyLimit = dailyLimit;
        setAuthenticated(true);
    }

    // Backwards-compatible constructor for existing tests and components
    public ApiKeyAuthenticationToken(String apiKey, Long merchantId, String environment, 
                                     Long apiKeyId, String linkedAccountId, Set<String> scopes,
                                     Collection<? extends GrantedAuthority> authorities) {
        this(apiKey, merchantId, environment, apiKeyId, linkedAccountId, scopes, null, null, null, null, authorities);
    }

    // Unauthenticated constructor
    public ApiKeyAuthenticationToken(String apiKey) {
        super(null);
        this.apiKey = apiKey;
        this.merchantId = null;
        this.environment = null;
        this.apiKeyId = null;
        this.linkedAccountId = null;
        this.scopes = null;
        this.applicationId = null;
        this.applicationName = null;
        this.perTransactionLimit = null;
        this.dailyLimit = null;
        setAuthenticated(false);
    }

    public Long getApiKeyId() {
        return apiKeyId;
    }

    public Set<String> getScopes() {
        return scopes;
    }

    @Override
    public Object getCredentials() {
        return this.apiKey;
    }

    @Override
    public Object getPrincipal() {
        return this.merchantId; // The principal is strictly the Merchant ID
    }

    public String getEnvironment() {
        return this.environment;
    }

    public boolean isSandbox() {
        return "SANDBOX".equalsIgnoreCase(this.environment) || "TEST".equalsIgnoreCase(this.environment);
    }

    public boolean isLive() {
        return "LIVE".equalsIgnoreCase(this.environment);
    }

    public String getLinkedAccountId() {
        return this.linkedAccountId != null ? this.linkedAccountId : 
               (this.merchantId != null ? "MERCHANT-SETTLEMENT-" + this.merchantId : null);
    }

    public String getApplicationId() {
        return applicationId;
    }

    public String getApplicationName() {
        return applicationName;
    }

    public BigDecimal getPerTransactionLimit() {
        return perTransactionLimit;
    }

    public BigDecimal getDailyLimit() {
        return dailyLimit;
    }

    public boolean canAccessAccount(String targetAccountNumber) {
        if (targetAccountNumber == null || targetAccountNumber.trim().isEmpty()) {
            return true;
        }
        String cleanTarget = targetAccountNumber.trim();
        if (this.linkedAccountId != null && !this.linkedAccountId.trim().isEmpty()) {
            return cleanTarget.equalsIgnoreCase(this.linkedAccountId.trim());
        }
        if (this.merchantId != null) {
            String defaultSettlement = "MERCHANT-SETTLEMENT-" + this.merchantId;
            return cleanTarget.equalsIgnoreCase(defaultSettlement);
        }
        return false;
    }
}
