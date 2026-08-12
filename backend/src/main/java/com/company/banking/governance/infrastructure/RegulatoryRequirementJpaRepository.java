package com.company.banking.governance.infrastructure;

import com.company.banking.governance.domain.RegulatoryRequirement;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RegulatoryRequirementJpaRepository extends JpaRepository<RegulatoryRequirement, Long> {
    List<RegulatoryRequirement> findByRegulation(String regulation);
    List<RegulatoryRequirement> findByImplementationStatus(String implementationStatus);
}
