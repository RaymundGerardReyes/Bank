package com.company.banking.account.application;

import com.company.banking.account.api.dto.AccountSummaryResponse;
import com.company.banking.account.application.port.in.ListCustomerAccountsUseCase;
import com.company.banking.account.application.port.out.AccountPersistencePort;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ListCustomerAccountsService implements ListCustomerAccountsUseCase {

    private final AccountPersistencePort accountPersistencePort;

    @Override
    @Transactional(readOnly = true)
    public List<AccountSummaryResponse> listAccounts(Long customerId) {
        return accountPersistencePort.findByCustomerId(customerId).stream()
                .map(acc -> AccountSummaryResponse.builder()
                        .accountNumber(acc.getAccountNumber())
                        .balance(acc.getBalance())
                        .currency(acc.getCurrency())
                        .status(acc.getStatus())
                        .swiftCode(acc.getSwiftCode())
                        .cardExpiry(acc.getCardExpiry())
                        .cardCvv(acc.getCardCvv())
                        // --- MAP VAM FIELDS ---
                        .accountType(acc.getAccountType() != null ? acc.getAccountType() : "MAIN")
                        .parentAccountId(acc.getParentAccountId())
                        .accountName(acc.getAccountName())
                        .build())
                .collect(Collectors.toList());
    }
}