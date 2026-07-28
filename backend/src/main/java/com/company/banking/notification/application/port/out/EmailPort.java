package com.company.banking.notification.application.port.out;

public interface EmailPort {
    void sendEmail(String toAddress, String subject, String body);
}
