package com.company.banking.complaint.infrastructure;

import com.company.banking.complaint.domain.CustomerComplaint;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CustomerComplaintJpaRepository extends JpaRepository<CustomerComplaint, Long> {
    Optional<CustomerComplaint> findByComplaintReference(String complaintReference);
}
