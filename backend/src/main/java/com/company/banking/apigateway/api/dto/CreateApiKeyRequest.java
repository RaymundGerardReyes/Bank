package com.company.banking.apigateway.api.dto;

import jakarta.validation.constraints.NotBlank;

import java.time.LocalDateTime;
import java.util.Set;

public class CreateApiKeyRequest {

    @NotBlank(message = "Key name is required")
    private String name;

    private String environment; // LIVE or SANDBOX

    private String cidrWhitelist;

    private Set<String> scopes;

    private String linkedAccountId; // <-- NEW
    
    public String getLinkedAccountId() { return linkedAccountId; }
    public void setLinkedAccountId(String linkedAccountId) { this.linkedAccountId = linkedAccountId; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getEnvironment() { return environment; }
    public void setEnvironment(String environment) { this.environment = environment; }

    public String getCidrWhitelist() { return cidrWhitelist; }
    public void setCidrWhitelist(String cidrWhitelist) { this.cidrWhitelist = cidrWhitelist; }

    public Set<String> getScopes() { return scopes; }
    public void setScopes(Set<String> scopes) { this.scopes = scopes; }
}
