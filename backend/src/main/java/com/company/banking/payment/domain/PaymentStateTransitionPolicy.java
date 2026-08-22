package com.company.banking.payment.domain;

import com.company.banking.common.exception.BusinessException;
import com.company.banking.common.exception.ErrorCode;
import org.springframework.stereotype.Component;

@Component
public class PaymentStateTransitionPolicy {

    public void validateCanCapture(PaymentIntentStatus status) {
        if (status != PaymentIntentStatus.AUTHORIZED) {
            throw new BusinessException(ErrorCode.INVALID_REQUEST, 
                "Payment cannot be captured. Current state is: " + status);
        }
    }

    public void validateCanCapture(String currentState) {
        if (currentState == null) {
            throw new BusinessException(ErrorCode.INVALID_REQUEST, "Payment state is null");
        }
        try {
            validateCanCapture(PaymentIntentStatus.valueOf(currentState));
        } catch (IllegalArgumentException e) {
            throw new BusinessException(ErrorCode.INVALID_REQUEST, "Invalid payment state: " + currentState);
        }
    }

    public void validateCanCancel(PaymentIntentStatus status) {
        if (status == PaymentIntentStatus.CAPTURED || status == PaymentIntentStatus.REFUNDED || status == PaymentIntentStatus.EXPIRED) {
            throw new BusinessException(ErrorCode.INVALID_REQUEST, 
                "Payment cannot be cancelled. Financial effects have already been applied. State: " + status);
        }
    }

    public void validateCanCancel(String currentState) {
        if (currentState == null) return;
        try {
            validateCanCancel(PaymentIntentStatus.valueOf(currentState));
        } catch (IllegalArgumentException e) {
            // Ignore for custom states
        }
    }

    public void validateCanExpire(PaymentIntentStatus status) {
        if (status == PaymentIntentStatus.CAPTURED || status == PaymentIntentStatus.REFUNDED) {
            throw new BusinessException(ErrorCode.INVALID_REQUEST, 
                "Payment cannot be expired. Financial effects have already been applied. State: " + status);
        }
        if (status == PaymentIntentStatus.CANCELLED) {
            throw new BusinessException(ErrorCode.INVALID_REQUEST, 
                "Payment is already cancelled and cannot be expired.");
        }
    }

    public void validateCanExpire(String currentState) {
        if (currentState == null) return;
        try {
            validateCanExpire(PaymentIntentStatus.valueOf(currentState));
        } catch (IllegalArgumentException e) {
            // Ignore for custom states
        }
    }

    public void validateCanRefund(PaymentIntentStatus status) {
        if (status != PaymentIntentStatus.CAPTURED && status != PaymentIntentStatus.PARTIALLY_REFUNDED) {
            throw new BusinessException(ErrorCode.INVALID_REQUEST, 
                "Payment cannot be refunded. Only CAPTURED or PARTIALLY_REFUNDED payments are eligible. State: " + status);
        }
    }

    public void validateCanRefund(String currentState) {
        if (currentState == null) return;
        try {
            validateCanRefund(PaymentIntentStatus.valueOf(currentState));
        } catch (IllegalArgumentException e) {
            // Ignore for custom states
        }
    }
}
