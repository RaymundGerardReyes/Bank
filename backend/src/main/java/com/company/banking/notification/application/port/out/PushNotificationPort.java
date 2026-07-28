package com.company.banking.notification.application.port.out;

public interface PushNotificationPort {
    void sendPush(String deviceIdOrUserId, String title, String body);
}
