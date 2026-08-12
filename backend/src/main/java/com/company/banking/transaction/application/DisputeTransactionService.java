package com.company.banking.transaction.application;

import com.company.banking.common.audit.AuditEventPublisher;
import com.company.banking.common.exception.NotFoundException;
import com.company.banking.transaction.api.dto.DisputeReasonRequest;
import com.company.banking.transaction.api.dto.TransactionResponse;
import com.company.banking.transaction.application.port.out.LedgerPersistencePort;
import com.company.banking.transaction.domain.Transaction;
import com.company.banking.web.filter.CorrelationIdFilter;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.slf4j.MDC;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Slf4j
public class DisputeTransactionService {

    private final LedgerPersistencePort ledgerPersistencePort;
    private final com.company.banking.transaction.infrastructure.DisputeCaseJpaRepository disputeCaseJpaRepository;
    private final AuditEventPublisher auditEventPublisher;

    @Transactional
    public TransactionResponse disputeTransaction(Long id, DisputeReasonRequest request) {
        log.info("[TRANSACTION DISPUTE] Customer filing formal dispute case for transaction ID {}", id);

        Transaction tx = ledgerPersistencePort.findById(id)
                .orElseThrow(() -> new NotFoundException("Transaction not found for ID: " + id));

        // Create the formal back-office dispute case
        com.company.banking.transaction.domain.DisputeCase disputeCase = com.company.banking.transaction.domain.DisputeCase.builder()
                .customerId(1L) // Assuming customer ID 1 for now (should come from auth context)
                .transactionReference(tx.getTransactionReference())
                .reason(request.getReasonCode() + ": " + (request.getNotes() != null ? request.getNotes() : ""))
                .status("FILED")
                .build();
        
        disputeCaseJpaRepository.save(disputeCase);

        tx.setDisputed(true);
        tx.setDisputeReason("Case Filed: " + disputeCase.getId());

        Transaction saved = ledgerPersistencePort.save(tx);
        
        String correlationId = MDC.get(CorrelationIdFilter.MDC_KEY);
        String username = "customer"; // Can be replaced with actual Spring Security Context user
        auditEventPublisher.publishEvent("DISPUTE_CASE_FILED", username, 
            "Created formal dispute case #" + disputeCase.getId() + " for transaction " + saved.getTransactionReference(), correlationId);

        return TransactionResponse.fromEntity(saved);
    }
}
