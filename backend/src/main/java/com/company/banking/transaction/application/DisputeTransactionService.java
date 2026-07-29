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
    private final AuditEventPublisher auditEventPublisher;

    @Transactional
    public TransactionResponse disputeTransaction(Long id, DisputeReasonRequest request) {
        log.info("[TRANSACTION DISPUTE] Flagging transaction ID {} with code {}", id, request.getReasonCode());

        Transaction tx = ledgerPersistencePort.findById(id)
                .orElseThrow(() -> new NotFoundException("Transaction not found for ID: " + id));

        tx.setDisputed(true);
        tx.setDisputeReason(request.getReasonCode() + ": " + (request.getNotes() != null ? request.getNotes() : "No notes"));

        Transaction saved = ledgerPersistencePort.save(tx);
        
        String correlationId = MDC.get(CorrelationIdFilter.MDC_KEY);
        String username = "customer"; // Can be replaced with actual Spring Security Context user
        auditEventPublisher.publishEvent("DISPUTE_TRANSACTION", username, 
            "Disputed transaction " + saved.getTransactionReference() + " for reason: " + request.getReasonCode(), correlationId);

        return TransactionResponse.fromEntity(saved);
    }
}
