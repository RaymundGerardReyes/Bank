package com.company.banking.account.application.provisioning;

import org.springframework.stereotype.Component;
import java.security.SecureRandom;

@Component
public class AccountNumberGenerator {
    private final SecureRandom secureRandom = new SecureRandom();

    public String generateIsoPan() {
        String miiAndBin = "485922"; // NovaBank Enterprise BIN
        long randomIdentifier = (long) (secureRandom.nextDouble() * 1_000_000_000L);
        String accountIdentifier = String.format("%09d", randomIdentifier);
        int mockChecksum = secureRandom.nextInt(10);
        return miiAndBin + accountIdentifier + mockChecksum;
    }
}