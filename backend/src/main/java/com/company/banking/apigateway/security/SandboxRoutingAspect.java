package com.company.banking.apigateway.security;

import com.company.banking.common.exception.BusinessException;
import com.company.banking.common.exception.ErrorCode;
import com.company.banking.payment.application.PaymentEventOutboxService;
import com.company.banking.payment.domain.PaymentIntent;
import com.company.banking.payment.domain.PaymentIntentStatus;
import com.company.banking.payment.infrastructure.PaymentIntentJpaRepository;
import com.company.banking.transaction.domain.Transaction;
import com.company.banking.transaction.domain.TransactionStatus;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.UUID;

@Aspect
@Component
@Slf4j
@RequiredArgsConstructor
public class SandboxRoutingAspect {

    private final PaymentIntentJpaRepository intentRepository;
    private final PaymentEventOutboxService outboxService;

    /**
     * Intercepts capturePayment. If in TEST mode, bypasses the ledger and simulates success.
     */
    @Around("execution(* com.company.banking.payment.application.InternalPaymentExecutionService.capturePayment(..))")
    public Object routeCapture(ProceedingJoinPoint pjp) throws Throwable {
        if (isTestEnvironment()) {
            Object[] args = pjp.getArgs();
            String intentId = (String) args[0];
            Long merchantId = (Long) args[1];
            
            log.info("[SANDBOX] Intercepting Capture for Intent {}. Bypassing real ledger.", intentId);
            return simulateSandboxCapture(intentId, merchantId);
        }
        // Proceed to real LIVE execution
        return pjp.proceed();
    }

    /**
     * Intercepts refundPayment. If in TEST mode, bypasses the ledger and simulates success.
     */
    @Around("execution(* com.company.banking.payment.application.InternalPaymentExecutionService.refundPayment(..))")
    public Object routeRefund(ProceedingJoinPoint pjp) throws Throwable {
        if (isTestEnvironment()) {
            Object[] args = pjp.getArgs();
            String intentId = (String) args[0];
            Long merchantId = (Long) args[1];
            
            log.info("[SANDBOX] Intercepting Refund for Intent {}. Bypassing real ledger.", intentId);
            return simulateSandboxRefund(intentId, merchantId);
        }
        // Proceed to real LIVE execution
        return pjp.proceed();
    }

    // -------------------------------------------------------------------------
    // SANDBOX SIMULATION LOGIC
    // -------------------------------------------------------------------------

    private boolean isTestEnvironment() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth instanceof ApiKeyAuthenticationToken apiToken) {
            return "TEST".equalsIgnoreCase(apiToken.getEnvironment());
        }
        return false;
    }

    private PaymentIntent simulateSandboxCapture(String intentId, Long merchantId) {
        PaymentIntent intent = intentRepository.findByIntentId(intentId)
                .orElseThrow(() -> new BusinessException(ErrorCode.NOT_FOUND, "Payment Intent not found"));

        if (!intent.getMerchantId().equals(merchantId)) {
            throw new BusinessException(ErrorCode.FORBIDDEN, "Access Denied: PaymentIntent belongs to a different merchant.");
        }

        // Simulate Status Change
        intent.setStatus(PaymentIntentStatus.CAPTURED);
        intent.setUpdatedAt(LocalDateTime.now());
        intentRepository.save(intent);

        // Generate Dummy Transaction to satisfy Outbox payload requirements
        Transaction dummyTx = Transaction.builder()
                .transactionReference("TXN-TEST-" + UUID.randomUUID())
                .status(TransactionStatus.COMPLETED)
                .amount(intent.getAmount())
                .currency(intent.getCurrency())
                .build();

        // Emit webhook so merchant integrations can be tested locally
        outboxService.enqueuePaymentSucceeded(intent, dummyTx);

        return intent;
    }

    private PaymentIntent simulateSandboxRefund(String intentId, Long merchantId) {
        PaymentIntent intent = intentRepository.findByIntentId(intentId)
                .orElseThrow(() -> new BusinessException(ErrorCode.NOT_FOUND, "Payment Intent not found"));

        if (!intent.getMerchantId().equals(merchantId)) {
            throw new BusinessException(ErrorCode.FORBIDDEN, "Access Denied");
        }

        // Simulate Status Change
        intent.setStatus(PaymentIntentStatus.REFUNDED);
        intent.setUpdatedAt(LocalDateTime.now());
        intentRepository.save(intent);

        log.info("[SANDBOX] Simulated Refund Webhook for Intent {}", intentId);

        return intent;
    }
}
