package com.company.banking.payment.application;

import com.company.banking.common.audit.AuditEventPublisher;
import com.company.banking.common.exception.BusinessException;
import com.company.banking.common.exception.ErrorCode;
import com.company.banking.common.exception.NotFoundException;
import com.company.banking.payment.domain.PaymentIntent;
import com.company.banking.payment.domain.Refund;
import com.company.banking.payment.infrastructure.PaymentIntentJpaRepository;
import com.company.banking.payment.infrastructure.RefundJpaRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.UUID;

import com.company.banking.payment.domain.PaymentIntentStatus;

@Service
@RequiredArgsConstructor
@Slf4j
public class PaymentIntentService {

    private final PaymentIntentJpaRepository paymentIntentJpaRepository;
    private final RefundJpaRepository refundJpaRepository;
    private final com.company.banking.settlement.application.MerchantSettlementService merchantSettlementService;
    private final AuditEventPublisher auditEventPublisher;

    @Transactional
    public PaymentIntent createIntent(Long merchantId, String customerAccountNumber, BigDecimal amount, String currency) {
        String intentId = "pi_" + UUID.randomUUID().toString().replace("-", "");
        
        PaymentIntent intent = PaymentIntent.builder()
                .intentId(intentId)
                .merchantId(merchantId)
                .customerAccountNumber(customerAccountNumber)
                .amount(amount)
                .currency(currency)
                .status(PaymentIntentStatus.CREATED)
                .description("Payment Intent for " + amount + " " + currency)
                .build();

        PaymentIntent saved = paymentIntentJpaRepository.save(intent);
        log.info("[PAYMENT GATEWAY] PaymentIntent {} created for Merchant {}", intentId, merchantId);
        
        return saved;
    }

    @Transactional
    public PaymentIntent authorizeIntent(String intentId, Long merchantId) {
        PaymentIntent intent = paymentIntentJpaRepository.findByIntentId(intentId)
                .orElseThrow(() -> new NotFoundException("PaymentIntent not found"));

        if (!intent.getMerchantId().equals(merchantId)) {
            auditEventPublisher.publishEvent("OBJECT_LEVEL_AUTH_FAILED", merchantId.toString(), "Attempted to access PaymentIntent belonging to another merchant", intentId);
            throw new BusinessException(ErrorCode.FORBIDDEN, "Access Denied: PaymentIntent belongs to a different merchant.");
        }

        if (intent.getStatus() != PaymentIntentStatus.CREATED) {
            throw new BusinessException(ErrorCode.INVALID_REQUEST, "PaymentIntent cannot be authorized from status: " + intent.getStatus());
        }

        intent.setStatus(PaymentIntentStatus.AUTHORIZED);
        auditEventPublisher.publishEvent("PAYMENT_AUTHORIZED", intent.getMerchantId().toString(), 
                "Funds reserved for intent " + intentId, intentId);

        return paymentIntentJpaRepository.save(intent);
    }

    @Transactional
    public PaymentIntent captureIntent(String intentId, Long merchantId) {
        PaymentIntent intent = paymentIntentJpaRepository.findByIntentId(intentId)
                .orElseThrow(() -> new NotFoundException("PaymentIntent not found"));

        if (!intent.getMerchantId().equals(merchantId)) {
            auditEventPublisher.publishEvent("OBJECT_LEVEL_AUTH_FAILED", merchantId.toString(), "Attempted to capture PaymentIntent belonging to another merchant", intentId);
            throw new BusinessException(ErrorCode.FORBIDDEN, "Access Denied: PaymentIntent belongs to a different merchant.");
        }

        if (intent.getStatus() != PaymentIntentStatus.AUTHORIZED) {
            throw new BusinessException(ErrorCode.INVALID_REQUEST, "PaymentIntent must be AUTHORIZED to capture. Current status: " + intent.getStatus());
        }

        merchantSettlementService.creditMerchantBalance(intent.getMerchantId(), intent.getAmount(), intent.getCurrency());
        
        intent.setStatus(PaymentIntentStatus.CAPTURED);
        auditEventPublisher.publishEvent("PAYMENT_CAPTURED", intent.getMerchantId().toString(), 
                "Payment successfully captured for intent " + intentId, intentId);

        return paymentIntentJpaRepository.save(intent);
    }

    @Transactional
    public Refund refundIntent(String intentId, Long merchantId, BigDecimal amount, String reason) {
        PaymentIntent intent = paymentIntentJpaRepository.findByIntentId(intentId)
                .orElseThrow(() -> new NotFoundException("PaymentIntent not found"));

        if (!intent.getMerchantId().equals(merchantId)) {
            auditEventPublisher.publishEvent("OBJECT_LEVEL_AUTH_FAILED", merchantId.toString(), "Attempted to refund PaymentIntent belonging to another merchant", intentId);
            throw new BusinessException(ErrorCode.FORBIDDEN, "Access Denied: PaymentIntent belongs to a different merchant.");
        }

        if (intent.getStatus() != PaymentIntentStatus.CAPTURED) {
            throw new BusinessException(ErrorCode.INVALID_REQUEST, "Only CAPTURED intents can be refunded.");
        }

        if (amount.compareTo(intent.getAmount()) > 0) {
            throw new BusinessException(ErrorCode.INVALID_REQUEST, "Refund amount cannot exceed captured amount.");
        }

        String refundId = "re_" + UUID.randomUUID().toString().replace("-", "");
        Refund refund = Refund.builder()
                .refundId(refundId)
                .paymentIntentId(intent.getId())
                .amount(amount)
                .reason(reason)
                .status("COMPLETED")
                .build();

        Refund savedRefund = refundJpaRepository.save(refund);

        if (amount.compareTo(intent.getAmount()) == 0) {
            intent.setStatus(PaymentIntentStatus.REFUNDED);
            paymentIntentJpaRepository.save(intent);
        }

        auditEventPublisher.publishEvent("PAYMENT_REFUNDED", intent.getMerchantId().toString(), 
                "Refund processed for intent " + intentId + " amount: " + amount, refundId);

        return savedRefund;
    }
}
