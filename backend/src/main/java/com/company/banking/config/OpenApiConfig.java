package com.company.banking.config;

import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import io.swagger.v3.oas.models.security.SecurityScheme;
import org.springdoc.core.models.GroupedOpenApi;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OpenApiConfig {

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
        return new OpenAPI()
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
    }
}