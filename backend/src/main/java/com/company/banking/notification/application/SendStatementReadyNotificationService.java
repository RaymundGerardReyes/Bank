package com.company.banking.notification.application;

import com.company.banking.notification.infrastructure.EmailProviderAdapter;
import com.company.banking.notification.infrastructure.PushNotificationAdapter;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class SendStatementReadyNotificationService {

    private final EmailProviderAdapter emailProviderAdapter;
    private final PushNotificationAdapter pushNotificationAdapter;

    public void notifyStatementReady(String customerId, String email, String period) {
        String message = "Your account statement for " + period + " is now available to download securely.";
        emailProviderAdapter.sendEmail(email, "Your Statement is Ready", message);
        pushNotificationAdapter.sendPush(customerId, "Statement Ready", message);
    }
}
