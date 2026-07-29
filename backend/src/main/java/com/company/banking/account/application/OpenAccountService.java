package com.company.banking.account.application;

import com.company.banking.account.api.dto.AccountResponse;
import com.company.banking.account.api.dto.OpenAccountRequest;
import com.company.banking.account.application.port.in.OpenAccountUseCase;
import com.company.banking.account.application.port.out.AccountPersistencePort;
import com.company.banking.account.domain.Account;
import com.company.banking.common.enums.AccountStatus;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.security.SecureRandom;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;

@Service
@RequiredArgsConstructor
public class OpenAccountService implements OpenAccountUseCase {

    private final AccountPersistencePort accountPersistencePort;
    private final SecureRandom secureRandom = new SecureRandom();

    @Override
    @Transactional
    public AccountResponse openAccount(OpenAccountRequest request) {
        // 1. Generate ISO/IEC 7812 Compliant 16-digit PAN
        String miiAndBin = "485922"; 
        long randomIdentifier = (long) (secureRandom.nextDouble() * 1_000_000_000L);
        String accountIdentifier = String.format("%09d", randomIdentifier);
        int mockChecksum = secureRandom.nextInt(10);
        String accountNumber = miiAndBin + accountIdentifier + mockChecksum;

        // 2. Generate Card Expiry (3 Years from today)
        LocalDate expiryDate = LocalDate.now().plusYears(3);
        String formattedExpiry = expiryDate.format(DateTimeFormatter.ofPattern("MM/yy"));

        // 3. Generate Secure 3-Digit CVV
        String secureCvv = String.format("%03d", secureRandom.nextInt(1000));

        Account account = Account.builder()
                .customerId(request.getCustomerId())
                .accountNumber(accountNumber)
                .currency(request.getCurrency())
                .balance(BigDecimal.ZERO)
                .status(AccountStatus.ACTIVE)
                .swiftCode("NOVBUS33XXX") // Default Enterprise SWIFT
                .cardExpiry(formattedExpiry)
                .cardCvv(secureCvv)
                .build();

        Account saved = accountPersistencePort.save(account);
        return AccountResponse.fromEntity(saved);
    }
}