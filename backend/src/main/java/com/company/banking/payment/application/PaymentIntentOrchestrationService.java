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

    private static final List<String> ALLOWED_PROVIDERS = List.of(
        "paymongo.com", 
        "paynamics.net", 
        "maya.ph"
    );

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
                .build();
        
        intent = paymentIntentRepository.save(intent);

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

    private boolean isSafeCheckoutUrl(String urlString) {
        if (urlString == null || !urlString.startsWith("https://")) {
            log.warn("URL rejected: Not HTTPS or is null.");
            return false;
        }

        try {
            URI uri = new URI(urlString);
            String host = uri.getHost();

            if (host == null) {
                return false;
            }

            return ALLOWED_PROVIDERS.stream().anyMatch(domain -> 
                host.equals(domain) || host.endsWith("." + domain)
            );

        } catch (URISyntaxException e) {
            log.warn("URL rejected: Malformed syntax.");
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