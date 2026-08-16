package com.company.banking.payment.domain;

import org.springframework.stereotype.Component;

/**
 * Domain Policy: Enforces the invariant that receipts can only be generated
 * for fully finalized and successful payment sessions.
 */
@Component
public class PaymentReceiptPolicy {
    
    public boolean isEligible(PaymentSession session) {
        if (session == null) {
            return false;
        }
        
        return session.getStatus() == PaymentSessionStatus.SUCCESS 
            && session.getCompletedAt() != null;
    }
}