package com.company.banking.notification.application;

import com.company.banking.notification.application.port.out.EmailPort;
import com.company.banking.notification.application.port.out.PushNotificationPort;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class SendStatementReadyNotificationService {

    private final EmailPort emailPort;
    private final PushNotificationPort pushNotificationPort;

    public void notifyStatementReady(String customerId, String email, String period) {
        String message = "Your account statement for " + period + " is now available to download securely.";
        emailPort.sendEmail(email, "Your Statement is Ready", message);
        pushNotificationPort.sendPush(customerId, "Statement Ready", message);
    }
}
