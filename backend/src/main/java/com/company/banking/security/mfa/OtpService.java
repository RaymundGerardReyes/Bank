package com.company.banking.security.mfa;

import org.springframework.stereotype.Service;

import java.security.SecureRandom;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class OtpService {

    private final Map<String, String> otpCache = new ConcurrentHashMap<>();
    private final SecureRandom random = new SecureRandom();

    public String generateOtp(String key) {
        String otp = String.format("%06d", random.nextInt(1000000));
        otpCache.put(key, otp);
        return otp;
    }

    public boolean validateOtp(String key, String otp) {
        String cachedOtp = otpCache.get(key);
        if (cachedOtp != null && cachedOtp.equals(otp)) {
            otpCache.remove(key);
            return true;
        }
        return false;
    }
}
