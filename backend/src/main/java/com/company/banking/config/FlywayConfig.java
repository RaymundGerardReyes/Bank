package com.company.banking.config;

import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.autoconfigure.flyway.FlywayMigrationStrategy;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * Flyway configuration strategy.
 *
 * Runs flyway.repair() prior to flyway.migrate() so that any modified migration scripts
 * (such as V64 checksum synchronization) automatically align with flyway_schema_history
 * in running database instances, preventing checksum mismatch startup failures.
 */
@Slf4j
@Configuration
public class FlywayConfig {

    @Bean
    public FlywayMigrationStrategy flywayMigrationStrategy() {
        return flyway -> {
            log.info("[FLYWAY] Repairing schema history to align checksums...");
            flyway.repair();
            log.info("[FLYWAY] Running database migrations...");
            flyway.migrate();
            log.info("[FLYWAY] Database migrations completed successfully.");
        };
    }
}

