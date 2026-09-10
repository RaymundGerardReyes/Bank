package com.company.banking.notification.application.port.out;

public interface PushNotificationPort {
    void sendPush(String deviceIdOrUserId, String title, String body);

    default void sendPush(String deviceIdOrUserId, String title, String body, String route, java.util.Map<String, Object> data) {
        sendPush(deviceIdOrUserId, title, body);
    }
}
