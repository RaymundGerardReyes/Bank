package com.company.banking.apigateway.security;

import org.springframework.security.authentication.AbstractAuthenticationToken;
import org.springframework.security.core.GrantedAuthority;
import java.util.Collection;

public class ApiKeyAuthenticationToken extends AbstractAuthenticationToken {

    private final String apiKey;
    private final Long merchantId;
    private final String environment; // "LIVE" or "TEST"

    public ApiKeyAuthenticationToken(String apiKey, Long merchantId, String environment, Collection<? extends GrantedAuthority> authorities) {
        super(authorities);
        this.apiKey = apiKey;
        this.merchantId = merchantId;
        this.environment = environment;
        setAuthenticated(true);
    }

    // Unauthenticated constructor
    public ApiKeyAuthenticationToken(String apiKey) {
        super(null);
        this.apiKey = apiKey;
        this.merchantId = null;
        this.environment = null;
        setAuthenticated(false);
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
        return this.merchantId != null ? "MERCHANT-SETTLEMENT-" + this.merchantId : null;
    }
}
