package com.company.banking.account.application.port.in;

import com.company.banking.account.api.dto.AccountResponse;
import com.company.banking.account.api.dto.OpenAccountRequest;

import java.util.List;

public interface AccountUseCase {
    AccountResponse openAccount(OpenAccountRequest request);
    AccountResponse getAccountDetails(String accountNumber);
    List<AccountResponse> listCustomerAccounts(Long customerId);
}
