package com.company.banking.payment.application;

import com.company.banking.payment.domain.InboundWebhookEvent;
import com.company.banking.payment.infrastructure.InboundWebhookEventJpaRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.PlatformTransactionManager;
import org.springframework.transaction.TransactionDefinition;
import org.springframework.transaction.support.TransactionTemplate;

@Slf4j
@Service
@RequiredArgsConstructor
public class WebhookIdempotencyService {

    private final InboundWebhookEventJpaRepository repository;
    private final PlatformTransactionManager transactionManager;

    /**
     * Executes in an entirely isolated micro-transaction using TransactionTemplate.
     * Programmatically committing inside the try-catch block guarantees that any
     * commit-time unique constraint violations are caught cleanly before returning.
     */
    public InboundWebhookEvent tryRegisterEvent(InboundWebhookEvent event) {
        TransactionTemplate template = new TransactionTemplate(transactionManager);
        template.setPropagationBehavior(TransactionDefinition.PROPAGATION_REQUIRES_NEW);

        try {
            return template.execute(status -> repository.saveAndFlush(event));
        } catch (DataIntegrityViolationException | org.springframework.transaction.TransactionException e) {
            log.warn("[IDEMPOTENCY] Race condition mitigated. Event {} already exists.", event.getExternalEventId());
            return null;
        }
    }
}
