package com.company.banking.config;

import com.company.banking.apigateway.security.ApiKeyAuthenticationFilter;
import com.company.banking.security.jwt.JwtAuthenticationFilter;
import com.company.banking.web.filter.BffIdentityFilter;
import com.company.banking.web.filter.CorrelationIdFilter;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthFilter;
    private final ApiKeyAuthenticationFilter apiKeyAuthFilter;
    private final CorrelationIdFilter correlationIdFilter;
    private final BffIdentityFilter bffIdentityFilter;
    private final AuthenticationProvider authenticationProvider;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .csrf(AbstractHttpConfigurer::disable)
            .authorizeHttpRequests(auth -> auth
                // --- ENTERPRISE SECURITY FIX ---
                // 1. Only allow public access to authentication endpoints.
                // 2. Only allow access to the strictly filtered developer-gateway spec.
                // 3. REMOVED: /api/v1/apikeys/** (Now strictly requires JWT Auth!)
                // 4. REMOVED: /v3/api-docs/** (Global dump is now blocked!)
                .requestMatchers(
                        "/api/v1/auth/**", 
                        "/api/v1/webhooks/**",
                        "/v3/api-docs/developer-gateway", 
                        "/v3/api-docs/developer-gateway/**", 
                        "/actuator/health",
                        "/ws/**",
                        "/status",
                        "/error"
                ).permitAll()
                .anyRequest().authenticated()
            )
            .sessionManagement(session -> session
                .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
            )
            .authenticationProvider(authenticationProvider)
            .addFilterBefore(correlationIdFilter, UsernamePasswordAuthenticationFilter.class)
            .addFilterBefore(bffIdentityFilter, UsernamePasswordAuthenticationFilter.class)
            .addFilterBefore(apiKeyAuthFilter, UsernamePasswordAuthenticationFilter.class)
            .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
}