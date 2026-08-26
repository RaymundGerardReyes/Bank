package com.company.banking.notification;

import com.company.banking.config.BaseIntegrationTest;
import com.company.banking.notification.application.SendTransactionAlertService;
import com.company.banking.notification.application.port.out.EmailPort;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.bean.override.mockito.MockitoBean;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.UUID;

import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.ArgumentMatchers.contains;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

@SpringBootTest
@ActiveProfiles("test")
public class NotificationWorkflowPathIT extends BaseIntegrationTest {

    @Autowired
    private SendTransactionAlertService sendTransactionAlertService;

    @MockitoBean
    private EmailPort emailPort;

    private final String SOURCE_EMAIL = "sender@novabank.com";
    private final String RECIPIENT_EMAIL = "recipient@novabank.com";
    private final String TX_REF = "TXN-" + UUID.randomUUID().toString().substring(0, 8);

    @BeforeEach
    public void setup() {
        doNothing().when(emailPort).sendEmail(anyString(), anyString(), anyString());
    }

    @Test
    @DisplayName("P01 (Dual Receipt Dispatch): Dispatches two separate emails for internal transfers")
    public void p01_DualReceiptDispatch_SendsToBothParties() {
        sendTransactionAlertService.sendTransferReceipt(
                SOURCE_EMAIL, 
                RECIPIENT_EMAIL, 
                TX_REF, 
                new BigDecimal("150.00"), 
                LocalDate.now().toString()
        );

        verify(emailPort, times(1)).sendEmail(eq(SOURCE_EMAIL), contains("Official Transfer Receipt"), contains(TX_REF));
        verify(emailPort, times(1)).sendEmail(eq(RECIPIENT_EMAIL), contains("Official Transfer Receipt"), contains(TX_REF));
    }

    @Test
    @DisplayName("P02 (Single Recipient Fallback): Safely ignores null recipient email without crashing")
    public void p02_SingleRecipientFallback_SafeExecution() {
        sendTransactionAlertService.sendTransferReceipt(
                SOURCE_EMAIL, 
                null, 
                TX_REF, 
                new BigDecimal("250.00"), 
                LocalDate.now().toString()
        );

        verify(emailPort, times(1)).sendEmail(eq(SOURCE_EMAIL), contains("Official Transfer Receipt"), contains(TX_REF));
        verify(emailPort, never()).sendEmail(eq(null), anyString(), anyString());
    }

    @Test
    @DisplayName("P03 (Standard Alerting): Formats and dispatches standard transfer alert")
    public void p03_StandardAlerting_DispatchesCorrectPayload() {
        sendTransactionAlertService.sendTransferAlert(
                SOURCE_EMAIL, 
                "ACC-123456", 
                new BigDecimal("500.00"), 
                "DEPOSIT"
        );

        verify(emailPort, times(1)).sendEmail(
                eq(SOURCE_EMAIL), 
                contains("Bank Transaction Alert: DEPOSIT"), 
                contains("ACC-123456")
        );
    }
}
