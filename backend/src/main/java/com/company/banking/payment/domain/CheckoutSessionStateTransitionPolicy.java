package com.company.banking.payment.domain;

import com.company.banking.common.exception.BusinessException;
import com.company.banking.common.exception.ErrorCode;
import org.springframework.stereotype.Component;

@Component
public class CheckoutSessionStateTransitionPolicy {

    public void validateTransition(CheckoutSessionStatus current, CheckoutSessionStatus next) {
        boolean isValid = false;
        
        switch (current) {
            case ACTIVE -> isValid = (next == CheckoutSessionStatus.PAYMENT_PENDING || 
                                      next == CheckoutSessionStatus.EXPIRED || 
                                      next == CheckoutSessionStatus.CANCELLED);
            case PAYMENT_PENDING -> isValid = (next == CheckoutSessionStatus.AUTHORIZED ||
                                               next == CheckoutSessionStatus.PAID || 
                                               next == CheckoutSessionStatus.ACTIVE || 
                                               next == CheckoutSessionStatus.EXPIRED ||
                                               next == CheckoutSessionStatus.CANCELLED);
            case AUTHORIZED -> isValid = (next == CheckoutSessionStatus.PAID ||
                                          next == CheckoutSessionStatus.PAYMENT_FAILED);
            case PAID, PAYMENT_FAILED, EXPIRED, CANCELLED -> isValid = false; // Strict terminal states
        }

        if (!isValid) {
            throw new BusinessException(ErrorCode.INVALID_REQUEST, 
                "Illegal checkout session state transition from " + current + " to " + next);
        }
    }
}
