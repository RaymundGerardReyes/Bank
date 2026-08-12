package com.company.banking.apigateway.security;

import org.springframework.security.authentication.AbstractAuthenticationToken;
import org.springframework.security.core.GrantedAuthority;
import java.util.Collection;

public class ApiKeyAuthenticationToken extends AbstractAuthenticationToken {
    private final String apiKeyName;
    private final String linkedAccountId;

    public ApiKeyAuthenticationToken(String apiKeyName, String linkedAccountId, Collection<? extends GrantedAuthority> authorities) {
        super(authorities);
        this.apiKeyName = apiKeyName;
        this.linkedAccountId = linkedAccountId;
        setAuthenticated(true);
    }

    @Override
    public Object getCredentials() { return null; }

    @Override
    public Object getPrincipal() { return this.apiKeyName; }

    public String getLinkedAccountId() { return this.linkedAccountId; }
}
