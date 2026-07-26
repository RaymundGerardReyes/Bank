package com.company.banking.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.Semaphore;

@Configuration
public class RateLimitConfig {

    private final ConcurrentHashMap<String, Semaphore> semaphores = new ConcurrentHashMap<>();

    @Bean
    public ConcurrentHashMap<String, Semaphore> rateLimitMap() {
        return semaphores;
    }
}
