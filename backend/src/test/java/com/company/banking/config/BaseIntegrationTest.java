package com.company.banking.config;

import org.junit.jupiter.api.BeforeEach;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;

@SpringBootTest
@ActiveProfiles("test")
public abstract class BaseIntegrationTest {

    @Autowired
    private TestDatabaseCleaner databaseCleaner;

    @BeforeEach
    public void cleanDatabase() {
        databaseCleaner.clearAllData();
    }
}
