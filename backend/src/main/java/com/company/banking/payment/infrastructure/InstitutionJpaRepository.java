package com.company.banking.payment.infrastructure;

import com.company.banking.payment.domain.Institution;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface InstitutionJpaRepository extends JpaRepository<Institution, Long> {
}