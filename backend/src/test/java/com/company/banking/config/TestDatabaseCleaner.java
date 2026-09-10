package com.company.banking.config;

import jakarta.persistence.EntityManager;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.ObjectProvider;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class TestDatabaseCleaner {

    private final EntityManager entityManager;
    private final DataInitializer dataInitializer;
    private final ObjectProvider<TestFixtures> testFixturesProvider;

    public TestDatabaseCleaner(EntityManager entityManager, DataInitializer dataInitializer, ObjectProvider<TestFixtures> testFixturesProvider) {
        this.entityManager = entityManager;
        this.dataInitializer = dataInitializer;
        this.testFixturesProvider = testFixturesProvider;
    }

    @Transactional
    public void clearAllData() {
        entityManager.createNativeQuery("SET REFERENTIAL_INTEGRITY FALSE").executeUpdate();

        @SuppressWarnings("unchecked")
        List<String> tables = entityManager.createNativeQuery(
                "SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES WHERE UPPER(TABLE_SCHEMA) = 'PUBLIC' AND TABLE_TYPE IN ('TABLE', 'BASE TABLE')"
        ).getResultList();

        for (String tableName : tables) {
            if (!tableName.equalsIgnoreCase("flyway_schema_history")) {
                entityManager.createNativeQuery("TRUNCATE TABLE \"" + tableName + "\"").executeUpdate();
            }
        }

        entityManager.createNativeQuery("SET REFERENTIAL_INTEGRITY TRUE").executeUpdate();
        dataInitializer.run();
        TestFixtures fixtures = testFixturesProvider.getIfAvailable();
        if (fixtures != null) {
            fixtures.seedTestFixtures();
        }
    }
}
