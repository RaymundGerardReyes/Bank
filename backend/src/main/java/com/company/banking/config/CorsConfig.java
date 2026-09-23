package com.company.banking.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

@Configuration
public class CorsConfig {

    @Value("${FRONTEND_PUBLIC_ORIGIN:}")
    private String frontendPublicOrigin;

    @Value("${platform.domain:localhost}")
    private String platformDomain;

    @Bean
    public CorsFilter corsFilter() {
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowCredentials(true);

        List<String> origins = new ArrayList<>();
        if (frontendPublicOrigin != null && !frontendPublicOrigin.isBlank()) {
            Arrays.stream(frontendPublicOrigin.split(","))
                    .map(String::trim)
                    .filter(s -> !s.isEmpty())
                    .map(s -> (s.startsWith("http://") || s.startsWith("https://")) ? s : "https://" + s)
                    .distinct()
                    .forEach(origins::add);
        } else if (platformDomain != null && !platformDomain.isBlank() && !"localhost".equalsIgnoreCase(platformDomain)) {
            origins.add("https://bank." + platformDomain.trim().toLowerCase());
        }
        if (!origins.contains("http://localhost:3000")) {
            origins.add("http://localhost:3000");
        }

        config.setAllowedOrigins(origins);
        config.setAllowedHeaders(List.of("Origin", "Content-Type", "Accept", "Authorization", "X-Request-Id", "X-Correlation-Id", "X-Internal-BFF-Key", "X-BFF-Key", "X-API-Key"));
        config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"));
        config.setExposedHeaders(List.of("X-Request-Id", "X-Correlation-Id"));

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return new CorsFilter(source);
    }
}
