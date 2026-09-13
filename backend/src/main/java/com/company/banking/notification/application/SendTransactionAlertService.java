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

    public void sendTransactionAlert(String userEmail, String message) {
        emailPort.sendEmail(userEmail, "Bank Payment Alert", message);
    }

    // NEW: Enterprise Receipt Email Dispatcher
    public void sendTransferReceipt(String sourceEmail, String recipientEmail, String txRef, BigDecimal amount, String date) {
        String formattedAmount = amount != null ? amount.toString() : "0.00";
        String formattedDate = date != null ? date : java.time.LocalDate.now().toString();
        String formattedRef = txRef != null ? txRef : "N/A";
        String subject = "NovaBank: Official Transfer Receipt (" + formattedRef + ")";
        String body = "A funds transfer of $" + formattedAmount + " has been successfully processed.\n\n" +
                      "Transaction Reference: " + formattedRef + "\n" +
                      "Date Executed: " + formattedDate + "\n\n" +
                      "Thank you for banking securely with NovaBank Enterprise.";

        if (sourceEmail != null && !sourceEmail.isEmpty()) {
            emailPort.sendEmail(sourceEmail, subject, body);
        }
        if (recipientEmail != null && !recipientEmail.isEmpty()) {
            emailPort.sendEmail(recipientEmail, subject, body);
        }
    }
}