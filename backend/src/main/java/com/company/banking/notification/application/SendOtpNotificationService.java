package com.company.banking.notification.application;

import com.company.banking.notification.application.port.out.EmailPort;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class SendOtpNotificationService {

    private final EmailPort emailPort;

    public void sendOtp(String email, String otpCode) {
        String subject = "NovaBank Security: Your Authentication Code";
        String message = "Your 6-digit banking verification code is: " + otpCode + 
                         "\n\nThis code will expire in 5 minutes. Do not share this with anyone, including bank employees.";
        
        emailPort.sendEmail(email, subject, message);
    }
}