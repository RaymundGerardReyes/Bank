package com.company.banking.apigateway.security;

import org.springframework.security.authentication.AbstractAuthenticationToken;
import org.springframework.security.core.GrantedAuthority;
import java.util.Collection;
import java.util.Set;

public class ApiKeyAuthenticationToken extends AbstractAuthenticationToken {

    private final String apiKey;
    private final Long merchantId;
    private final String environment; // "LIVE" or "TEST"
    private final Long apiKeyId;
    private final String linkedAccountId;
    private final Set<String> scopes;

    public ApiKeyAuthenticationToken(String apiKey, Long merchantId, String environment, 
                                     Long apiKeyId, String linkedAccountId, Set<String> scopes,
                                     Collection<? extends GrantedAuthority> authorities) {
        super(authorities);
        this.apiKey = apiKey;
        this.merchantId = merchantId;
        this.environment = environment;
        this.apiKeyId = apiKeyId;
        this.linkedAccountId = linkedAccountId;
        this.scopes = scopes;
        setAuthenticated(true);
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

    public String getLinkedAccountId() {
        return this.linkedAccountId != null ? this.linkedAccountId : 
               (this.merchantId != null ? "MERCHANT-SETTLEMENT-" + this.merchantId : null);
    }
}
