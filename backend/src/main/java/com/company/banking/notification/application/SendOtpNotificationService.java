package com.company.banking.notification.application;

import com.company.banking.notification.application.port.out.SmsPort;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class SendOtpNotificationService {

    private final SmsPort smsPort;

    public void sendOtp(String phoneNumber, String otpCode) {
        String message = "Your banking verification code is: " + otpCode + ". Do not share this with anyone.";
        smsPort.sendSms(phoneNumber, message);
    }
}
