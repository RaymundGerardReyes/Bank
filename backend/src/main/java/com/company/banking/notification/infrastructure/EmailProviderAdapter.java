package com.company.banking.notification.infrastructure;

import com.company.banking.notification.application.port.out.EmailPort;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Component;

@Slf4j
@Component
@RequiredArgsConstructor
public class EmailProviderAdapter implements EmailPort {

    // This is the class Spring will now recognize once Gradle downloads the library
    private final JavaMailSender mailSender;

    @Async
    @Override
    public void sendEmail(String recipient, String subject, String body) {
        log.info("[NOTIFICATION ADAPTER] Sending Google SMTP email to: {}", recipient);
        
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom("noreply-security@novabank.com");
            message.setTo(recipient);
            message.setSubject(subject);
            message.setText(body);
            
            mailSender.send(message);
            log.info("[NOTIFICATION ADAPTER] Email dispatched successfully to {}", recipient);
        } catch (Exception e) {
            log.error("[NOTIFICATION ADAPTER] Failed to send email via Google SMTP", e);
        }
    }
}