package com.company.banking.notification.infrastructure;

import com.company.banking.notification.application.port.out.PushNotificationPort;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Component;

import java.util.HashMap;
import java.util.Map;

@Component
@RequiredArgsConstructor
@Slf4j
public class PushNotificationAdapter implements PushNotificationPort {

    private final SimpMessagingTemplate messagingTemplate;

    @Override
    public void sendPush(String deviceOrCustomerId, String title, String body) {
        // Construct the standardized WebSocket (STOMP) payload
        Map<String, Object> payload = new HashMap<>();
        payload.put("title", title);
        payload.put("body", body);
        payload.put("click_action", "FLUTTER_NOTIFICATION_CLICK"); // Preserved from previous logic
        payload.put("route", "/transactions/history");

        String destination = "/topic/user_" + deviceOrCustomerId;
        
        log.info("[STOMP GATEWAY] Transmitting push notification payload to WebSocket destination: {}", destination);
        
        try {
            messagingTemplate.convertAndSend(destination, payload);
            log.info("[STOMP GATEWAY] Payload successfully handed off to WebSocket broker for target device delivery.");
        } catch (Exception e) {
            log.error("[STOMP GATEWAY] Failed to transmit WebSocket message", e);
        }
    }
}