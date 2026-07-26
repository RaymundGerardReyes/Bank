package com.company.banking.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.core.env.Environment;
import lombok.RequiredArgsConstructor;

@Configuration
@RequiredArgsConstructor
public class SecretsConfig {

    private final Environment environment;

    public String getJwtSecret() {
        return environment.getProperty("JWT_SECRET", "default-insecure-secret-key-must-be-changed-in-production-environments");
    }

    public String getDbPassword() {
        return environment.getProperty("DB_PASSWORD", "postgrespassword");
    }
}
