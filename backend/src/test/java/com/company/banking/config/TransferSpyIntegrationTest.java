package com.company.banking.config;

import com.company.banking.account.application.port.out.AccountPersistencePort;
import com.company.banking.notification.application.port.out.PushNotificationPort;
import org.springframework.test.context.bean.override.mockito.MockitoSpyBean;

public abstract class TransferSpyIntegrationTest extends BaseIntegrationTest {
    @MockitoSpyBean
    protected AccountPersistencePort accountPersistencePort;
    
    @MockitoSpyBean
    protected PushNotificationPort pushNotificationPort;
}
