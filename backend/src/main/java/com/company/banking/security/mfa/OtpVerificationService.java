package com.company.banking.security.mfa;

import com.company.banking.common.exception.ForbiddenException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class OtpVerificationService {

    private final OtpService otpService;

    public void verify(String key, String code) {
        if (!otpService.validateOtp(key, code)) {
            throw new ForbiddenException("Invalid or expired OTP");
        }
    }
}
