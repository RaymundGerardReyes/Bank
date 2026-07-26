package com.company.banking.account.application;

import com.company.banking.account.api.dto.AccountSummaryResponse;
import com.company.banking.account.application.port.out.AccountPersistencePort;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ListCustomerAccountsService {

    private final AccountPersistencePort accountPersistencePort;

    @Transactional(readOnly = true)
    public List<AccountSummaryResponse> listAccounts(Long customerId) {
        return accountPersistencePort.findByCustomerId(customerId).stream()
                .map(acc -> AccountSummaryResponse.builder()
                        .accountNumber(acc.getAccountNumber())
                        .balance(acc.getBalance())
                        .currency(acc.getCurrency())
                        .status(acc.getStatus())
                        .build())
                .collect(Collectors.toList());
    }
}
