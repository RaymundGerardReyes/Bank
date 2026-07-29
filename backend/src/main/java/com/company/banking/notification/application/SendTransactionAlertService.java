package com.company.banking.notification.application;

import com.company.banking.notification.application.port.out.EmailPort;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;

@Service
@RequiredArgsConstructor
public class SendTransactionAlertService {

    private final EmailPort emailPort;

    public void sendTransferAlert(String userEmail, String accountNumber, BigDecimal amount, String type) {
        String subject = "Bank Transaction Alert: " + type;
        String body = String.format("A %s of %s was performed on your account %s.", type, amount.toString(), accountNumber);
        emailPort.sendEmail(userEmail, subject, body);
    }

    // NEW: Enterprise Receipt Email Dispatcher
    public void sendTransferReceipt(String sourceEmail, String recipientEmail, String txRef, BigDecimal amount, String date) {
        String subject = "NovaBank: Official Transfer Receipt (" + txRef + ")";
        String body = "A funds transfer of $" + amount.toString() + " has been successfully processed.\n\n" +
                      "Transaction Reference: " + txRef + "\n" +
                      "Date Executed: " + date + "\n\n" +
                      "Thank you for banking securely with NovaBank Enterprise.";

        if (sourceEmail != null && !sourceEmail.isEmpty()) {
            emailPort.sendEmail(sourceEmail, subject, body);
        }
        if (recipientEmail != null && !recipientEmail.isEmpty()) {
            emailPort.sendEmail(recipientEmail, subject, body);
        }
    }
}