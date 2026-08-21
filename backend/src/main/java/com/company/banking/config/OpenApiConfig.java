package com.company.banking.config;

import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import io.swagger.v3.oas.models.security.SecurityScheme;
import io.swagger.v3.oas.models.servers.Server;
import org.springdoc.core.models.GroupedOpenApi;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.ArrayList;
import java.util.List;

@Configuration
public class OpenApiConfig {

    @Value("${platform.domain:${PLATFORM_DOMAIN:}}")
    private String platformDomain;

    @Value("${server.port:8080}")
    private String serverPort;

    // --- ENTERPRISE FIX: Whitelist ONLY External Banking Domains ---
    @Bean
    public GroupedOpenApi externalDeveloperApi() {
        return GroupedOpenApi.builder()
                .group("developer-gateway")
                // ONLY allow these domain paths to be documented
                .pathsToMatch(
                        "/api/v1/transactions/**",
                        "/api/v1/transfers/**",
                        "/api/v1/statements/**"
                )
                // EXPLICITLY strip internal operations from the spec
                .pathsToExclude(
                        "/api/v1/auth/**",
                        "/api/v1/admin/**",
                        "/api/v1/apikeys/**",
                        "/api/v1/customers/**"
                )
                .build();
    }

    @Bean
    public OpenAPI customOpenAPI() {
        final String securitySchemeName = "bearerAuth";

        List<Server> servers = new ArrayList<>();
        if (platformDomain != null && !platformDomain.isBlank()) {
            servers.add(new Server().url("https://" + platformDomain).description("Live Secure Gateway"));
            servers.add(new Server().url("http://" + platformDomain).description("Local Dev Gateway"));
        } else {
            servers.add(new Server().url("http://localhost:" + serverPort).description("Local Host Gateway"));
        }

        OpenAPI openAPI = new OpenAPI()
                .info(new Info()
                        .title("NovaBank Enterprise Developer Gateway")
                        .version("1.0.0")
                        .description("Public integration specifications for Virtual Account Management, Payment Orchestration, and Core Ledgers."))
                .addSecurityItem(new SecurityRequirement().addList(securitySchemeName))
                .components(new Components()
                        .addSecuritySchemes(securitySchemeName,
                                new SecurityScheme()
                                        .name(securitySchemeName)
                                        .type(SecurityScheme.Type.HTTP)
                                        .scheme("bearer")
                                        .bearerFormat("JWT")));

        if (!servers.isEmpty()) {
            openAPI.servers(servers);
        }

        return openAPI;
    }
}