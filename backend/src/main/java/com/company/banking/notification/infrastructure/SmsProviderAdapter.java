package com.company.banking.notification.infrastructure;

import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

@Component
@Slf4j
public class SmsProviderAdapter {

    public void sendSms(String phoneNumber, String message) {
        log.info("Sending SMS to {}: {}", phoneNumber, message);
        // Integrate with Twilio or AWS SNS here
    }
}
