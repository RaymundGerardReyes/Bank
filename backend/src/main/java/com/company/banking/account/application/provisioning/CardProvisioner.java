package com.company.banking.account.application.provisioning;

import com.company.banking.account.domain.Account;
import org.springframework.stereotype.Component;

import java.security.SecureRandom;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;

@Component
public class CardProvisioner {
    private final SecureRandom secureRandom = new SecureRandom();

    public void attachVirtualCard(Account account, boolean issueVirtualCard) {
        if (issueVirtualCard) {
            LocalDate expiryDate = LocalDate.now().plusYears(3);
            account.setCardExpiry(expiryDate.format(DateTimeFormatter.ofPattern("MM/yy")));
            account.setCardCvv(String.format("%03d", secureRandom.nextInt(1000)));
            account.setSwiftCode("NOVBUS33VAM");
        } else {
            account.setSwiftCode("NOVBUS33XXX");
        }
    }
}