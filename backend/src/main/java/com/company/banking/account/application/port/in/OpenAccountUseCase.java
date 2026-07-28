package com.company.banking.account.application.port.in;

import com.company.banking.account.api.dto.AccountResponse;
import com.company.banking.account.api.dto.OpenAccountRequest;

public interface OpenAccountUseCase {
    AccountResponse openAccount(OpenAccountRequest request);
}
