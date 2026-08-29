package com.company.banking.payment.application.idempotency;

import com.company.banking.payment.api.dto.CreatePaymentIntentRequest;
import com.company.banking.transaction.domain.Money;
import com.company.banking.transaction.domain.CurrencyCode;
import lombok.Builder;
import lombok.Getter;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;

@Component
public class PaymentRequestNormalizer {

    @Getter
    @Builder
    public static class NormalizedPaymentRequest {
        private final Long merchantId;
        private final String sourceAccount;
        private final Money amount;
        private final String reference;
        private final String description;
    }


    public NormalizedPaymentRequest normalize(Long merchantId, CreatePaymentIntentRequest request) {
        CurrencyCode currencyCode = request.getCurrency() != null ? CurrencyCode.valueOf(request.getCurrency()) : CurrencyCode.PHP;
        Money money = Money.of(request.getAmount(), currencyCode);
        
        return NormalizedPaymentRequest.builder()
                .merchantId(merchantId)
                .sourceAccount(request.getSourceAccountId())
                .amount(money)
                .reference(request.getMerchantReference() != null ? request.getMerchantReference() : "")
                .description(request.getDescription() != null ? request.getDescription() : "")
                .build();
    }
}
