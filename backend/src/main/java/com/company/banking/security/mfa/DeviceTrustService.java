package com.company.banking.security.mfa;

import org.springframework.stereotype.Service;

import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class DeviceTrustService {

    private final Set<String> trustedDevices = ConcurrentHashMap.newKeySet();

    public void trustDevice(String deviceId) {
        trustedDevices.add(deviceId);
    }

    public boolean isTrusted(String deviceId) {
        return trustedDevices.contains(deviceId);
    }
}
