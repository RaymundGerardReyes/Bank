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
        // Generate baseline card details to satisfy V14 strict database constraints
        LocalDate expiryDate = LocalDate.now().plusYears(3);
        String formattedExpiry = expiryDate.format(DateTimeFormatter.ofPattern("MM/yy"));
        String cvv = String.format("%03d", secureRandom.nextInt(1000));
        
        account.setCardExpiry(formattedExpiry);
        account.setCardCvv(cvv);

        if (issueVirtualCard) {
            account.setSwiftCode("NOVBUS33VAM");
        } else {
            account.setSwiftCode("NOVBUS33XXX");
        }
    }
}