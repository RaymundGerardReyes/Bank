package com.company.banking.security.policy;

import org.springframework.stereotype.Component;

@Component
public class SegregationOfDutiesPolicy {

    public boolean canApproveTransaction(String initiatorId, String approverId) {
        if (initiatorId == null || approverId == null) {
            return false;
        }
        // An initiator cannot approve their own transaction
        return !initiatorId.equals(approverId);
    }
}
