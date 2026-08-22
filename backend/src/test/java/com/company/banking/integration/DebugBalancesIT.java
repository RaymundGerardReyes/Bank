package com.company.banking.integration;

import com.company.banking.account.application.port.out.AccountPersistencePort;
import com.company.banking.account.domain.Account;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;

@SpringBootTest
@ActiveProfiles("test")
public class DebugBalancesIT {

    @Autowired
    private AccountPersistencePort accountPersistencePort;

    @Test
    public void printBalances() {
        System.out.println("Debug output...");
    }
}
