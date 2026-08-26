package com.company.banking.account.application.port.in;

import com.company.banking.account.api.dto.AccountResponse;
import com.company.banking.account.api.dto.UpdateAccountSettingsRequest;

public interface UpdateAccountSettingsUseCase {
    AccountResponse updateSettings(String accountNumber, UpdateAccountSettingsRequest request, Long customerId);
}
