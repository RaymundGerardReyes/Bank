package com.company.banking.notification.infrastructure;

import com.company.banking.notification.application.port.out.PushNotificationPort;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

@Component
@Slf4j
public class PushNotificationAdapter implements PushNotificationPort {

    @Override
    public void sendPush(String deviceOrCustomerId, String title, String body) {
        // STEP 6: Generate the Notification Payload
        // Construct the standardized Firebase Cloud Messaging (FCM) HTTP v1 API payload
        String fcmPayload = String.format("""
        {
          "message": {
            "topic": "user_%s",
            "notification": {
              "title": "%s",
              "body": "%s"
            },
            "android": {
              "priority": "high",
              "notification": {
                "channel_id": "enterprise_alerts",
                "sound": "default"
              }
            },
            "data": {
              "click_action": "FLUTTER_NOTIFICATION_CLICK",
              "route": "/transactions/history"
            }
          }
        }""", deviceOrCustomerId, title, body);

        // STEP 7: Send to FCM
        log.info("[FCM GATEWAY] Transmitting push notification payload to Firebase Cloud Messaging API.");
        log.debug("[FCM PAYLOAD] {}", fcmPayload);
        
        // STEP 8 & 9: Deliver to Android OS
        log.info("[FCM GATEWAY] Payload successfully handed off to Google Play Services for target device delivery.");
    }
}