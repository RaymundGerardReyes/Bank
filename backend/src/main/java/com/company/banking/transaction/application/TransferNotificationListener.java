package com.company.banking.transaction.application;

import com.company.banking.notification.application.port.out.PushNotificationPort;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;
import org.springframework.transaction.event.TransactionPhase;
import org.springframework.transaction.event.TransactionalEventListener;

@Component
public class TransferNotificationListener {

    private static final Logger log = LoggerFactory.getLogger(TransferNotificationListener.class);
    private final PushNotificationPort pushNotificationPort;

    public TransferNotificationListener(PushNotificationPort pushNotificationPort) {
        this.pushNotificationPort = pushNotificationPort;
    }

    /**
     * Executes strictly AFTER the database transaction has successfully committed.
     * If the push notification fails, it will NOT roll back the financial ledger.
     */
    @TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT)
    public void handleTransferCompleted(TransferCompletedEvent event) {
        try {
            String message = String.format("You have received ₱%.2f %s from %s", 
                    event.amount(), event.currency(), event.sourceAccountNumber());
                    
            pushNotificationPort.sendPush(event.destinationAccountNumber(), "Transfer Received", message);
            log.info("Successfully dispatched push notification for transfer {}", event.transactionReference());
        } catch (Exception e) {
            log.error("Failed to send push notification for transfer {}. Financial transaction remains secure.", 
                    event.transactionReference(), e);
        }
    }
}
