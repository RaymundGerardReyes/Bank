package com.company.banking.payment.application;

import com.company.banking.account.application.port.out.AccountPersistencePort;
import com.company.banking.account.domain.Account;
import com.company.banking.common.exception.BusinessException;
import com.company.banking.common.exception.ErrorCode;
import com.company.banking.payment.api.dto.CreatePaymentIntentRequest;
import com.company.banking.payment.api.dto.PaymentSessionResponse;
import com.company.banking.payment.domain.PaymentAttempt;
import com.company.banking.payment.domain.PaymentIntent;
import com.company.banking.payment.gateway.ExternalPaymentGateway;
import com.company.banking.payment.gateway.dto.ExternalCheckoutRequest;
import com.company.banking.payment.gateway.dto.PaymentSession;
import com.company.banking.payment.infrastructure.PaymentAttemptJpaRepository;
import com.company.banking.payment.infrastructure.PaymentIntentJpaRepository;
import com.company.banking.transaction.application.TransactionAuthorizationService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.UUID;

import com.company.banking.payment.domain.PaymentIntentStatus;

@Service
@RequiredArgsConstructor
@Slf4j
public class PaymentIntentOrchestrationService {

    @Value("${PAYMENT_WEBHOOK_HOST:http://localhost:8080}")
    private String allowedInternalHost;

    private final PaymentIntentJpaRepository paymentIntentRepository;
    private final PaymentAttemptJpaRepository paymentAttemptRepository;
    private final ExternalPaymentGateway externalPaymentGateway;
    private final AccountPersistencePort accountPersistencePort;
    private final TransactionAuthorizationService transactionAuthorizationService; 

    @Value("${payment.frontend.base-url:http://localhost:3000}")
    private String frontendBaseUrl;

    @Transactional
    public PaymentSessionResponse createAndInitiatePayment(Long merchantId, CreatePaymentIntentRequest request) {
        return createIntent(request);
    }

    @Transactional
    public PaymentSessionResponse createIntent(CreatePaymentIntentRequest request) {
        log.info("Orchestrating new Payment Intent for account: {}", request.getSourceAccountId());

        if (request.getIdempotencyKey() != null) {
            java.util.Optional<PaymentIntent> existingIntent = paymentIntentRepository.findByIdempotencyKey(request.getIdempotencyKey());
            if (existingIntent.isPresent()) {
                PaymentIntent intent = existingIntent.get();
                log.info("Idempotency hit for key: {}, returning existing intent {}", request.getIdempotencyKey(), intent.getIntentId());
                List<PaymentAttempt> attempts = paymentAttemptRepository.findByPaymentIntentId(intent.getId());
                PaymentAttempt attempt = attempts.isEmpty() ? null : attempts.get(0);
                
                return PaymentSessionResponse.builder()
                        .paymentIntentId(intent.getIntentId())
                        .provider(attempt != null ? attempt.getProvider() : "INTERNAL")
                        .checkoutType("HOSTED_CHECKOUT")
                        .checkoutUrl(attempt != null ? attempt.getCheckoutUrl() : "")
                        .expiresAt(attempt != null ? attempt.getExpiresAt() : java.time.LocalDateTime.now().plusHours(1))
                        .transactionReference(intent.getIntentId())
                        .build();
            }
        }

        Account sourceAccount = accountPersistencePort.findByAccountNumber(request.getSourceAccountId())
                .orElseThrow(() -> new BusinessException(ErrorCode.NOT_FOUND, "Source account not found"));

        if (sourceAccount.getBalance().compareTo(request.getAmount()) < 0) {
            throw new BusinessException(ErrorCode.INSUFFICIENT_FUNDS, "Insufficient funds for payment hold");
        }
        sourceAccount.setBalance(sourceAccount.getBalance().subtract(request.getAmount()));
        accountPersistencePort.save(sourceAccount);

        String generatedIntentId = "PI-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
        PaymentIntent intent = PaymentIntent.builder()
                .intentId(generatedIntentId)
                .merchantId(1L)
                .customerAccountNumber(sourceAccount.getAccountNumber())
                .amount(request.getAmount())
                .currency(sourceAccount.getCurrency())
                .status(PaymentIntentStatus.AUTHORIZED) 
                .description(request.getDescription())
                .idempotencyKey(request.getIdempotencyKey())
                .build();
        
        try {
            intent = paymentIntentRepository.save(intent);
            paymentIntentRepository.flush();
        } catch (org.springframework.dao.DataIntegrityViolationException ex) {
            log.info("Concurrent creation for idempotency key: {}", request.getIdempotencyKey());
            PaymentIntent existing = paymentIntentRepository.findByIdempotencyKey(request.getIdempotencyKey())
                    .orElseThrow(() -> new BusinessException(ErrorCode.CONFLICT, "Concurrent creation conflict"));
                    
            List<PaymentAttempt> attempts = paymentAttemptRepository.findByPaymentIntentId(existing.getId());
            PaymentAttempt attempt = attempts.isEmpty() ? null : attempts.get(0);
            
            return PaymentSessionResponse.builder()
                    .paymentIntentId(existing.getIntentId())
                    .provider(attempt != null ? attempt.getProvider() : "INTERNAL")
                    .checkoutType("HOSTED_CHECKOUT")
                    .checkoutUrl(attempt != null ? attempt.getCheckoutUrl() : "")
                    .expiresAt(attempt != null ? attempt.getExpiresAt() : java.time.LocalDateTime.now().plusHours(1))
                    .transactionReference(existing.getIntentId())
                    .build();
        }

        ExternalCheckoutRequest checkoutReq = ExternalCheckoutRequest.builder()
                .paymentIntentId(intent.getIntentId())
                .amount(intent.getAmount())
                .currency(intent.getCurrency())
                .description(intent.getDescription())
                .merchantOrderId(request.getMerchantReference())
                .successUrl(frontendBaseUrl + "/transactions/external-payment/status?intentId=" + intent.getIntentId()) 
                .failUrl(frontendBaseUrl + "/transactions/external-payment/status?intentId=" + intent.getIntentId())
                .cancelUrl(frontendBaseUrl + "/transactions/external-payment/status?intentId=" + intent.getIntentId())
                .build();

        PaymentSession session = externalPaymentGateway.createCheckout(checkoutReq);

        if (!isSafeCheckoutUrl(session.getCheckoutUrl())) {
            log.error("SECURITY VIOLATION: Provider returned an untrusted checkout URL: {}", session.getCheckoutUrl());
            throw new BusinessException(ErrorCode.INTERNAL_SERVER_ERROR, "Invalid or untrusted payment gateway checkout URL");
        }
        validateCheckoutUrl(session.getCheckoutUrl(), session.getProvider().name());

        PaymentAttempt attempt = PaymentAttempt.builder()
                .attemptId(UUID.randomUUID().toString())
                .paymentIntentId(intent.getId())
                .provider(session.getProvider().name())
                .providerReference(session.getProviderReference())
                .checkoutUrl(session.getCheckoutUrl())
                .status("PENDING")
                .expiresAt(session.getExpiresAt())
                .build();
        paymentAttemptRepository.save(attempt);

        intent.setStatus(PaymentIntentStatus.CHECKOUT_CREATED);
        paymentIntentRepository.save(intent);

        log.info("Successfully orchestrated payment intent {}. Returning checkout URL.", intent.getIntentId());

        return PaymentSessionResponse.builder()
                .paymentIntentId(intent.getIntentId())
                .provider(session.getProvider().name())
                .checkoutType(session.getChannel().name())
                .checkoutUrl(session.getCheckoutUrl())
                .expiresAt(session.getExpiresAt())
                .transactionReference(intent.getIntentId()) 
                .build();
    }

    /**
     * Validates the generated checkout URL against a strict allowlist.
     */
    public void validateCheckoutUrl(String checkoutUrl, String providerCode) {
        try {
            URI uri = new URI(checkoutUrl);

            // 1. Enforce HTTPS
            if (!"https".equalsIgnoreCase(uri.getScheme()) && !"localhost".equals(uri.getHost()) && !uri.getHost().contains("localhost")) {
                log.error("Security Alert: Provider {} returned a non-HTTPS URL: {}", providerCode, checkoutUrl);
                throw new BusinessException(ErrorCode.INTERNAL_SERVER_ERROR, "Secure checkout generation failed.");
            }

            String host = uri.getHost();
            if (host == null) {
                throw new BusinessException(ErrorCode.INTERNAL_SERVER_ERROR, "Invalid checkout URL structure.");
            }

            // 2. Strict Host Allowlist matching
            boolean isValidHost = switch (providerCode.toUpperCase()) {
                case "PAYMONGO" -> host.equals("paymongo.com") || host.endsWith(".paymongo.com");
                case "PAYNAMICS" -> host.equals("paynamics.net") || host.endsWith(".paynamics.net");
                case "MAYA" -> host.equals("maya.ph") || host.endsWith(".maya.ph");
                case "INTERNAL" -> host.contains("localhost") || host.equals("developerph.dev") || host.endsWith(".developerph.dev") || allowedInternalHost.contains(host);
                default -> host.contains("localhost") || host.equals("developerph.dev") || host.endsWith(".developerph.dev") || allowedInternalHost.contains(host);
            };

            if (!isValidHost) {
                log.error("Security Alert: Untrusted checkout domain {} for provider {}", host, providerCode);
                throw new BusinessException(ErrorCode.INTERNAL_SERVER_ERROR, "Checkout URL failed security allowlist check.");
            }

        } catch (URISyntaxException e) {
            log.error("Failed to parse checkout URL: {}", checkoutUrl, e);
            throw new BusinessException(ErrorCode.INTERNAL_SERVER_ERROR, "Malformed checkout URL returned from provider.");
        }
    }

    private boolean isSafeCheckoutUrl(String urlString) {
        try {
            URI uri = new URI(urlString);
            String host = uri.getHost();
            boolean isHttpsOrLocal = "https".equalsIgnoreCase(uri.getScheme()) || "localhost".equals(host) || host.contains("localhost");
            return isHttpsOrLocal && 
                   host != null && 
                   (host.equals("paymongo.com") || host.endsWith(".paymongo.com") || 
                    host.equals("maya.ph") || host.endsWith(".maya.ph") ||
                    host.contains("localhost") || host.equals("developerph.dev") || host.endsWith(".developerph.dev") || allowedInternalHost.contains(host));
        } catch (Exception e) {
            log.warn("URL rejected: Malformed syntax or invalid host.");
            return false;
        }
    }

    @Transactional(readOnly = true)
    public PaymentIntent getPaymentIntent(String intentId, Long merchantId) {
        PaymentIntent intent = getIntent(intentId);
        if (!intent.getMerchantId().equals(merchantId)) {
            log.warn("Unauthorized access attempt to Payment Intent {} by merchantId {}", intentId, merchantId);
            throw new BusinessException(ErrorCode.FORBIDDEN, "Not authorized to access this payment intent");
        }
        return intent;
    }

    @Transactional(readOnly = true)
    public PaymentIntent getIntent(String intentId) {
        return paymentIntentRepository.findByIntentId(intentId)
                .orElseThrow(() -> new BusinessException(ErrorCode.NOT_FOUND, "Payment Intent not found"));
    }

    @Transactional
    public void cancelIntent(String intentId) {
        PaymentIntent intent = getIntent(intentId);
        
        if (intent.getStatus() == PaymentIntentStatus.CHECKOUT_CREATED || intent.getStatus() == PaymentIntentStatus.AUTHORIZED) {
            intent.setStatus(PaymentIntentStatus.CANCELLED);
            paymentIntentRepository.save(intent);
            
            accountPersistencePort.findByAccountNumber(intent.getCustomerAccountNumber()).ifPresent(acc -> {
                acc.setBalance(acc.getBalance().add(intent.getAmount()));
                accountPersistencePort.save(acc);
            });
            log.info("Payment Intent {} has been cancelled and hold released.", intentId);
        } else {
            throw new BusinessException(ErrorCode.INVALID_REQUEST, "Cannot cancel an intent in status: " + intent.getStatus());
        }
    }
}