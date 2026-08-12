package com.company.banking.complaint.application;

import com.company.banking.common.audit.AuditEventPublisher;
import com.company.banking.common.exception.BusinessException;
import com.company.banking.common.exception.ErrorCode;
import com.company.banking.common.exception.NotFoundException;
import com.company.banking.complaint.domain.CustomerComplaint;
import com.company.banking.complaint.infrastructure.CustomerComplaintJpaRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class CustomerComplaintService {

    private final CustomerComplaintJpaRepository customerComplaintJpaRepository;
    private final AuditEventPublisher auditEventPublisher;

    @Transactional
    public CustomerComplaint fileComplaint(Long customerId, String category, String channel) {
        String ref = "CPL-" + UUID.randomUUID().toString().substring(0, 10).toUpperCase();

        CustomerComplaint complaint = CustomerComplaint.builder()
                .complaintReference(ref)
                .customerId(customerId)
                .category(category)
                .channel(channel)
                .status("OPEN")
                .build();

        CustomerComplaint saved = customerComplaintJpaRepository.save(complaint);
        
        log.info("[CONSUMER PROTECTION] Complaint {} filed for Customer {} via {}", ref, customerId, channel);
        
        auditEventPublisher.publishEvent("COMPLAINT_FILED", customerId.toString(), 
                "Customer filed a complaint: " + category, ref);

        return saved;
    }

    @Transactional
    public CustomerComplaint resolveComplaint(String complaintRef, String resolutionNotes, String officer) {
        CustomerComplaint complaint = customerComplaintJpaRepository.findByComplaintReference(complaintRef)
                .orElseThrow(() -> new NotFoundException("Complaint not found"));

        if ("RESOLVED".equals(complaint.getStatus())) {
            throw new BusinessException(ErrorCode.INVALID_REQUEST, "Complaint is already resolved.");
        }

        complaint.setStatus("RESOLVED");
        complaint.setResolutionNotes(resolutionNotes);
        complaint.setResolvedAt(LocalDateTime.now());
        complaint.setAssignedOfficer(officer);

        CustomerComplaint saved = customerComplaintJpaRepository.save(complaint);

        log.info("[CONSUMER PROTECTION] Complaint {} resolved by {}", complaintRef, officer);
        
        auditEventPublisher.publishEvent("COMPLAINT_RESOLVED", officer, 
                "Complaint resolved: " + resolutionNotes, complaintRef);

        return saved;
    }

    @Transactional
    public void escalateSlaBreaches() {
        // In a real scenario, this would be a @Scheduled job that queries for status != RESOLVED and slaDeadline < now()
        // and transitions them to ESCALATED.
        log.info("[CONSUMER PROTECTION] Running SLA Breach Escalation sweep...");
    }
}
