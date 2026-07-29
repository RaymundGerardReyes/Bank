package com.company.banking.apigateway.infrastructure;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ApiKeyJpaRepository extends JpaRepository<ApiKeyJpaEntity, Long> {
    Optional<ApiKeyJpaEntity> findByKeyHash(String keyHash);
}
