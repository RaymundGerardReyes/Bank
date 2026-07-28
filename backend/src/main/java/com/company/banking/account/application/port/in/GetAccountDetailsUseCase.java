package com.company.banking.account.application.port.in;

import com.company.banking.account.api.dto.AccountResponse;

public interface GetAccountDetailsUseCase {
    AccountResponse getAccountDetails(String accountNumber);
}
