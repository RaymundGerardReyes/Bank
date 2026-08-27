package com.company.banking.config;

import com.company.banking.apigateway.security.ApiKeyAuthenticationFilter;
import com.company.banking.security.jwt.JwtAuthenticationFilter;
import com.company.banking.web.filter.BffIdentityFilter;
import com.company.banking.web.filter.CorrelationIdFilter;
import org.springframework.boot.web.servlet.FilterRegistrationBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class FilterRegistrationConfig {

    @Bean
    public FilterRegistrationBean<JwtAuthenticationFilter> jwtFilterRegistration(JwtAuthenticationFilter filter) {
        FilterRegistrationBean<JwtAuthenticationFilter> registration = new FilterRegistrationBean<>(filter);
        registration.setEnabled(false); // Disable from Servlet container; let Spring Security manage it
        return registration;
    }

    @Bean
    public FilterRegistrationBean<ApiKeyAuthenticationFilter> apiKeyFilterRegistration(ApiKeyAuthenticationFilter filter) {
        FilterRegistrationBean<ApiKeyAuthenticationFilter> registration = new FilterRegistrationBean<>(filter);
        registration.setEnabled(false); // Disable from Servlet container; let Spring Security manage it
        return registration;
    }

    @Bean
    public FilterRegistrationBean<BffIdentityFilter> bffIdentityFilterRegistration(BffIdentityFilter filter) {
        FilterRegistrationBean<BffIdentityFilter> registration = new FilterRegistrationBean<>(filter);
        registration.setEnabled(false); // Disable from Servlet container; let Spring Security manage it
        return registration;
    }
    
    @Bean
    public FilterRegistrationBean<CorrelationIdFilter> correlationIdFilterRegistration(CorrelationIdFilter filter) {
        FilterRegistrationBean<CorrelationIdFilter> registration = new FilterRegistrationBean<>(filter);
        registration.setEnabled(false); // Disable from Servlet container; let Spring Security manage it
        return registration;
    }
}
