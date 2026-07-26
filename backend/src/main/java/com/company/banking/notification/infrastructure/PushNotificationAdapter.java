package com.company.banking.notification.infrastructure;

import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

@Component
@Slf4j
public class PushNotificationAdapter {

    public void sendPush(String deviceOrCustomerId, String title, String body) {
        log.info("Sending Push Notification to {} | Title: {} | Body: {}", deviceOrCustomerId, title, body);
        // Integrate with Firebase Cloud Messaging (FCM) or Apple Push Notification Service (APNs) here
    }
}
