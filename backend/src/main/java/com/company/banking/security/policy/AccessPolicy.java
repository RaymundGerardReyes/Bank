package com.company.banking.security.policy;

import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class AccessPolicy {

    private static final List<String> RESTRICTED_IPS = List.of("192.168.1.100");

    public boolean isAllowed(String ipAddress) {
        if (ipAddress == null) {
            return false;
        }
        return !RESTRICTED_IPS.contains(ipAddress);
    }
}
