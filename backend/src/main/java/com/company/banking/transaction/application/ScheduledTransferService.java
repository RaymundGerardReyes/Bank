package com.company.banking.transaction.application;

import com.company.banking.account.application.port.out.AccountPersistencePort;
import com.company.banking.account.domain.Account;
import com.company.banking.common.exception.NotFoundException;
import com.company.banking.transaction.api.dto.InternalTransferRequest;
import com.company.banking.transaction.api.dto.TransactionResponse;
import com.company.banking.transaction.application.port.out.LedgerPersistencePort;
import com.company.banking.transaction.domain.Transaction;
import com.company.banking.transaction.domain.TransactionStatus;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class ScheduledTransferService {

    private final AccountPersistencePort accountPersistencePort;
    private final LedgerPersistencePort ledgerPersistencePort;
    private final TransactionAccountResolver accountResolver;

    @Transactional
    public TransactionResponse scheduleTransfer(InternalTransferRequest request) {
        log.info("[SCHEDULED TRANSFER] Registering deferred transfer for date {}", request.getScheduledDate());

        // VULN 1 FIX: Use centralized resolver
        Account source = accountResolver.resolveAndAuthorizeSource(request.getSourceAccountNumber());

        String txRef = "SCH-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();

        // VULN 3: Capture context during scheduling
        org.springframework.security.core.Authentication auth = org.springframework.security.core.context.SecurityContextHolder.getContext().getAuthentication();
        String vamRestriction = (auth instanceof com.company.banking.apigateway.security.ApiKeyAuthenticationToken) 
                ? ((com.company.banking.apigateway.security.ApiKeyAuthenticationToken) auth).getLinkedAccountId() 
                : null;

        java.time.LocalDateTime scheduledAt = null;
        if (request.getScheduledDate() != null && !request.getScheduledDate().trim().isEmpty()) {
            try {
                String rawDate = request.getScheduledDate().trim();
                if (rawDate.contains("T")) {
                    scheduledAt = java.time.OffsetDateTime.parse(rawDate)
                            .withOffsetSameInstant(java.time.ZoneOffset.UTC)
                            .toLocalDateTime();
                } else {
                    scheduledAt = java.time.LocalDate.parse(rawDate).atStartOfDay();
                }
            } catch (Exception e) {
                log.warn("[SCHEDULED TRANSFER] Could not parse scheduledDate: {}", request.getScheduledDate());
            }
        }

        Transaction scheduledTx = Transaction.builder()
                .transactionReference(txRef)
                .idempotencyKey(request.getIdempotencyKey())
                .sourceAccountNumber(source.getAccountNumber())
                .destinationAccountNumber(request.getDestinationAccountNumber())
                .amount(request.getAmount())
                .currency(source.getCurrency())
                .status(TransactionStatus.SCHEDULED)
                .description(request.getDescription())
                .scheduledVamRestriction(vamRestriction) // Explicitly persist context!
                .scheduledExecutionAt(scheduledAt)
                .build();

        Transaction savedTx = ledgerPersistencePort.save(scheduledTx);
        return TransactionResponse.fromEntity(savedTx);
    }
}
