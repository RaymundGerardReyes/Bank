package com.company.banking.notification.application.port.out;

public interface SmsPort {
    void sendSms(String phoneNumber, String message);
}
