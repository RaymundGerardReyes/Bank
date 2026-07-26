package com.company.banking.customer.domain;

import org.springframework.stereotype.Component;

@Component
public class CustomerPolicy {

    public boolean canUpdateProfile(Long requestingCustomerId, Long targetCustomerId) {
        return requestingCustomerId != null && requestingCustomerId.equals(targetCustomerId);
    }
}
