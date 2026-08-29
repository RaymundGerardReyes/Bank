package com.company.banking.payment.application;

import com.company.banking.account.application.port.out.AccountPersistencePort;
import com.company.banking.account.domain.Account;
import com.company.banking.common.exception.BusinessException;
import com.company.banking.common.exception.ErrorCode;
import com.company.banking.payment.api.dto.CreatePaymentIntentRequest;
import com.company.banking.payment.api.dto.PaymentSessionResponse;
import com.company.banking.payment.domain.PaymentIntent;
import com.company.banking.payment.domain.PaymentIntentStatus;
import com.company.banking.payment.gateway.ExternalPaymentGateway;
import com.company.banking.payment.gateway.dto.ExternalCheckoutRequest;
import com.company.banking.payment.gateway.dto.PaymentSession;
import com.company.banking.payment.infrastructure.PaymentIntentJpaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.transaction.support.TransactionTemplate;

import java.net.URI;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class PaymentIntentOrchestrationService {

    private final PaymentIntentJpaRepository paymentIntentRepository;
    private final AccountPersistencePort accountPersistencePort;
    private final ExternalPaymentGateway externalPaymentGateway;
    private final TransactionTemplate transactionTemplate;

    @Value("${payment.allowed-domains:paymongo.com,developerph.dev,localhost}")
    private List<String> allowedDomains;

    public PaymentSessionResponse createIntent(Long merchantId, String sourceAccountId, CreatePaymentIntentRequest request) {
        if (request.getIdempotencyKey() != null) {
            List<PaymentIntent> existing = paymentIntentRepository.findByIdempotencyKey(request.getIdempotencyKey());
            if (!existing.isEmpty()) {
                PaymentIntent intent = existing.get(0);
                if (intent.getAmount().compareTo(request.getAmount()) != 0 || !intent.getCustomerAccountNumber().equals(sourceAccountId)) {
                    throw new BusinessException(ErrorCode.CONFLICT, "Idempotency key reused with different payload");
                }
                return mapToResponse(intent);
            }
        }

        String intentId = "pi_" + UUID.randomUUID().toString().replace("-", "");
        PaymentIntent intent;
        try {
            intent = transactionTemplate.execute(status -> {
                Account account = accountPersistencePort.findByAccountNumber(sourceAccountId)
                        .orElseThrow(() -> new com.company.banking.common.exception.NotFoundException("Account not found"));

                if (account.getBalance().compareTo(request.getAmount()) < 0) {
                    throw new BusinessException(ErrorCode.INSUFFICIENT_FUNDS, "Insufficient funds");
                }
                account.setBalance(account.getBalance().subtract(request.getAmount()));
                accountPersistencePort.save(account);

                PaymentIntent newIntent = PaymentIntent.builder()
                        .intentId(intentId)
                        .merchantId(merchantId)
                        .customerAccountNumber(sourceAccountId)
                        .amount(request.getAmount())
                        .currency(request.getCurrency() != null ? request.getCurrency() : "PHP")
                        .description(request.getDescription())
                        .idempotencyKey(request.getIdempotencyKey())
                        .status(PaymentIntentStatus.CREATED)
                        .build();

                return paymentIntentRepository.saveAndFlush(newIntent);
            });
        } catch (DataIntegrityViolationException e) {
            // MVCC Race Condition Guard: Wait for the concurrent winning thread to commit to the database
            for (int i = 0; i < 5; i++) {
                try { Thread.sleep(100); } catch (InterruptedException ignored) {}
                
                List<PaymentIntent> concurrentIntents = paymentIntentRepository.findByIdempotencyKey(request.getIdempotencyKey());
                if (!concurrentIntents.isEmpty()) {
                    PaymentIntent concurrentIntent = concurrentIntents.get(0);
                    if (concurrentIntent.getAmount().compareTo(request.getAmount()) != 0 || !concurrentIntent.getCustomerAccountNumber().equals(sourceAccountId)) {
                        throw new BusinessException(ErrorCode.CONFLICT, "Idempotency key reused with different payload");
                    }
                    return mapToResponse(concurrentIntent);
                }
            }
            throw new BusinessException(ErrorCode.CONFLICT, "Failed to resolve idempotency conflict");
        }

        ExternalCheckoutRequest extReq = new ExternalCheckoutRequest();
        extReq.setPaymentIntentId(intent.getIntentId());
        extReq.setAmount(intent.getAmount());
        extReq.setCurrency(intent.getCurrency());
        extReq.setDescription(intent.getDescription());
        
        PaymentSession session = externalPaymentGateway.createCheckout(extReq);
        
        if (session.getProvider() != com.company.banking.payment.domain.PaymentProvider.INTERNAL && !isSafeCheckoutUrl(session.getCheckoutUrl())) {
            // Revert hold if malicious
            transactionTemplate.execute(status -> {
                Account account = accountPersistencePort.findByAccountNumber(sourceAccountId).orElseThrow();
                account.setBalance(account.getBalance().add(request.getAmount()));
                accountPersistencePort.save(account);
                return null;
            });
            throw new BusinessException(ErrorCode.INTERNAL_SERVER_ERROR, "Security validation failed: payment gateway checkout URL is not on the security allowlist");
        }
        
        // Finalize transaction
        PaymentSessionResponse response = transactionTemplate.execute(status -> {
            PaymentIntent updatedIntent = paymentIntentRepository.findByIntentId(intent.getIntentId()).orElseThrow();
            updatedIntent.setStatus(PaymentIntentStatus.CHECKOUT_CREATED);
            paymentIntentRepository.save(updatedIntent);
            
            PaymentSessionResponse res = mapToResponse(updatedIntent);
            res.setCheckoutUrl(session.getCheckoutUrl());
            res.setProvider(session.getProvider().name());
            return res;
        });

        return response;
    }

    private boolean isSafeCheckoutUrl(String url) {
        if (allowedDomains == null || allowedDomains.isEmpty()) return false;
        try {
            URI uri = new URI(url);
            if (!"https".equalsIgnoreCase(uri.getScheme()) && !"localhost".equals(uri.getHost())) {
                // strict HTTPS enforcement except for localhost
                if (!"http".equalsIgnoreCase(uri.getScheme()) || !"localhost".equals(uri.getHost())) {
                    return false;
                }
            }
            String host = uri.getHost();
            if (host == null) return false;
            return allowedDomains.stream().anyMatch(d -> host.equals(d) || host.endsWith("." + d));
        } catch (Exception e) {
            return false;
        }
    }

    public PaymentIntent getIntent(String id) {
        return paymentIntentRepository.findByIntentId(id)
                .orElseThrow(() -> new com.company.banking.common.exception.NotFoundException("Payment intent not found"));
    }

    public PaymentIntent getPaymentIntent(String intentId, Long merchantId) {
        PaymentIntent intent = paymentIntentRepository.findByIntentId(intentId)
                .orElseThrow(() -> new com.company.banking.common.exception.NotFoundException("Payment intent not found"));
        if (!intent.getMerchantId().equals(merchantId)) {
            throw new com.company.banking.common.exception.ForbiddenException("Not authorized to access this intent");
        }
        return intent;
    }

    @Transactional
    public void cancelIntent(String id) {
        PaymentIntent intent = getIntent(id);
        if (intent.getStatus() == PaymentIntentStatus.SUCCESS || intent.getStatus() == PaymentIntentStatus.CANCELLED) {
            throw new BusinessException(ErrorCode.INVALID_REQUEST, "Cannot cancel intent in current status");
        }
        intent.setStatus(PaymentIntentStatus.CANCELLED);
        paymentIntentRepository.save(intent);
        
        if (intent.getCustomerAccountNumber() != null) {
            Account account = accountPersistencePort.findByAccountNumber(intent.getCustomerAccountNumber()).orElseThrow();
            account.setBalance(account.getBalance().add(intent.getAmount()));
            accountPersistencePort.save(account);
        }
    }

    private PaymentSessionResponse mapToResponse(PaymentIntent intent) {
        PaymentSessionResponse response = new PaymentSessionResponse();
        response.setPaymentIntentId(intent.getIntentId());
        return response;
    }
}