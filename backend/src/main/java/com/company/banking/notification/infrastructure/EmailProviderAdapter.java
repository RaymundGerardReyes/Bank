package com.company.banking.notification.infrastructure;

import com.company.banking.notification.application.port.out.EmailPort;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Component;

@Slf4j
@Component
@RequiredArgsConstructor
public class EmailProviderAdapter implements EmailPort {

    private final JavaMailSender mailSender;

    @Value("${spring.mail.default-sender:${spring.mail.username:noreply@company.com}}")
    private String fromEmail;

    @Async
    @Override
    public void sendEmail(String to, String subject, String body) {
        try {
            log.info("[NOTIFICATION ADAPTER] Sending email to: {}", to);
            
            // Resolve safe from-address to avoid empty jakarta AddressException
            String resolvedFrom = (fromEmail != null && !fromEmail.isBlank()) 
                    ? fromEmail 
                    : "noreply@company.com";

            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(resolvedFrom);
            message.setTo(to);
            message.setSubject(subject);
            message.setText(body);

            mailSender.send(message);
            log.info("[NOTIFICATION ADAPTER] Email dispatched successfully to {}", to);
        } catch (Exception e) {
            log.error("[NOTIFICATION ADAPTER] Failed to send email via SMTP to {}. Error: {}", to, e.getMessage(), e);
        }
    }
}