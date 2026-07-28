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
}
