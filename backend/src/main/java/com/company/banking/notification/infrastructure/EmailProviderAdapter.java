package com.company.banking.notification.infrastructure;

import com.company.banking.notification.application.port.out.EmailPort;

import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Component;

@Slf4j
@Component
public class EmailProviderAdapter implements EmailPort {

    @Async
    @Override
    public void sendEmail(String recipient, String subject, String body) {
        log.info("[NOTIFICATION ADAPTER] Sending email to: {}, Subject: {}", recipient, subject);
        // Integrate with AWS SES, SendGrid, or SMTP here
    }
}
